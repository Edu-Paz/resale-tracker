import AppLink from './AppLink'

function SiteHeader({ onNavigate, homePath }) {
  return (
    <header className="header">
      <div className="container">
        <AppLink className="logo logo-button" href={homePath} onNavigate={onNavigate}>
          Resale Tracker
        </AppLink>
      </div>
    </header>
  )
}

export default SiteHeader
