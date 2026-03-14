type Props = {
  tuple: [lang: string, label: string];
  onClick: (lang: string) => () => void;
}

const LangItem = ({ tuple, onClick }: Props) => {
  const [lang, label] = tuple

  return (
    <li
      className="cursor-pointer hover:menu-active p-2 rounded-sm"
      onClick={onClick(lang)}
    >
      {label}
    </li>
  )
}

export default LangItem
