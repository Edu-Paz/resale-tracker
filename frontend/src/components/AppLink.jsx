function AppLink({ href, onNavigate, children, className = '' }) {
  const handleClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    event.preventDefault()
    onNavigate(href)
  }

  return (
    <a className={className} href={href} onClick={handleClick}>
      {children}
    </a>
  )
}

export default AppLink
