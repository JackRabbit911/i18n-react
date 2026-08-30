// samples/mirrors-outside-react.ts — использование зеркал i18n вне React.
// Запуск: npm run samples:mirrors
//
// Показывает 4 сценария:
//   1. Прямой импорт сервиса (BR-1) — без стейт-менеджера
//   2. Effector-зеркало — реактивность через combine/sample
//   3. Redux-зеркало — слушатели стора и селекторы
//   4. Единый источник истины: одно изменение сервиса → оба зеркала
//
// Про синглтон: src/i18n/singleton.ts browser-only (top-level detectLang()
// читает window, remont.md §7.7c), поэтому для node-прогона здесь собирается
// СВОЙ сервис фабрикой I18nService — мосты создаются над ним. В браузерном
// бандле всё то же самое делается над import { i18n } from 'i18n/singleton'.

import { combine, createEffect, sample } from 'effector'
import { createStore } from 'effector'

import { I18nService } from '../src/i18n/service'
import { createI18nBridge } from '../src/i18n/effector'
import { createI18nStore, selectLang, selectDict } from '../src/i18n/redux'

// ── Сервис для node-прогона (в браузере — синглтон из i18n/singleton) ──
const i18n = new I18nService({
  transport: async (_lang, keys) => Object.fromEntries(keys.map(k => [k, `⟨${k}⟩`])),
  lang: 'en',
  delay: 10,
  preloadKeys: ['How are You?'],
})

// ── 1. Прямой импорт сервиса: BR-1, без всякого стейт-менеджера ──
const logFx = createEffect((msg: string) => {
  console.log(`  [logFx] ${msg}`)
})

// effector-эффект шлёт уведомление НА ТЕКУЩЕМ языке — строка берётся из сервиса
const notifyFx = createEffect((user: string) => {
  console.log(`  [notifyFx] ${i18n.t('Hello %s', user)}`)
})

logFx(i18n.t('friend'))
notifyFx('Andrei')

// ── 2. Effector-зеркало: реактивность через combine/sample ──
const { $lang, $dict } = createI18nBridge(i18n)

// статусная строка пересчитывается сама при смене языка/приходе переводов
const $statusLine = combine(
  $lang,
  $dict,
  (lang, dict) => `[${lang}] ${dict['How are You?'] ?? 'How are You?'}`,
)

$statusLine.watch((line) => console.log(`  [$statusLine] ${line}`))

// sample: на каждую смену языка — эффект, читающий СВЕЖИЙ язык из стора
sample({
  clock: $lang,
  target: createEffect((lang: string) => console.log(`  [sample] язык сменился на ${lang}`)),
})

// ── 3. Redux-зеркало: слушатели стора и селекторы ──
const redux = createI18nStore(i18n) // фабрика: над тем же сервисом
const unsubscribe = redux.subscribe(() => {
  const state = redux.getState()
  console.log(`  [redux] lang=${selectLang(state)}, ключей в dict=${Object.keys(selectDict(state)).length}`)
})

// ── 4. Единый источник истины: одно изменение сервиса → оба зеркала ──
console.log('--- setLang("ru") на сервисе:')
i18n.setLang('ru')

console.log('--- t("How are You?") → конвейер ядра (debounce → fetch → merge → notify):')
i18n.t('How are You?')

await new Promise(r => setTimeout(r, 50)) // даём debounce ядра отработать

console.log('--- после мержа:')
console.log(`  i18n.getLang()=${i18n.getLang()}, t=${i18n.t('How are You?')}`)
console.log(`  $statusLine=${$statusLine.getState()}`)
console.log(`  redux: lang=${selectLang(redux.getState())}, dict[How are You?]=${selectDict(redux.getState())['How are You?']}`)

unsubscribe() // слушатель redux снят — мост живёт дальше
console.log('--- (слушатель redux отписан, demo завершена)')
