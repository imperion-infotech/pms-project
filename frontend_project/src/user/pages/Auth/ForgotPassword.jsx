import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight, Loader2, BedDouble } from 'lucide-react'
import LoadingProcess from '../../../components/common/LoadingProcess'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch(`/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to send reset link. Please check your email and try again.')
      }

      setMessage('If an account exists with this email, a reset password link has been sent.')
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 font-sans">
      <LoadingProcess isLoading={loading} barOnly={true} />

      <div className="custom-scrollbar relative m-4 box-border max-h-[95vh] w-full max-w-[420px] overflow-y-auto rounded-3xl border border-white/10 bg-slate-800/85 p-6 text-white shadow-2xl backdrop-blur-xl sm:m-5 sm:p-10">
        <Link
          to="/login"
          className="absolute top-6 left-6 text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={24} />
        </Link>
        <div className="mt-4 mb-9 text-center">
          <div className="mx-auto mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30">
            <BedDouble size={28} className="text-white" />
          </div>
          <h1 className="m-0 mb-2 text-2xl font-extrabold tracking-tight">Forgot Password</h1>
          <p className="m-0 text-sm text-slate-400">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="animate-in fade-in rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-500">
              {error}
            </div>
          )}
          {message && (
            <div className="animate-in fade-in rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-500">
              {message}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="box-border w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3.5 pr-4 pl-11 text-sm text-white transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-linear-to-br from-blue-500 to-blue-700 p-4 text-[15px] font-bold text-white shadow-lg shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
