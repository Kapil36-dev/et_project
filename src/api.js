
// Central API for your React app.
// If you already have modular API files (api/http.js, api/items.js, etc.),
// you can delete them and use this single file, or keep both and migrate gradually.

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

// Core HTTP helpers
async function apiRequest(path, { method = 'GET', body } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${method} ${path} failed: ${res.status} ${text}`)
  }
  // 204 No Content
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (path) => apiRequest(path, { method: 'GET' }),
  post: (path, body) => apiRequest(path, { method: 'POST', body }),
  put: (path, body) => apiRequest(path, { method: 'PUT', body }),
  delete: (path, body) => apiRequest(path, { method: 'DELETE', body }),
}

// USERS
export const registerUser = (user) => api.post('/api/users/register', user)
export const getUser = (userId) => api.get(`/api/users/${encodeURIComponent(userId)}`)

// ITEMS
export const getAvailableItems = () => api.get('/api/items')
export const getItem = (id) => api.get(`/api/items/${encodeURIComponent(id)}`)
export const createItem = (item) => api.post('/api/items/register', item)
export const updateItem = (id, item) => api.put(`/api/items/${encodeURIComponent(id)}`, item)

// BOOKINGS
export const initiateBooking = (booking) => api.post('/api/bookings/initiate', booking)
export const approveBooking = (bookingId) => api.put(`/api/bookings/${encodeURIComponent(bookingId)}/approve`)
export const rejectBooking = (bookingId) => api.put(`/api/bookings/${encodeURIComponent(bookingId)}/reject`)
export const confirmReturn = (bookingId) => api.put(`/api/bookings/${encodeURIComponent(bookingId)}/return`)
export const getUserBookings = (userId) => api.get(`/api/bookings/user/${encodeURIComponent(userId)}`)

// PAYMENTS
export const processPayment = (payment) => api.post('/api/payments/process', payment)
export const getPaymentsByBorrower = (borrowerId) => api.get(`/api/payments/user/${encodeURIComponent(borrowerId)}`)

// RETURNS
export const initiateReturn = (payload) => api.post('/api/returns/initiate', payload) // { bookingId, returnerId }
export const completeReturn = (returnId) => api.put(`/api/returns/${encodeURIComponent(returnId)}/complete`)
