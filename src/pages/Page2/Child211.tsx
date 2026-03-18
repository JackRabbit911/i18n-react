import type { GetText } from "i18n/types"

type Props = {
  t: GetText;
}

const Child211 = ({ t }: Props) => {
  return (
    <div className="p-1 ms-4 border border-zinc-600">
      <h2>{t('Page%', '211')}</h2>
      <p>{t('first')} {t('grandson')} {t('from')} {t('Page%', 2)}</p>
    </div>
  )
}

export default Child211
