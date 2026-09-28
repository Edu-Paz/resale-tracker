import { useEffect, useState } from 'react'
import SiteHeader from './components/SiteHeader'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import UserPage from './pages/UserPage'
import { getRoute, routes } from './routes/appRoutes'
import { clearToken, getToken, saveToken } from './services/session'
import './index.css'

function App() {
  const [route, setRoute] = useState(getRoute)
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getToken()))

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setRoute(getRoute())
  }

  const handleAuthSuccess = (token) => {
    saveToken(token)
    setIsAuthenticated(true)
    navigate(routes.user)
  }

  const handleLogout = () => {
    clearToken()
    setIsAuthenticated(false)
    navigate(routes.home)
  }

  return (
    <>
      <SiteHeader
        homePath={routes.home}
        onNavigate={navigate}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      {route === 'login' && <AuthPage type="login" onNavigate={navigate} onAuthSuccess={(token) => {
        handleAuthSuccess(token)
      }} />}
      {route === 'register' && <AuthPage type="register" onNavigate={navigate} />}
      {route === 'home' && (isAuthenticated
        ? <UserPage onNavigate={navigate} />
        : <HomePage onNavigate={navigate} />)}
      {route === 'user' && <UserPage onNavigate={navigate} />}
      {route === 'items' && <UserPage onNavigate={navigate} initialTab="items" />}
      {route === 'categories' && <UserPage onNavigate={navigate} initialTab="categories" />}
      {route === 'new-item' && <UserPage onNavigate={navigate} initialTab="item" />}
    </>
  )
}

export default App
