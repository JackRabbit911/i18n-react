import { useEffect } from "react"
import { useParams } from "react-router"

import Page1 from "./Page1"
import Page2 from "./Page2"
import Page3 from "./Page3"
import { pageSetted } from "./store"
import { SUPPORTED_LANGS } from "i18n/config"
import ErrorCmp from "Layout/reused/ErrorCmp"

const PageWrapper = () => {
  const { lang, page } = useParams()

  useEffect(() => {
    pageSetted(Number(page) || 0)
  }, [page])

  // ':lang?' matches any first segment — unknown ones are a 404, not a page
  if (lang !== undefined && !Object.hasOwn(SUPPORTED_LANGS, lang)) {
    return <ErrorCmp status={404} />
  }

  switch (page) {
    case '1': return <Page1 />
    case '2': return <Page2 />
    case '3': return <Page3 />
    default: return <ErrorCmp status={404} />
  }
}

export default PageWrapper
