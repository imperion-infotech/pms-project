import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, BedDouble, ArrowRight, Loader2, User } from 'lucide-react'
import LoadingProcess from '../../../components/common/LoadingProcess'
import api from '../../../services/api'

const Login = () => {
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if the user is already authenticated
    const token = localStorage.getItem('access_token')
    if (token) {
      navigate('/')
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Optimized: Using centralized api (axios) instead of fetch
      const response = await api.post('/auth/login', {
        username: username,
        password: password
      })

      const data = response.data
      
      // 1. Token Handling
      const token = data.token || data.access_token || data.accessToken || (typeof data === 'string' ? data : null)
      if (token) {
        localStorage.setItem('access_token', token)
        localStorage.setItem('username', username)
      }

      // 2. Hotels Extraction
      const hotelsList = data.hotels || (data.data && data.data.hotels)
      if (hotelsList && Array.isArray(hotelsList)) {
        localStorage.setItem('adminHotels', JSON.stringify(hotelsList))
      }

      // 3. User Role Extraction (Optimized to detect ADMIN easily)
      let userRole = 'ROLE_USER'
      const roles = data.roles || (data.data && data.data.roles) || data.authorities
      
      if (roles && Array.isArray(roles) && roles.length > 0) {
        // Kisi bhi role object ya string mein 'ADMIN' dhoond rahe hain
        const hasAdmin = roles.some(r => {
          const roleName = (typeof r === 'object' ? r.name || r.authority : r) || ''
          return roleName.toUpperCase().includes('ADMIN') || roleName.toUpperCase().includes('MANAGER')
        })
        
        if (hasAdmin) {
          userRole = 'ROLE_ADMIN'
        } else {
          const firstRole = roles[0].name || roles[0].authority || roles[0]
          userRole = String(firstRole)
        }
      }

      // Bypass for testing specific users as Admin if needed
      if (username.toLowerCase() === 'tejal1') {
        userRole = 'ROLE_ADMIN'
      }

      localStorage.setItem('user_role', String(userRole))
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed.'
      setError(msg === '401' ? 'Invalid credentials' : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 font-sans">
      <LoadingProcess isLoading={loading} barOnly={true} />

      {/* Login Card */}
      <div className="custom-scrollbar relative m-4 box-border max-h-[95vh] w-full max-w-[420px] overflow-y-auto rounded-3xl border border-white/10 bg-slate-800/85 p-6 text-white shadow-2xl backdrop-blur-xl sm:m-5 sm:p-10">
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30">
            <BedDouble size={28} className="text-white" />
          </div>
          <h1 className="m-0 mb-2 text-2xl font-extrabold tracking-tight">Welcome Back</h1>
          <p className="m-0 text-sm text-slate-400">Sign in to Imperion PMS</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="animate-in fade-in rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-500">
              {error}
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Username</label>
            <div className="relative">
              <User size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="box-border w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3.5 pr-4 pl-11 text-sm text-white transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <label className="text-sm font-semibold text-slate-300">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-500 no-underline transition-colors hover:text-blue-400"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500" />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="box-border w-full rounded-xl border border-slate-700 bg-slate-900/60 px-11 py-3.5 text-sm text-white transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-500 transition-colors outline-none hover:text-slate-300"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-linear-to-br from-blue-500 to-blue-700 p-4 text-pms-card font-bold text-white shadow-lg shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-white no-underline transition-colors hover:text-blue-400"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
