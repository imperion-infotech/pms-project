import axios from 'axios'

/**
 * api.js - Optimized Axios Instance
 */
const api = axios.create({
  baseURL: '', // Vite proxy handles this
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // Increased to 60s for heavy uploads (images/base64)
})

// Request Interceptor: Token aur Hotel ID attach karne ke liye
api.interceptors.request.use(
  (config) => {
    // Robust check for Token
    const rawToken = localStorage.getItem('access_token')
    const hasToken = rawToken && rawToken !== 'null' && rawToken !== 'undefined'

    // Auth paths that DON'T need a token
    const isPublicAuth = config.url.includes('/auth/login') || config.url.includes('/auth/register')

    if (hasToken && !isPublicAuth) {
      // 1. Remove quotes if any
      let cleanToken = String(rawToken).trim().replace(/^"|"$/g, '')

      // 2. Ensure it starts with Bearer (case insensitive)
      if (!cleanToken.toLowerCase().startsWith('bearer ')) {
        cleanToken = `Bearer ${cleanToken}`
      }

      config.headers.Authorization = cleanToken
    }

    const activeHotelId = localStorage.getItem('activeHotelId')
    const hasHotelId = activeHotelId && activeHotelId !== 'undefined' && activeHotelId !== 'null'

    if (hasHotelId && !config.url.includes('/auth/')) {
      config.headers['X-Hotel-Id'] = activeHotelId
    }

    // Diagnostic logging for 403 Forbidden errors
    console.debug(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
      hasAuth: !!config.headers.Authorization,
      hotelId: config.headers['X-Hotel-Id']
    })

    return config
  },
  (error) => Promise.reject(error),
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
  },
)

export default api
