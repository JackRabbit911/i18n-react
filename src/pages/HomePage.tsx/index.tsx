import Child01 from "./Child01"
import { useTranslate } from "i18n/hooks"

const HomePage = () => {
  const __ = useTranslate()

  return (
    <div className="p-1 border border-zinc-600">
      <h1>{__('Hello')}</h1>    
        <Child01 __={__} />
    </div>
  )
}

export default HomePage
