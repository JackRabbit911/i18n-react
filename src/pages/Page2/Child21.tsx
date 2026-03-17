import type { GetText } from "i18n/types"

type Props = {
  t: GetText;
}

const Child21 = ({ t }: Props) => {
  return (
    <div className="ms-4">
      <h2>{t('Page%', '21')}</h2>
      <p>{t('first')} {t('child')} {t('from')} {t('Page%', 2)}</p>
      <p>{t('content21')}</p>
    </div>
  )
}

export default Child21
