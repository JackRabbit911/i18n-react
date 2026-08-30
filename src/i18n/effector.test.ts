// src/i18n/effector.test.ts
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { createI18nBridge } from './effector'
import { I18nService } from './service'

// синглтон на top-level зовёт detectLang() → window.location, которого нет в
// node-окружении vitest (jsdom не установлен); изолируем его: дефолтное зеркало
// $lang/$dict строится над реальным пустым I18nService, а фабрика ниже
// тестируется на своих инстансах сервиса — продакшен-код effector.ts не тронут
vi.mock('./singleton', async () => {
  const { I18nService } = await import('./service')
  return { i18n: new I18nService({}) }
})

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('effector-зеркало', () => {
  it('отражает смену языка и мерж словаря сервиса', async () => {
    const transport = vi.fn(async (_lang: string, keys: string[]) =>
      Object.fromEntries(keys.map(key => [key, key.toUpperCase()])))
    const service = new I18nService({ transport, lang: 'en', delay: 0, preloadKeys: [] })
    const { $lang, $dict } = createI18nBridge(service)

    expect($lang.getState()).toBe('en')

    service.setLang('ru')
    expect($lang.getState()).toBe('ru')
    expect($dict.getState().size).toBe(0) // словарь ru ещё пуст

    service.t('hello')
    await vi.advanceTimersByTimeAsync(0)
    expect($dict.getState().get('hello')).toBe('HELLO')
  })

  it('каждый мерж даёт новую ссылку словаря (copy-on-write доходит до стора)', async () => {
    const transport = vi.fn(async () => ({ a: 'A' }))
    const service = new I18nService({ transport, lang: 'en', delay: 0, preloadKeys: [] })
    const { $dict } = createI18nBridge(service)

    const before = $dict.getState()
    service.t('a')
    await vi.advanceTimersByTimeAsync(0)

    expect($dict.getState()).not.toBe(before)
    expect($dict.getState().get('a')).toBe('A')
  })

  it('зеркало однонаправленно: пишут только через сервис', async () => {
    const transport = vi.fn(async () => ({}))
    const service = new I18nService({ transport, lang: 'en', delay: 0, preloadKeys: [] })
    const { $lang } = createI18nBridge(service)

    // у сторов нет событий записи в сервис: смена языка только i18n.setLang
    service.setLang('ru')
    expect($lang.getState()).toBe('ru')
    expect(service.getLang()).toBe('ru')
  })
})
