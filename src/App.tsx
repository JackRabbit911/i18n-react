import Layout from "Layout"
import { BrowserRouter } from "react-router"
import Router from "Router"

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Router />
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App
