import axios from 'axios'

/**
 * api.js - Optimized Axios Instance
 */
const api = axios.create({
  baseURL: '', // Vite proxy handles this
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Request Interceptor: Token aur Hotel ID attach karne ke liye
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      const cleanToken = token.trim().replace(/^"|"$/g, '')
      config.headers.Authorization = cleanToken.startsWith('Bearer ') ? cleanToken : `Bearer ${cleanToken}`
    }

    const activeHotelId = localStorage.getItem('activeHotelId')
    if (activeHotelId && !config.url.includes('/auth/')) {
      config.headers['X-Hotel-Id'] = activeHotelId
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Global Error Handling (Logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized. Logging out...')
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
