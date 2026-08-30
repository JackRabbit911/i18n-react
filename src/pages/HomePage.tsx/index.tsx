import Child01 from "./Child01"
import { useTranslate } from "i18n/hooks"
import { useParams } from "react-router"
import { SUPPORTED_LANGS } from "i18n/config"
import ErrorCmp from "Layout/reused/ErrorCmp"

const HomePage = () => {
  const __ = useTranslate()
  const { lang } = useParams()

  // ':lang?' matches any first segment — unknown ones are a 404, not a home page
  if (lang !== undefined && !Object.hasOwn(SUPPORTED_LANGS, lang)) {
    return <ErrorCmp status={404} />
  }

  return (
    <div className="p-1 border border-zinc-600 w-full">
      <h1 className="text-xl">{__('Hello')}</h1>
      <Child01 __={__} />
    </div>
  )
}

export default HomePage
