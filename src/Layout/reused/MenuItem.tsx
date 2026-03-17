import LangLink from "LangSwitcher/LangLink";

type Props = {
  label: string;
  link: string;
  extraClass?: string;
  onClick?: () => void;
}

const MenuItem = ({ label, link, extraClass, onClick }: Props) => {
  const active = false;
  const commonClass = 'cursor-pointer hover:menu-active rounded-sm'
  const className = `${commonClass} ${extraClass}${active ? ' menu-active' : ''}`

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
