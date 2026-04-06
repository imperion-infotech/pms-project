import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, BedDouble, ArrowRight, Loader2, User } from 'lucide-react'
import LoadingProcess from '../../../components/common/LoadingProcess'

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
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      })

      if (!response.ok) {
        throw new Error('Invalid username or password.')
      }

      const rawText = await response.text()
      // alert("Raw Text...", rawText)

      try {
        // Attempt to parse as JSON if the backend wrapped it
        const data = JSON.parse(rawText)

        // Extract token from multiple possible keys, including nested 'data'
        const token =
          data.access_token ||
          data.accessToken ||
          data.token ||
          data.jwt ||
          (data.data && typeof data.data === 'string' ? data.data : null) ||
          (data.data && (data.data.token || data.data.accessToken || data.data.access_token))

        const refreshToken =
          data.refresh_token || data.refreshToken || (data.data && data.data.refreshToken)

        if (token) {
          localStorage.setItem('access_token', token)
        } else {
          // If JSON but no token key found, only fallback if rawText looks like a token
          if (rawText.length > 50 && rawText.includes('.')) {
            localStorage.setItem('access_token', rawText)
          }
        }

        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
      } catch {
        // If parsing fails, the response is likely a raw JWT string (e.g. "eyJ...")
        localStorage.setItem('access_token', rawText.trim())
      }

      // --- DEMO LOGIC MATCHING ---
      let demoRole = localStorage.getItem('demo_role') || 'ROLE_USER'
      if (username.toLowerCase().includes('admin')) demoRole = 'ROLE_ADMIN'
      if (username.toLowerCase().includes('manager')) demoRole = 'ROLE_MANAGER'
      localStorage.setItem('user_role', demoRole)
      // ---------------------------

      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
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
            className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-linear-to-br from-blue-500 to-blue-700 p-4 text-[15px] font-bold text-white shadow-lg shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
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
