import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, BedDouble, Loader2, ArrowRight } from 'lucide-react'
import LoadingProcess from '../../../components/common/LoadingProcess'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!token) {
      setError('Invalid or missing reset token.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(password)}`,
        {
          method: 'POST',
        },
      )

      if (!response.ok) {
        throw new Error('Failed to reset password. The link might be expired or invalid.')
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-slate-50 font-sans">
        <div className="relative m-4 box-border w-full max-w-[420px] rounded-3xl border border-white/10 bg-slate-800/85 p-6 text-center text-white shadow-2xl backdrop-blur-xl sm:m-5 sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
            <CheckCircle size={32} />
          </div>
          <h2 className="mb-3 text-2xl font-bold">Password Reset!</h2>
          <p className="mb-6 text-sm text-slate-400">
            Your password has been successfully reset. You will be redirected to the login page
            momentarily.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full cursor-pointer rounded-xl bg-slate-700 p-3 font-semibold text-white transition-colors hover:bg-slate-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 font-sans">
      <LoadingProcess isLoading={loading} barOnly={true} />

      <div className="custom-scrollbar relative m-4 box-border max-h-[95vh] w-full max-w-[420px] overflow-y-auto rounded-3xl border border-white/10 bg-slate-800/85 p-6 text-white shadow-2xl backdrop-blur-xl sm:m-5 sm:p-10">
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30">
            <BedDouble size={28} className="text-white" />
          </div>
          <h1 className="m-0 mb-2 text-2xl font-extrabold tracking-tight">Reset Password</h1>
          <p className="m-0 text-sm text-slate-400">Create a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="animate-in fade-in rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-500">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">New Password</label>
            <div className="relative">
              <Lock size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500" />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                required
                minLength={6}
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

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500" />
              <input
                type={showConfirmPwd ? 'text' : 'password'}
                placeholder="••••••••"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="box-border w-full rounded-xl border border-slate-700 bg-slate-900/60 px-11 py-3.5 text-sm text-white transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-500 transition-colors outline-none hover:text-slate-300"
              >
                {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="text-pms-card mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-linear-to-br from-blue-500 to-blue-700 p-4 font-bold text-white shadow-lg shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Reset Password'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
