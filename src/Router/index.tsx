import HomePage from "pages/HomePage.tsx"
import { Route, Routes } from "react-router"
import ErrorCmp from "Layout/reused/ErrorCmp"
import PageWrapper from "pages/PageWrapper"

const Router = () => (
  <Routes>
    <Route path=':lang?/' element={<HomePage />} />
    <Route path=':lang?/page/:page' element={<PageWrapper />} />
    <Route path=':lang?/*' element={<ErrorCmp status={404} />} />
  </Routes>
)

export default Router
