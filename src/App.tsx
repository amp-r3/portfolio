import Header from "./components/Header/Header"
import SmoothScroll from "./components/SmoothScroll/SmoothScroll"
import { Outlet } from "react-router";
import '@/scss/base.scss'

const App = () => {
  return (
    <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <Header />
      <SmoothScroll>
        <main className="main-content">
          <Outlet />
        </main>
      </SmoothScroll>
    </main>
  )
}

export default App