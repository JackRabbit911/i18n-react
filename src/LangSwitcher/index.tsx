import { useRef } from "react";
import Icon from "./Icon";
import LangItem from "./LangItem";
import { useSetLang } from "i18n/hooks";
import { SUPPORTED_LANGS } from "i18n/config";
import { pageSetted, subPageReset } from "pages/store";

const LangSwitcher = () => {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const [ lang, setLang ] = useSetLang()
  const tuples = Object.entries(SUPPORTED_LANGS).filter((value) => value[0] !== lang)

  const onLang = (lang: string) => () => {
    setLang(lang)
    pageSetted(0)
    subPageReset()
    detailsRef.current?.removeAttribute('open')
  }

  return (
    <details className="dropdown dropdown-end" ref={detailsRef}>
      <summary style={{ listStyle: 'none' }} className="btn btn-square btn-ghost">
        <Icon />
      </summary>
      <ul className="dropdown-content menu bg-base-100 max-h-[70vh] overflow-y-auto rounded-box z-50 min-w-38 p-2 mt-3 shadow-sm">
        {tuples.map((tuple, key) => (<LangItem key={key} tuple={tuple} onClick={onLang} />))}
      </ul>
    </details>
  )
}

export default LangSwitcher
