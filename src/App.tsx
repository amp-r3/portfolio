import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import SmoothScroll from "./components/SmoothScroll/SmoothScroll"
import { Outlet } from "react-router";

const App = () => {
  return (
    <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <Header />
      <SmoothScroll>
        <Outlet />
        <Footer />
      </SmoothScroll>
    </main>
  )
}

export default App