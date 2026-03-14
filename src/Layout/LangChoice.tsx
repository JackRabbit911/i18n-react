import { useRef } from "react";
import LangItem from "./reused/LangItem"
import Lang from "./reused/icons/Lang";

const LangChoice = () => {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const onLang = (lang: string) => () => {
    document.querySelector('html')?.setAttribute('lang', lang)
    detailsRef.current?.removeAttribute('open')
  }

  return (
    <>
      <details className="dropdown dropdown-end" ref={detailsRef}>
        <summary style={{ listStyle: 'none' }} className="btn btn-square btn-ghost">
          <Lang />
        </summary>
        <ul className="dropdown-content menu bg-base-100 max-h-[70vh] overflow-y-auto rounded-box z-50 min-w-38 p-2 mt-3 shadow-sm">
          <LangItem tuple={['ru', 'Русский']} onClick={onLang} />
          <LangItem tuple={['en', 'English']} onClick={onLang} />
          <LangItem tuple={['ol', 'Олбанцкей']} onClick={onLang} />
        </ul>
      </details>
    </>
  )
}

export default LangChoice
