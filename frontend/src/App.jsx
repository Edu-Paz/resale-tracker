import { useEffect, useState } from 'react'
import SiteHeader from './components/SiteHeader'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { getRoute } from './routes'
import './App.css'

function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setRoute(getRoute())
  }

  return (
    <>
      <SiteHeader onNavigate={navigate} />
      {route === 'login' && <LoginPage />}
      {route === 'register' && <RegisterPage />}
      {route === 'home' && <HomePage />}
    </>
  )
}

export default App
