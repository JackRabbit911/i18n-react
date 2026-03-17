import { useTranslate } from "i18n/hooks"
import Child11 from "./Child11"

const Page1 = () => {
  const __ = useTranslate()

  return (
    <div>
      <h1>{__('Page%', 1)}</h1>
      <Child11 __={__} />
    </div>
  )
}

export default Page1
