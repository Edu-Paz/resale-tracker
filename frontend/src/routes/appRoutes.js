export const routes = {
  home: '/',
  login: '/login',
  register: '/cadastro',
  user: '/usuario',
  items: '/itens',
  categories: '/categorias',
  newItem: '/itens/novo',
}

export function getRoute(pathname = window.location.pathname) {
  if (pathname === routes.login) return 'login'
  if (pathname === routes.register) return 'register'
  if (pathname === routes.user) return 'user'
  if (pathname === routes.items) return 'items'
  if (pathname === routes.categories) return 'categories'
  if (pathname === routes.newItem) return 'new-item'
  return 'home'
}
