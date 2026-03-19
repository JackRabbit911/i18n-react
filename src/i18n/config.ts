import { detectLangByUri, fetchTranslate } from "./utils"
import type { GetText, TranslateType } from "./types"

export const SUPPORTED_LANGS = {
    ru: 'Русский',
    en: 'English',
    de: 'Deutsch',
}
export const DEFAULT_LANG = 'en'

export const limit = null //cache limit in pairs key-valaue
export const delay = 50 //debounse delay im ms

export const detectLang = (): string => detectLangByUri()
export const getTranslate = (lang: string, keys: string[]): Promise<TranslateType> => fetchTranslate(lang, keys)

export type Type__ = {
    __: GetText;
}

export type Typet = {
    t: GetText;
}
