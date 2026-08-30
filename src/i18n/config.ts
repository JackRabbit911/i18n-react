import { detectLangByUri } from "./utils"
import { fetchTranslate } from "./utils"
import type { GetText, TranslateType } from "./types"

export const SUPPORTED_LANGS = {
    ru: 'Русский',
    en: 'English',
    de: 'Deutsch',
}
export const DEFAULT_LANG = 'en'

export const defaultTranslateKeys = [
    'modalContent', 'use',
]

export const limit = null //cache limit in pairs key-value
export const delay = 50 //debounce delay in ms
export const getTranslateUri = 'http://localhost:8080/api/gettranslate'

export const detectLang = (): string => detectLangByUri()

//fetch translate by array keys
export const getTranslate = (lang: string, keys: string[] | null): Promise<TranslateType> => fetchTranslate(lang, keys)

export type Type__ = {
    __: GetText;
}
