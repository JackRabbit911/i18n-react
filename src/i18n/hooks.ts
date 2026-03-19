import { useContext } from "react"
import { useCallback, useRef } from 'react';

import { DEFAULT_LANG } from "./config"
import { TranslateContext } from "./TranslateProvider"

import type { SetLangHookType } from "./types"

const useTranlateContext = () => {
    const context = useContext(TranslateContext)

    if (context === undefined) {
        throw new Error('i18n hook must be used within an TranslateProvider');
    }

    return context
}

export const useTranslate = () => {
    const context = useTranlateContext()
    
    return context.gettext
}

export const useSetLang = (): SetLangHookType => {
    const context = useTranlateContext()

    const setLang =  (lang: string) => {
        document.querySelector('html')?.setAttribute('lang', lang)
        context.setLang(lang)
        context.setTranslate({})
    }

    return [ context.lang, setLang ]
}

export const useLangPrefix = () => {
    const context = useTranlateContext()

    return (context.lang === DEFAULT_LANG) ? '' : context.lang
}

export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }, [callback, delay])
}
