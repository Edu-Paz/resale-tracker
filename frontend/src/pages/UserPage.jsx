import { useEffect, useState } from 'react'
import { ApiError, getCurrentUser } from '../services/api'
import { clearToken, getToken } from '../services/session'
import { routes } from '../routes/appRoutes'

function UserPage({ onNavigate }) {
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      onNavigate(routes.login)
      return
    }

    getCurrentUser(token)
      .then(setUser)
      .catch((error) => {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          clearToken()
          onNavigate(routes.login)
          return
        }
        setErrorMessage('Não foi possível carregar seus dados. Tente novamente.')
      })
  }, [onNavigate])

  function handleLogout() {
    clearToken()
    onNavigate(routes.login)
  }

  if (errorMessage) {
    return <main className="user-main"><p className="form-message form-error" role="alert">{errorMessage}</p></main>
  }

  if (!user) {
    return <main className="user-main"><p className="user-loading" role="status">Carregando seus dados...</p></main>
  }

  return (
    <main className="user-main">
      <section className="user-card" aria-labelledby="user-title">
        <div className="user-card-header">
          <div>
            <p className="eyebrow">Minha conta</p>
            <h1 id="user-title">Olá, {user.username}</h1>
          </div>
          <button className="secondary-button" type="button" onClick={handleLogout}>Sair</button>
        </div>
        <div className="user-balance">
          <span className="user-label">Saldo acumulado</span>
          <strong>R$ {Number(user.balance).toFixed(2).replace('.', ',')}</strong>
        </div>
      </section>
    </main>
  )
}

export default UserPage