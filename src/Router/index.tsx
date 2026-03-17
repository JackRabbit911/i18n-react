import Page1 from "pages/Page1"
import Page2 from "pages/Page2"
import Page3 from "pages/Page3"
import HomePage from "pages/HomePage.tsx"
import { Route, Routes } from "react-router"
import ErrorCmp from "Layout/reused/ErrorCmp"

const Router = () => (
  <Routes>
    <Route path=':lang?/' element={<HomePage />} />
    <Route path=':lang?/page1' element={<Page1 />} />
    <Route path=':lang?/page2' element={<Page2 />} />
    <Route path=':lang?/page3' element={<Page3 />} />
    <Route path=':lang?/*' element={<ErrorCmp status={404} />} />
  </Routes>
)

export default Router
