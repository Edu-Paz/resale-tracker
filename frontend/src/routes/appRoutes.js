export const routes = {
  home: '/',
  login: '/login',
  register: '/cadastro',
}

export function getRoute(pathname = window.location.pathname) {
  if (pathname === routes.login) return 'login'
  if (pathname === routes.register) return 'register'
  return 'home'
}
