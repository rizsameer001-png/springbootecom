import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/refresh', { refreshToken })
          const { token } = res.data
          localStorage.setItem('token', token)
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api

// API methods
export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  refresh: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),
}

export const productApi = {
  getAll: (params) => api.get('/api/products', { params }),
  getFeatured: () => api.get('/api/products/featured'),
  getById: (id) => api.get(`/api/products/${id}`),
  // Admin
  adminGetAll: (params) => api.get('/api/admin/products', { params }),
  create: (data) => api.post('/api/admin/products', data),
  update: (id, data) => api.put(`/api/admin/products/${id}`, data),
  delete: (id) => api.delete(`/api/admin/products/${id}`),
}

export const categoryApi = {
  getAll: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
  // Admin
  create: (data) => api.post('/api/admin/categories', data),
  update: (id, data) => api.put(`/api/admin/categories/${id}`, data),
  delete: (id) => api.delete(`/api/admin/categories/${id}`),
}

export const orderApi = {
  create: (data) => api.post('/api/orders', data),
  getMyOrders: (params) => api.get('/api/orders/my-orders', { params }),
  getById: (id) => api.get(`/api/orders/${id}`),
  // Admin
  adminGetAll: (params) => api.get('/api/admin/orders', { params }),
  updateStatus: (id, data) => api.put(`/api/admin/orders/${id}/status`, data),
}

export const adminApi = {
  getDashboardStats: () => api.get('/api/admin/dashboard/stats'),
  getUsers: (params) => api.get('/api/admin/users', { params }),
}
