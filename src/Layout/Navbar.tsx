import { useRef } from "react"

import LangSwitcher from "LangSwitcher"
import MenuItem from "./reused/MenuItem"
import { pageSetted } from "pages/store"
import { useTranslate } from "i18n/hooks"
import Sandwich from "./reused/icons/Sanwich"
import LangLink from "LangSwitcher/LangLink"
import ThemeToggler from "./reused/ThemeToggler"

const Navbar = () => {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const __ = useTranslate()

  const closeDropDown = () => {
    detailsRef.current?.removeAttribute('open')
  }

  const onBrandClick = () => {
    pageSetted(0)
    detailsRef.current?.removeAttribute('open')
  }

  return (
    <div className="glass sticky top-0 z-40">
      <nav className="navbar md:container lg:w-3xl xl:w-6xl mx-auto flex flex-row justify-between">
        <details className="dropdown sm:hidden" ref={detailsRef}>
          <summary style={{ listStyle: 'none' }} className="btn btn-square btn-ghost">
            <Sandwich />
          </summary>
          <ul className="dropdown-content menu bg-base-100 max-h-[70vh] overflow-y-auto rounded-box z-50 min-w-38 p-2 mt-3 shadow-sm">
            <MenuItem label="Page1" pageNum={1} extraClass="p-2" onClick={closeDropDown} />
            <MenuItem label="Page2" pageNum={2} extraClass="p-2" onClick={closeDropDown} />
            <MenuItem label="Page3" pageNum={3} extraClass="p-2" onClick={closeDropDown} />
          </ul>
        </details>
        <div className="sm:flex-1">
          <div className="flex flex-row">
            <LangLink to='/'>
              <button
                className="btn btn-ghost"
                onClick={onBrandClick}
              >
                {__('Homepage')}
              </button>
            </LangLink>
            <ul className="menu menu-horizontal px-1 py-1 hidden sm:flex">
              <MenuItem label={__('Page%', '1')} pageNum={1} extraClass="mx-1 px-1 pt-1.5 pb-2" />
              <MenuItem label={__('Page%', '2')} pageNum={2} extraClass="mx-1 px-1 pt-1.5 pb-2" />
              <MenuItem label={__('Page%', '3')} pageNum={3} extraClass="mx-1 px-1 pt-1.5 pb-2" />
            </ul>
          </div>
        </div>
        <div className="flex-none">
          <ThemeToggler />
          <LangSwitcher />
        </div>
      </nav>
    </div>
  )
}

export default Navbar
