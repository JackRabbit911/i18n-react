import { useTranslate } from "i18n/hooks"
import Child21 from "./Child21"

const Page2 = () => {
  const t = useTranslate()

  return (
    <div>
      <h1>{t('Page%', 2)}</h1>
      <p>{t('content2')}</p>
      <Child21 t={t} />
    </div>
  )
}

export default Page2
