import { Link } from "react-router";
import { DEFAULT_LANG } from "i18n/config";

type Props = {
  tuple: [lang: string, label: string];
  onClick: (lang: string) => () => void;
}

const LangItem = ({ tuple, onClick }: Props) => {
  const [lang, label] = tuple
  const homeLink = lang === DEFAULT_LANG ? '' : lang

  return (
    <Link to={homeLink}>
      <li
        className="cursor-pointer hover:menu-active p-2 rounded-sm"
        onClick={onClick(lang)}
      >
        {label}
      </li>
    </Link>
  )
}

export default LangItem
