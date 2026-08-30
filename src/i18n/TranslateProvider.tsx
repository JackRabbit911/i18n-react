import { useCallback, useEffect, useRef, useState } from "react";

import { TranslateContext } from "./context";
import { useDebounce } from "./hooks";
import { sprintf, updateTranslate } from "./utils";
import { defaultTranslateKeys, delay, detectLang, getTranslate } from "./config";
import type { Argv, TranslateType } from "./types";

type Props = {
  deps?: React.DependencyList;
  children?: React.ReactNode;
}

const TranslateProvider = ({ deps = [], children }: Props) => {
  const [translate, setTranslate] = useState<TranslateType>({})
  const [lang, setLang] = useState<string>(detectLang())
  const translateKeys = useRef<string[]>(defaultTranslateKeys)

  const gettext = useCallback((key: string, ...argv: Argv) => {
    if (Object.hasOwn(translate, key)) {
      return sprintf(translate[key], ...argv)
    }

    if (!translate[key] && !translateKeys.current.includes(key)) {
      translateKeys.current.push(key)
    }

    return sprintf(key, ...argv)
  }, [translate])

  const debouncedFetch = useDebounce((lang: string, keys: string[]) => {
    getTranslate(lang, keys)
    .then((result: TranslateType) => {
      // functional update: merge into the *latest* state,
      // an older in-flight response can't overwrite a newer one
      updateTranslate(result, translateKeys, setTranslate)
    })
    .catch(console.error)
  }, delay)

  useEffect(() => {
    const keys = Object.keys(translate)
    const diff = translateKeys.current.filter(x => !keys.includes(x));

    if (diff.length > 0) {
      debouncedFetch(lang, diff)
    }
  }, [lang, translate, debouncedFetch, deps])

  return (
    <TranslateContext.Provider value={{ gettext, setTranslate, lang, setLang }}>
      {children}
    </TranslateContext.Provider>
  )
}

export default TranslateProvider
