import { useUnit } from "effector-react";

import { $page } from "pages/store";
import LangLink from "LangSwitcher/LangLink";

type Props = {
  label: string;
  pageNum: number;
  extraClass?: string;
  onClick?: () => void;
}

const MenuItem = ({ label, pageNum, extraClass, onClick }: Props) => {
  const page = useUnit($page)
  const active = page === pageNum
  const commonClass = 'cursor-pointer hover:menu-active rounded-sm'
  const className = `${commonClass} ${extraClass}${active ? ' menu-active' : ''}`
  const link = `/page/${pageNum}`

  return (
    <LangLink to={link}>
      <li
        className={className}
        onClick={onClick}
      >
        {label}
      </li>
    </LangLink>
  )
  }

  export default MenuItem
