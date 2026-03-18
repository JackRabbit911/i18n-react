import { useUnit } from "effector-react"
import { useLocation } from "react-router"

import Layout from "Layout"
import Router from "Router"
import { $subPageNum } from "pages/store"
import TranslateProvider from "i18n/TranslateProvider"

function App() {
  const location = useLocation()
  const globalNum = useUnit($subPageNum)

  return (
    <TranslateProvider
      deps={[location.pathname, globalNum]}
    >
      <Layout>
        <Router />
      </Layout>
    </TranslateProvider>
  )
}

export default App
