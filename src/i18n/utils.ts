import { DEFAULT_LANG, SUPPORTED_LANGS, getTranslateUri } from "./config";
import type { Argv, TranslateType } from "./types";

// sprintf with "%s" placeholders: each placeholder consumes one argv,
// so values containing "%" can't hijack the next substitution
export const sprintf = (str: string, ...argv: Argv): string =>
    str.replace(/%s/g, () => argv.length ? String(argv.shift()) : '%s');

export const detectLangByUri = () => {
    // window может отсутствовать (node/SSR-запуск модулей, тянущих синглтон):
    // без DOM-детекции возвращаем язык по умолчанию
    if (typeof window === 'undefined') {
        return DEFAULT_LANG
    }

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
