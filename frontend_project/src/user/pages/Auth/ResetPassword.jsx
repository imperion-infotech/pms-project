import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, BedDouble, Loader2, ArrowRight } from 'lucide-react';
import LoadingProcess from '../../../components/common/LoadingProcess';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(password)}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset password. The link might be expired or invalid.');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative font-sans bg-slate-50">
        <div className="relative w-full max-w-[420px] bg-slate-800/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-white m-4 sm:m-5 box-border text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Password Reset!</h2>
          <p className="text-slate-400 text-sm mb-6">Your password has been successfully reset. You will be redirected to the login page momentarily.</p>
          <button onClick={() => navigate('/login')} className="w-full bg-slate-700 text-white rounded-xl p-3 font-semibold hover:bg-slate-600 transition-colors cursor-pointer">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative font-sans bg-slate-50">
      <LoadingProcess isLoading={loading} barOnly={true} />

      <div className="relative w-full max-w-[420px] bg-slate-800/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-white m-4 sm:m-5 box-border overflow-y-auto max-h-[95vh] custom-scrollbar">
        <div className="text-center mb-9">
          <div className="w-13 h-13 mx-auto mb-5 bg-linear-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <BedDouble size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold m-0 mb-2 tracking-tight">Reset Password</h1>
          <p className="text-slate-400 text-sm m-0">Create a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center font-medium animate-in fade-in">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">New Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" required minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3.5 px-11 text-white text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 box-border"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer outline-none">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type={showConfirmPwd ? 'text' : 'password'} placeholder="••••••••" required minLength={6}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3.5 px-11 text-white text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 box-border"
              />
              <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer outline-none">
                {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="mt-3 bg-linear-to-br from-blue-500 to-blue-700 text-white border-none rounded-xl p-4 text-[15px] font-bold cursor-pointer flex justify-center items-center gap-2 shadow-lg shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Reset Password'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
