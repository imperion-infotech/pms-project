import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, BedDouble, ArrowRight, Loader2, User, Shield, Mail } from 'lucide-react'
import LoadingProcess from '../../../components/common/LoadingProcess'

const Register = () => {
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ username: '', password: '', role: '', emailId: '' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if the user is already authenticated
    const token = localStorage.getItem('access_token')
    if (token) {
      navigate('/')
    }
  }, [navigate])

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Response...', response)

      if (!response.ok) {
        throw new Error('Registration failed. Username might already exist.')
      }

      setSuccess(true)
      // For demo purposes (since JWT doesn't deliver role info right now)
      localStorage.setItem('demo_role', formData.role)

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError(err.message || 'An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 font-sans">
      <LoadingProcess isLoading={loading} barOnly={true} />

      {/* Register Card */}
      <div className="custom-scrollbar relative m-4 box-border max-h-[95vh] w-full max-w-[440px] overflow-y-auto rounded-3xl border border-white/10 bg-slate-800/85 p-6 text-white shadow-2xl backdrop-blur-xl sm:m-5 sm:p-10">
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30">
            <BedDouble size={28} className="text-white" />
          </div>
          <h1 className="m-0 mb-2 text-2xl font-extrabold tracking-tight">Create Account</h1>
          <p className="m-0 text-sm text-slate-400">Join Imperion PMS to manage your property</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {error && (
            <div className="animate-in fade-in rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-500">
              {error}
            </div>
          )}
          {success && (
            <div className="animate-in fade-in rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-500">
              Registration successful! Redirecting to login...
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
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="box-border w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3.5 pr-4 pl-11 text-sm text-white transition-all duration-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500" />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="box-border w-full rounded-xl border border-slate-700 bg-slate-900/60 px-11 py-3.5 text-sm text-white transition-all duration-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                placeholder="example@mail.com"
                required
                value={formData.emailId}
                onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                className="box-border w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3.5 pr-4 pl-11 text-sm text-white transition-all duration-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Role Based Access
            </label>
            <div className="relative">
              <Shield
                size={18}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
              />
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="box-border w-full cursor-pointer appearance-none rounded-xl border border-slate-700 bg-slate-900/60 py-3.5 pr-4 pl-11 text-sm text-white transition-all duration-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="" disabled>
                  Select Role...
                </option>
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_MANAGER">Manager</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-linear-to-br from-emerald-500 to-emerald-700 p-4 text-[15px] font-bold text-white shadow-lg shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-white no-underline transition-colors hover:text-emerald-400"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
