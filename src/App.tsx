import Header from "./components/Header/Header"
import SmoothScroll from "./components/SmoothScroll/SmoothScroll"
import { Outlet, useNavigation } from "react-router";
import '@/styles/main.scss'
import Loader from "./components/UI/Loader/Loader";


const App = () => {
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading'
  return (
    <>
      <Header />
      {
        isLoading && <Loader />
      }
      <SmoothScroll>
        <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
          <Outlet />
        </main>
      </SmoothScroll>
    </>
  )
}

export default App