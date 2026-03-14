import ErrorCmp from "Layout/reused/ErrorCmp"
import HomePage from "pages/HomePage.tsx"
import Page1 from "pages/Page1"
import Page2 from "pages/Page2"
import Page3 from "pages/Page3"
import { Route, Routes } from "react-router"

const Router = () => (
  <Routes>
    <Route path='/' element={<HomePage />} />
    <Route path='/page1' element={<Page1 />} />
    <Route path='/page2' element={<Page2 />} />
    <Route path='/page3' element={<Page3 />} />
    <Route path='*' element={<ErrorCmp status={404} />} />
  </Routes>
)

export default Router
