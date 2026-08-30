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
