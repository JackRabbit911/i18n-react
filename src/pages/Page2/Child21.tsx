import type { GetText } from "i18n/types"
import Child211 from "./Child211";

type Props = {
  t: GetText;
}

const Child21 = ({ t }: Props) => {
  return (
    <div className="p-1 ms-4 border border-zinc-600">
      <h2>{t('Page%', '21')}</h2>
      <p>{t('first')} {t('child')} {t('from')} {t('Page%', 2)}</p>
      <p>{t('content21')}</p>
      <Child211 t={t} />
    </div>
  )
}

export default Child21
