import { DEFAULT_LANG, limit, SUPPORTED_LANGS } from "./config";
import type { TranslateType } from "./types";

export const sprintf = (str: string, ...argv: any[]): string => !argv.length ? str :
    sprintf(str = str.replace("%", argv.shift()), ...argv);

export const updateTranslate = (
    translate: TranslateType,
    result: TranslateType,
    translateKeys: React.RefObject<string[]>,
    setTranslate: React.Dispatch<React.SetStateAction<TranslateType>>
) => {
    const keys = Object.keys(translate)

    if (limit) {
        const n = keys.length + Object.keys(result).length - limit

        if (n > 0) {
            keys.slice(0, n).forEach(key => delete translate[key]);
        }
    }

    setTranslate({ ...translate, ...result })
    translateKeys.current.length = 0
    result = {}
}

export const detectLangByAttribute = (): string => (
    document.querySelector('html')?.getAttribute('lang') || DEFAULT_LANG || navigator.language.split('-')[0]
)

export const detectLangByUri = () => {
    const segments = window.location.pathname.split('/').filter(Boolean)
    const langs = Object.keys(SUPPORTED_LANGS).filter((value) => value !== DEFAULT_LANG)
    return langs.includes(segments[0]) ? segments[0] : DEFAULT_LANG
}

export const getTranslateDefault = async (lang: string, keys: string[]): Promise<TranslateType> => {
    const response = await fetch('http://localhost/api/gettranslate', {
        method: 'POST',
        headers: {
            'Accept-Language': lang,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filter: keys })
    })

    return response.json().then((data) => data.result)
}

export const fetchTranslate = (lang: string, keys: string[]): Promise<TranslateType> => (
    fetch('http://localhost/api/gettranslate', {
        method: 'POST',
        headers: {
            'Accept-Language': lang,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filter: keys })
    }).then((response) => response.json())
        .then((data) => data.result)
)
