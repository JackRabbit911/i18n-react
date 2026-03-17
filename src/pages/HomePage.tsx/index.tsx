import Child01 from "./Child01"
import { useTranslate } from "i18n/hooks"

const HomePage = () => {
  const __ = useTranslate()

  return (
    <div>
      <h1>{__('Hello')}</h1>    
        <Child01 __={__} />
    </div>
  )
}

export default HomePage
