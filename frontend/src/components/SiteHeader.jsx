<<<<<<< HEAD
import AppLink from './AppLink'

function SiteHeader({ onNavigate, homePath }) {
  return (
    <header className="header">
      <div className="container">
        <AppLink className="logo logo-button" href={homePath} onNavigate={onNavigate}>
          Resale Tracker
        </AppLink>
=======
function SiteHeader({ onNavigate }) {
  return (
    <header className="header">
      <div className="container">
        <button className="logo logo-button" type="button" onClick={() => onNavigate('/')}>
          Resale Tracker
        </button>
>>>>>>> origin/master
      </div>
    </header>
  )
}

export default SiteHeader
