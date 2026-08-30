// src/i18n/redux.ts
import { configureStore, createSlice } from "@reduxjs/toolkit"
import type { EnhancedStore } from "@reduxjs/toolkit"

import { i18n } from "./singleton"
import type { I18nService } from "./service"

// read-only проекция сервиса в redux: поток данных строго сервис → redux.
// Назначение зеркала — реактивность для redux-кода (thunk'и, слушатели стора,
// селекторы); чтение из не-React кода — прямой import { i18n } и вызов i18n.t()
export type I18nState = {
  lang: string
  dict: Readonly<Record<string, string>>
}

export type I18nReduxStore = EnhancedStore<{
  i18n: I18nState
}>

// словарь ядра — Map; redux-экосистема любит сериализуемые plain-объекты
// (devtools, combineReducers), поэтому в сторе живёт plain-снапшот
const toDictSnapshot = (dict: ReadonlyMap<string, string>): Readonly<Record<string, string>> =>
  Object.fromEntries(dict)

export const createI18nStore = (service: I18nService): I18nReduxStore => {
  const i18nSlice = createSlice({
    name: 'i18n',
    initialState: {
      lang: service.getLang(),
      dict: toDictSnapshot(service.getDict()),
    },
    // пустые редьюсеры — намеренно: публичных событий записи в зеркало нет,
    // стор меняется только из подписки на сервис (как в effector-мосте)
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addMatcher(
          (action) => action.type === 'i18n/sync',
          (state) => {
            state.lang = service.getLang()
            state.dict = toDictSnapshot(service.getDict())
          },
        )
    },
  })

  const store = configureStore({ reducer: { i18n: i18nSlice.reducer } })

  // ровно одна подписка на сервис гонит его изменения в redux.
  // Диспатч на каждый notify; дедупликация — на слое подписчиков стора
  // (redux подписан на изменения ссылок state, иммутабельность — его контракт)
  service.subscribe(() => {
    store.dispatch({ type: 'i18n/sync' })
  })

  return store
}

// зеркало по умолчанию над сконфигурированным синглтоном
export const store = createI18nStore(i18n)

export type RootState = ReturnType<typeof store.getState>

// селекторы над RootState встраиваемого среза
export const selectLang = (state: RootState): string => state.i18n.lang
export const selectDict = (state: RootState): Readonly<Record<string, string>> => state.i18n.dict
