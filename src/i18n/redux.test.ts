// src/i18n/redux.test.ts
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { createI18nStore, selectLang, selectDict } from './redux'
import { I18nService } from './service'

// синглтон на top-level зовёт detectLang() → window.location, которого нет в
// node-окружении vitest (jsdom не установлен); изолируем его: дефолтный стор
// строится над реальным пустым I18nService, а фабрика ниже тестируется на
// своих инстансах сервиса — продакшен-код redux.ts не тронут
vi.mock('./singleton', async () => {
  const { I18nService } = await import('./service')
  return { i18n: new I18nService({}) }
})

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const makeService = () => {
  const transport = vi.fn(async (_lang: string, keys: string[]) =>
    Object.fromEntries(keys.map(key => [key, key.toUpperCase()])))
  return new I18nService({ transport, lang: 'en', delay: 0, preloadKeys: [] })
}

describe('redux-зеркало', () => {
  it('отражает смену языка и мерж словаря сервиса', async () => {
    const service = makeService()
    const store = createI18nStore(service)

    expect(selectLang(store.getState())).toBe('en')

    service.setLang('ru')
    expect(selectLang(store.getState())).toBe('ru')
    expect(Object.keys(selectDict(store.getState())).length).toBe(0) // словарь ru ещё пуст

    service.t('hello')
    await vi.advanceTimersByTimeAsync(0)
    expect(selectDict(store.getState())['hello']).toBe('HELLO')
  })

  it('каждый мерж даёт новую ссылку dict в сторе (copy-on-write доходит до redux)', async () => {
    const service = makeService()
    const store = createI18nStore(service)

    const before = selectDict(store.getState())
    service.t('a')
    await vi.advanceTimersByTimeAsync(0)

    expect(selectDict(store.getState())).not.toBe(before)
    expect(selectDict(store.getState())['a']).toBe('A')
  })

  it('зеркало однонаправленно: диспатч не пишет в сервис, пишут только через i18n.setLang', () => {
    const service = makeService()
    const store = createI18nStore(service)

    store.dispatch({ type: 'i18n/sync' }) // чужой/служебный экшен не меняет сервис

    expect(service.getLang()).toBe('en')
    service.setLang('ru')
    expect(selectLang(store.getState())).toBe('ru')
    expect(service.getLang()).toBe('ru')
  })

  it('селекторы возвращают согласованные значения после двух смен языка', async () => {
    const service = makeService()
    const store = createI18nStore(service)

    service.t('hello') // en-словарь наполняется первым
    await vi.advanceTimersByTimeAsync(0)
    service.setLang('ru')
    service.t('bye')
    await vi.advanceTimersByTimeAsync(0)
    service.setLang('en') // возврат: hello берётся из кэша en, без сети

    expect(selectLang(store.getState())).toBe('en')
    expect(selectDict(store.getState())['hello']).toBe('HELLO') // из кэша en
    expect(selectDict(store.getState())['bye']).toBeUndefined() // ru-ключ не протекает
  })
})
