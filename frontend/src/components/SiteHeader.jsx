import AppLink from './AppLink'
import { routes } from '../routes/appRoutes'

function SiteHeader({ onNavigate, homePath }) {
  return (
    <header className="header">
      <div className="container">
        <AppLink className="logo logo-button" href={homePath} onNavigate={onNavigate}>
          Resale Tracker
        </AppLink>
        <nav className="header-nav" aria-label="Navegação principal">
          <AppLink className="header-link" href={routes.items} onNavigate={onNavigate}>
            Gerenciar itens
          </AppLink>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
