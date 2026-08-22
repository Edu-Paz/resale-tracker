const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(response.status, body?.message || 'Não foi possível concluir a solicitação.')
  }

  return body
}

export function login(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function register(credentials) {
  return request('/users/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getCurrentUser(token) {
  return request('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function getItems(token) {
  return request('/items', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function getCategories(token) {
  return request('/categories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}