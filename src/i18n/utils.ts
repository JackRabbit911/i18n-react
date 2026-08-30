import { DEFAULT_LANG, SUPPORTED_LANGS, defaultTranslateKeys, getTranslateUri, limit } from "./config";
import type { Argv, TranslateType } from "./types";

// sprintf with "%s" placeholders: each placeholder consumes one argv,
// so values containing "%" can't hijack the next substitution
export const sprintf = (str: string, ...argv: Argv): string =>
    str.replace(/%s/g, () => argv.length ? String(argv.shift()) : '%s');

export const updateTranslate = (
    result: TranslateType,
    translateKeys: React.RefObject<string[]>,
    setTranslate: React.Dispatch<React.SetStateAction<TranslateType>>
) => {
    setTranslate((translate) => {
        if (!limit) {
            return { ...translate, ...result }
        }

        // LRU-ish eviction: drop oldest keys to stay within the limit
        const keys = Object.keys(translate)
        const n = keys.length + Object.keys(result).length - limit

        if (n <= 0) {
            return { ...translate, ...result }
        }

        const rest = { ...translate }
        keys.slice(0, n).forEach(key => delete rest[key]);
        return { ...rest, ...result }
    })

    translateKeys.current = defaultTranslateKeys
}

export const detectLangByUri = () => {
    const segments = window.location.pathname.split('/').filter(Boolean)
    const langs = Object.keys(SUPPORTED_LANGS).filter((value) => value !== DEFAULT_LANG)
    return langs.includes(segments[0]) ? segments[0] : DEFAULT_LANG
}

//fetch translate by array keys
export const fetchTranslate = (lang: string, keys: string[] | null): Promise<TranslateType> => (
    fetch(getTranslateUri, {
        method: 'POST',
        headers: {
            'Accept-Language': lang,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filter: keys })
    }).then((response) => response.json())
        .then((data) => data.result)
)
