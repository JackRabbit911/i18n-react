// src/i18n/effector.ts
import { createEvent, createStore } from "effector"
import type { Store } from "effector"

import { i18n } from "./singleton"
import type { I18nService } from "./service"

// read-only проекция сервиса в effector: поток данных строго сервис → effector.
// Назначение зеркала — реактивность (combine/sample в effector-сторах);
// чтение из не-React кода — прямой import { i18n } и вызов i18n.t()
export type I18nBridge = {
  $lang: Store<string>
  $dict: Store<ReadonlyMap<string, string>>
}

export const createI18nBridge = (service: I18nService): I18nBridge => {
  const langChanged = createEvent<string>()
  const dictChanged = createEvent<ReadonlyMap<string, string>>()

  const $lang = createStore(service.getLang())
  const $dict = createStore(service.getDict())

  $lang.on(langChanged, (_, lang) => lang)
  $dict.on(dictChanged, (_, dict) => dict)

  // ровно одна подписка на сервис гонит его изменения в effector;
  // effector сам дедуплицирует не изменившиеся значения сторов
  service.subscribe(() => {
    langChanged(service.getLang())
    dictChanged(service.getDict())
  })

  return { $lang, $dict }
}

// зеркало по умолчанию над сконфигурированным синглтоном
export const { $lang, $dict } = createI18nBridge(i18n)
