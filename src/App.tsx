import TranslateProvider from "i18n/TranslateProvider"
import Layout from "Layout"
import { BrowserRouter } from "react-router"
import Router from "Router"

function App() {
  return (
    <BrowserRouter>
      <TranslateProvider>
        <Layout>
          <Router />
        </Layout>
      </TranslateProvider>
    </BrowserRouter>
  )
}

export default App
