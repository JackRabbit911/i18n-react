import { createContext, useCallback, useEffect, useRef, useState } from "react";

import { useDebounce } from "./hooks";
import { sprintf, updateTranslate } from "./utils";
import { delay, detectLang, getTranslate } from "./config";
import type { Argv, TranslateContextType, TranslateType } from "./types";

export const TranslateContext = createContext<TranslateContextType | undefined>(undefined)

type Props = {
  deps?: React.DependencyList;
  children?: React.ReactNode;
}

const TranslateProvider = ({ deps = [], children }: Props) => {
  const [translate, setTranslate] = useState<TranslateType>({})
  const [lang, setLang] = useState<string>(detectLang())
  const translateKeys = useRef<string[]>([])

  const gettext = useCallback((key: string, ...argv: Argv) => {
    if (Object.hasOwn(translate, key)) {
      return sprintf(translate[key], ...argv)
    }
    
    if (!translate[key] && !translateKeys.current.includes(key)) {
      translateKeys.current.push(key)
    }

    return sprintf(key, ...argv)
  }, [translate])

  const debouncedFetch = useDebounce((lang, keys) => {
    getTranslate(lang, keys)
    .then((result: TranslateType) => {
      updateTranslate(translate, result, translateKeys, setTranslate)
    })
  }, delay)
  
  useEffect(() => {
    const keys = Object.keys(translate)
    const diff = translateKeys.current.filter(x => !keys.includes(x));

    if (diff.length > 0) {
      debouncedFetch(lang, translateKeys.current)
    }
  }, deps)

  return (
    <TranslateContext.Provider value={{ gettext, setTranslate, lang, setLang }}>
      {children}
    </TranslateContext.Provider>
  )
}

export default TranslateProvider
