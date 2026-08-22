import { useEffect, useState } from 'react'
import SiteHeader from './components/SiteHeader'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import { getRoute, routes } from './routes/appRoutes'

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
      <SiteHeader homePath={routes.home} onNavigate={navigate} />

      {route === 'login' && <AuthPage type="login" onNavigate={navigate} />}
      {route === 'register' && <AuthPage type="register" onNavigate={navigate} />}
      {route === 'home' && <HomePage onNavigate={navigate} />}
    </>
  )
}

export default App
