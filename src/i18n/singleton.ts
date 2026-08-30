// src/i18n/singleton.ts
import { I18nService } from "./service"
import { getTranslate, detectLang, delay, limit, defaultTranslateKeys } from "./config"

// синглтон i18n: единственное место, где ядро встречается с окружением
// (реальный транспорт, URL-детекция языка, debounce-задержка из конфига).
// Отдельный модуль — не config.ts: config участвует в цикле config↔utils
// (service → utils → config), и инстанциация класса из service на top-level
// config.ts ломала бы node-граф импортов (unit-тесты) TDZ-ошибкой.
export const i18n = new I18nService({
    transport: getTranslate,
    lang: detectLang(),
    delay,
    limit,
    preloadKeys: defaultTranslateKeys,
})
