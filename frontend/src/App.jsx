import { useEffect, useState } from 'react'
import SiteHeader from './components/SiteHeader'
<<<<<<< HEAD
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import { getRoute, routes } from './routes/appRoutes'
=======
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { getRoute } from './routes'
import './App.css'
>>>>>>> origin/master

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
<<<<<<< HEAD
      <SiteHeader homePath={routes.home} onNavigate={navigate} />

      {route === 'login' && <AuthPage type="login" onNavigate={navigate} />}
      {route === 'register' && <AuthPage type="register" onNavigate={navigate} />}
      {route === 'home' && <HomePage onNavigate={navigate} />}
=======
      <SiteHeader onNavigate={navigate} />
      {route === 'login' && <LoginPage />}
      {route === 'register' && <RegisterPage />}
      {route === 'home' && <HomePage />}
>>>>>>> origin/master
    </>
  )
}

export default App
