import { useContext, useEffect } from "react"
import { useCallback, useRef } from 'react';

import { DEFAULT_LANG } from "./config"
import { TranslateContext } from "./context"

import type { SetLangHookType } from "./types"

const useTranslateContext = () => {
    const context = useContext(TranslateContext)

    if (context === undefined) {
        throw new Error('i18n hook must be used within an TranslateProvider');
    }

    return context
}

export const useTranslate = () => {
    const context = useTranslateContext()

    return context.gettext
}

export const useSetLang = (): SetLangHookType => {
    const context = useTranslateContext()

    const setLang = (lang: string) => {
        document.querySelector('html')?.setAttribute('lang', lang)
        context.setLang(lang)
        // clearing translate makes the provider effect fetch
        // the new language on the next render
        context.setTranslate({})
    }

    return [context.lang, setLang]
}

export const useLangPrefix = () => {
    const context = useTranslateContext()

    return (context.lang === DEFAULT_LANG) ? '' : context.lang
}

export const useDebounce = <A extends unknown[]>(
    callback: (...args: A) => void,
    delay: number
) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // cancel pending callback on unmount
    useEffect(() => () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
    }, [])

    return useCallback(
        (...args: A) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }

            timerRef.current = setTimeout(() => {
                callback(...args)
            }, delay)
        }, [callback, delay])
}
