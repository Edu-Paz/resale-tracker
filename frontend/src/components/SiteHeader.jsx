function SiteHeader({ onNavigate }) {
  return (
    <header className="header">
      <div className="container">
        <button className="logo logo-button" type="button" onClick={() => onNavigate('/')}>
          Resale Tracker
        </button>
      </div>
    </header>
  )
}

export default SiteHeader
