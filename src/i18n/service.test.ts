// src/i18n/service.test.ts
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { I18nService } from './service'
import type { TranslateType } from './types'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const makeTransport = (result?: TranslateType) =>
  vi.fn(async (_lang: string, keys: string[]) =>
    result ?? Object.fromEntries(keys.map(key => [key, key.toUpperCase()])))

describe('I18nService: конвейер', () => {
  it('t() без перевода возвращает фолбэк (sprintf ключа) и регистрирует ключ', () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 50 })

    expect(s.t('Hello %s', 'World')).toBe('Hello World')
    expect(s.getPending()).toEqual(['Hello %s'])
    expect(transport).not.toHaveBeenCalled() // debounce ещё не истёк
  })

  it('батчит ключи одного тика в один запрос после delay', async () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 50 })

    s.t('a'); s.t('b'); s.t('c')
    await vi.advanceTimersByTimeAsync(50)

    expect(transport).toHaveBeenCalledTimes(1)
    expect(transport).toHaveBeenCalledWith('en', ['a', 'b', 'c'])
    expect(s.t('a')).toBe('A')
    expect(s.t('b')).toBe('B')
    expect(s.t('c')).toBe('C')
  })

  it('повторный таймер не назначается, пока предыдущий не истёк', async () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 50 })

    s.t('a')
    await vi.advanceTimersByTimeAsync(30)
    s.t('b') // второй ключ в тот же pending-цикл
    await vi.advanceTimersByTimeAsync(50)

    expect(transport).toHaveBeenCalledTimes(1)
    expect(transport).toHaveBeenCalledWith('en', ['a', 'b'])
  })

  it('ключ, отсутствующий в ответе, получает значение = ключ (без вечного рефетча)', async () => {
    const transport = vi.fn(async () => ({ known: 'KNOWN' }))
    const s = new I18nService({ transport, lang: 'en', delay: 0 })

    expect(s.t('unknown')).toBe('unknown')
    await vi.advanceTimersByTimeAsync(0)

    expect(s.t('unknown')).toBe('unknown') // уже из словаря (self-fallback)
    expect(transport).toHaveBeenCalledTimes(1)
    expect(s.t('known')).toBe('KNOWN')
  })

  it('успешный мерж увеличивает version и уведомляет подписчиков', async () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 0 })
    const listener = vi.fn()
    s.subscribe(listener)

    const v0 = s.getVersion()
    s.t('a')
    await vi.advanceTimersByTimeAsync(0)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(s.getVersion()).toBe(v0 + 1)
  })

  it('ошибка транспорта не роняет сервис: ключ можно запросить снова', async () => {
    const transport = vi.fn(async (): Promise<TranslateType> => { throw new Error('boom') })
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const s = new I18nService({ transport, lang: 'en', delay: 0 })

    s.t('a')
    await vi.advanceTimersByTimeAsync(0)
    expect(s.t('a')).toBe('a') // фолбэк

    transport.mockImplementation(async () => ({ a: 'A' }))
    s.t('a')
    await vi.advanceTimersByTimeAsync(0)
    expect(s.t('a')).toBe('A')
    consoleError.mockRestore()
  })
})

describe('I18nService: языки', () => {
  it('setLang уведомляет подписчиков сразу, словарь нового языка подтягивается конвейером', async () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 0, preloadKeys: [] })
    const listener = vi.fn()
    s.subscribe(listener)

    s.setLang('ru')
    expect(listener).toHaveBeenCalledTimes(1) // мгновенный notify
    expect(s.getLang()).toBe('ru')

    s.t('hello')
    await vi.advanceTimersByTimeAsync(0)
    expect(transport).toHaveBeenCalledWith('ru', ['hello'])
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('поздний ответ старого языка не уведомляет и не портит новый язык', async () => {
    let resolveEn!: (value: TranslateType) => void
    const transport = vi.fn((lang: string) =>
      lang === 'en'
        ? new Promise<TranslateType>(resolve => { resolveEn = resolve })
        : Promise.resolve({ hello: 'привет' }))
    const s = new I18nService({ transport, lang: 'en', delay: 0, preloadKeys: [] })
    const listener = vi.fn()
    s.subscribe(listener)

    s.t('hello')                          // en-запрос завис
    await vi.advanceTimersByTimeAsync(0)
    expect(listener).not.toHaveBeenCalled()

    s.setLang('ru')                       // notify №1
    s.t('hello')                          // ru-запрос — свой, per-lang
    await vi.advanceTimersByTimeAsync(0)
    expect(listener).toHaveBeenCalledTimes(2) // setLang + ru-мерж
    expect(s.t('hello')).toBe('привет')

    resolveEn({ hello: 'hello-en-late' }) // старый язык доехал поздно
    await vi.advanceTimersByTimeAsync(0)
    expect(listener).toHaveBeenCalledTimes(2) // без нового notify
    expect(s.t('hello')).toBe('привет')       // ru не загрязнён
    expect(s.getDict('en').get('hello')).toBe('hello-en-late') // лёг в кэш en
  })

  it('возврат на загруженный язык не ходит в сеть', async () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 0, preloadKeys: [] })

    s.setLang('ru')
    s.t('hello')
    await vi.advanceTimersByTimeAsync(0)
    const callsAfterFirstLoad = transport.mock.calls.length

    s.setLang('en')
    s.setLang('ru')
    expect(s.t('hello')).toBe('HELLO') // из кэша
    await vi.advanceTimersByTimeAsync(100)
    expect(transport.mock.calls.length).toBe(callsAfterFirstLoad)
  })

  it('preloadKeys фетчатся при старте и при каждой смене языка', async () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 0, preloadKeys: ['modalContent'] })

    await vi.advanceTimersByTimeAsync(0)
    expect(transport).toHaveBeenCalledWith('en', ['modalContent'])

    s.setLang('ru')
    await vi.advanceTimersByTimeAsync(0)
    expect(transport).toHaveBeenCalledWith('ru', ['modalContent'])
  })

  it('setLang на тот же язык — no-op без notify', () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', preloadKeys: [] })
    const listener = vi.fn()
    s.subscribe(listener)

    s.setLang('en')
    expect(listener).not.toHaveBeenCalled()
  })

  it('setLang не перезапрашивает preloadKeys, уже лежащие в словаре целевого языка (кэш-хит)', async () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 0, preloadKeys: ['modalContent'] })

    await vi.advanceTimersByTimeAsync(0) // en: modalContent → MODALCONTENT
    expect(transport).toHaveBeenCalledTimes(1)

    s.setLang('ru')
    await vi.advanceTimersByTimeAsync(0) // ru: modalContent → MODALCONTENT
    expect(transport).toHaveBeenCalledTimes(2)

    s.setLang('en') // ключ уже в словаре en — третий запрос не нужен
    await vi.advanceTimersByTimeAsync(100)
    expect(transport).toHaveBeenCalledTimes(2)
    expect(s.t('modalContent')).toBe('MODALCONTENT')
  })
})

describe('I18nService: limit', () => {
  it('limit выселяет самые старые ключи внутри языка', async () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 0, limit: 2, preloadKeys: [] })

    s.t('a'); s.t('b')
    await vi.advanceTimersByTimeAsync(0) // словарь {a, b}

    s.t('c')
    await vi.advanceTimersByTimeAsync(0) // overflow=1 → 'a' выселен

    expect(s.t('a')).toBe('a') // выпал → фолбэк на ключ (и повторная постановка)
    expect(s.t('b')).toBe('B')
    expect(s.t('c')).toBe('C')
  })

  it('limit=null (по умолчанию) ничего не выселяет', async () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 0, preloadKeys: [] })

    s.t('a'); s.t('b'); s.t('c')
    await vi.advanceTimersByTimeAsync(0)

    expect(s.t('a')).toBe('A')
    expect(s.t('b')).toBe('B')
    expect(s.t('c')).toBe('C')
  })

  it('эвикция не затрагивает словари других языков', async () => {
    const transport = makeTransport()
    const s = new I18nService({ transport, lang: 'en', delay: 0, limit: 1, preloadKeys: [] })

    s.t('a')
    await vi.advanceTimersByTimeAsync(0)
    s.setLang('ru')
    s.t('b')
    await vi.advanceTimersByTimeAsync(0)

    expect(s.getDict('en').get('a')).toBe('A') // en не тронут
    expect(s.getDict('ru').get('b')).toBe('B')
    expect(s.getDict('en').size).toBe(1)
    expect(s.getDict('ru').size).toBe(1)
  })
})
