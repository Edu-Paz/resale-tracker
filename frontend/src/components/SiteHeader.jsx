import AppLink from './AppLink'
import { routes } from '../routes/appRoutes'

function SiteHeader({ onNavigate, homePath, isAuthenticated, onLogout }) {
  return (
    <header className="header">
      <div className="container">
        <AppLink className="logo logo-button" href={homePath} onNavigate={onNavigate}>
          Resale Tracker
        </AppLink>
        <nav className="header-nav" aria-label="Navegação principal">
          {isAuthenticated ? (
            <>
              <AppLink className="header-link" href={routes.items} onNavigate={onNavigate}>
                Gerenciar itens
              </AppLink>
              <AppLink className="header-link" href={routes.categories} onNavigate={onNavigate}>
                Categorias
              </AppLink>
              <button className="header-button" type="button" onClick={onLogout}>
                Sair
              </button>
            </>
          ) : (
            <AppLink className="header-link" href={routes.login} onNavigate={onNavigate}>
              Entrar
            </AppLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
