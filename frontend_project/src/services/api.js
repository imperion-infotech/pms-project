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

      // Remove any existing Bearer prefix to normalize it
      if (cleanToken.toLowerCase().startsWith('bearer ')) {
        cleanToken = cleanToken.substring(7).trim()
      }

      // 2. Ensure it starts exactly with Bearer
      config.headers.Authorization = `Bearer ${cleanToken}`
    }

    const activeHotelId = localStorage.getItem('activeHotelId')
    const hasHotelId = activeHotelId && activeHotelId !== 'undefined' && activeHotelId !== 'null'

    if (hasHotelId && !config.url.includes('/auth/')) {
      config.headers['X-Hotel-Id'] = activeHotelId
    }

    // Diagnostic logging for 403 Forbidden errors
    console.debug(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
      hasAuth: !!config.headers.Authorization,
      hotelId: config.headers['X-Hotel-Id'],
    })

    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor: Global Error Handling (Logout on 401, Debug on 403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized. Logging out...')
      localStorage.clear()
      window.location.href = '/login'
    }

    // 🔍 Deep 403 Debug — Temporary diagnostic (remove after fixing)
    if (error.response && error.response.status === 403) {
      const rawToken = localStorage.getItem('access_token')
      let decodedRole = 'UNKNOWN'
      try {
        const cleanToken = String(rawToken).trim().replace(/^"|"$/g, '')
        const payload = JSON.parse(atob(cleanToken.split('.')[1]))
        decodedRole = payload.role || payload.roles || payload.authorities || 'NOT_FOUND_IN_TOKEN'
        console.error('🔴 403 FORBIDDEN DEBUG:', {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          authHeader: error.config?.headers?.Authorization?.substring(0, 30) + '...',
          hotelId: error.config?.headers?.['X-Hotel-Id'],
          tokenRole: decodedRole,
          fullTokenPayload: payload,
          responseData: error.response.data,
        })
      } catch (e) {
        console.error('🔴 403 FORBIDDEN DEBUG (token decode failed):', {
          url: error.config?.url,
          rawToken: rawToken?.substring(0, 30) + '...',
          hotelId: localStorage.getItem('activeHotelId'),
          error: e.message,
        })
      }
    }

    return Promise.reject(error)
  },
)

export default api
