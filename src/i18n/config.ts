import { detectLangByUri, fetchTranslate } from "./utils"
import type { TranslateType } from "./types"

export const SUPPORTED_LANGS = {
    ru: 'Русский',
    en: 'English',
    de: 'Deutsch',
}
export const DEFAULT_LANG = 'en'

export const limit = null
export const detectLang = (): string => detectLangByUri()
export const getTranslate = (lang: string, keys: string[]): Promise<TranslateType> => fetchTranslate(lang, keys)
