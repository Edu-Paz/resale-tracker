export const routes = {
  home: '/',
  login: '/login',
  register: '/cadastro',
}

export function getRoute() {
  if (window.location.pathname === routes.login) return 'login'
  if (window.location.pathname === routes.register) return 'register'
  return 'home'
}
