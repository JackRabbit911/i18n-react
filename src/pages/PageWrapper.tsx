import { useParams } from "react-router"

import Page1 from "./Page1"
import Page2 from "./Page2"
import Page3 from "./Page3"
import { pageSetted } from "./store"
import ErrorCmp from "Layout/reused/ErrorCmp"

const PageWrapper = () => {
    const { page } = useParams()
    pageSetted(Number(page) || 0)

    console.log(page)

    switch ( page ) {
        case '1': return <Page1 />
        case '2': return <Page2 />
        case '3': return <Page3 />
        default: return <ErrorCmp status={404} />
    }
}

export default PageWrapper
