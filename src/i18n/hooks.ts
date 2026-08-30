// src/i18n/hooks.ts
import { useSyncExternalStore } from "react"

import { DEFAULT_LANG } from "./config"
import { i18n } from "./singleton"

import type { SetLangHookType } from "./types"

const subscribe = (listener: () => void) => i18n.subscribe(listener)
const getLang = () => i18n.getLang()
const getVersion = () => i18n.getVersion()

export const useTranslate = () => {
    // подписка перерисовывает только читателя при мерже словаря или смене языка
    useSyncExternalStore(subscribe, getVersion)
    return i18n.t
}

export const useSetLang = (): SetLangHookType => {
    const lang = useSyncExternalStore(subscribe, getLang)

    const setLang = (next: string) => {
        document.querySelector('html')?.setAttribute('lang', next)
        // очистка translate не нужна: сервис сам подтянет словарь нового языка
        i18n.setLang(next)
    }

    return [lang, setLang]
}

export const useLangPrefix = () => {
    const lang = useSyncExternalStore(subscribe, getLang)

    return (lang === DEFAULT_LANG) ? '' : lang
}
