import { useLocation } from "react-router";
import { createContext, useEffect, useRef, useState } from "react";
import { sprintf, updateTranslate } from "./utils";
import { detectLang, getTranslate } from "./config";
import type { Argv, ChildrenProps, TranslateContextType, TranslateType } from "./types";

export const TranslateContext = createContext<TranslateContextType | undefined>(undefined)

const TranslateProvider = ({ children }: ChildrenProps) => {
  const [translate, setTranslate] = useState<TranslateType>({})
  const [lang, setLang] = useState<string>(detectLang())
  const translateKeys = useRef<string[]>([])
  const location = useLocation()

  const gettext = (key: string, ...argv: Argv) => {
    if (Object.hasOwn(translate, key)) {
      return sprintf(translate[key], ...argv)
    }

    if (!translate[key] && !translateKeys.current.includes(key)) {
      translateKeys.current.push(key)
    }

    return sprintf(key, ...argv)
  }

  console.log(location.pathname)

  useEffect(() => {
    const keys = Object.keys(translate)
    const diff = translateKeys.current.filter(x => !keys.includes(x));

    if (diff.length > 0) {
      getTranslate(lang, translateKeys.current)
        .then((result: TranslateType) => {
          updateTranslate(translate, result, translateKeys, setTranslate)
        })
    }
  }, [lang, location.pathname])

  return (
    <TranslateContext.Provider value={{ gettext, setTranslate, lang, setLang }}>
      {children}
    </TranslateContext.Provider>
  )
}

export default TranslateProvider
