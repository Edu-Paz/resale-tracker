const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  const { headers, ...rest } = options
  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null
  if (!response.ok) throw new ApiError(response.status, body?.message || 'Não foi possível concluir a solicitação.')
  return body
}

export function login(credentials) { return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }) }
export function register(credentials) { return request('/users/register', { method: 'POST', body: JSON.stringify(credentials) }) }

function authorized(token, path, options = {}) {
  return request(path, { ...options, headers: { Authorization: `Bearer ${token}`, ...options.headers } })
}

export function getCurrentUser(token) { return authorized(token, '/users/me') }
export function getItems(token, categoryId) { return authorized(token, `/items${categoryId ? `?categoryId=${categoryId}` : ''}`) }
export function getCategories(token) { return authorized(token, '/categories') }
export function createItem(token, item) { return authorized(token, '/items', { method: 'POST', body: JSON.stringify(item) }) }
export function updateItem(token, itemId, item) { return authorized(token, `/items/${itemId}`, { method: 'PUT', body: JSON.stringify(item) }) }
export function createCategory(token, category) { return authorized(token, '/categories', { method: 'POST', body: JSON.stringify(category) }) }
export function sellItem(token, itemId, sellData) { return authorized(token, `/items/${itemId}/sell`, { method: 'PATCH', body: JSON.stringify(sellData) }) }
export function deleteItem(token, itemId) { return authorized(token, `/items/${itemId}`, { method: 'DELETE' }) }
export function getExpensesByItem(token, itemId) { return authorized(token, `/expense/item/${itemId}`) }
export function createExpense(token, expense) { return authorized(token, '/expense', { method: 'POST', body: JSON.stringify(expense) }) }
export function updateExpense(token, expenseId, expense) { return authorized(token, `/expense/${expenseId}`, { method: 'PATCH', body: JSON.stringify(expense) }) }
export function deleteExpense(token, expenseId) { return authorized(token, `/expense/${expenseId}`, { method: 'DELETE' }) }
