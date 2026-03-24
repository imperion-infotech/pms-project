import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, BedDouble, ArrowRight, Loader2, User, Shield } from 'lucide-react';
import LoadingProcess from '../../../components/common/LoadingProcess';


const Register = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', role: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if the user is already authenticated
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed. Username might already exist.');
      }

      setSuccess(true);
      // For demo purposes (since JWT doesn't deliver role info right now)
      localStorage.setItem('demo_role', formData.role);

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative font-sans bg-slate-50">
      <LoadingProcess isLoading={loading} barOnly={true} />

      {/* Register Card */}
      <div className="relative w-full max-w-[440px] bg-slate-800/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-white m-4 sm:m-5 box-border overflow-y-auto max-h-[95vh] custom-scrollbar">
        <div className="text-center mb-9">
          <div className="w-13 h-13 mx-auto mb-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BedDouble size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold m-0 mb-2 tracking-tight">Create Account</h1>
          <p className="text-slate-400 text-sm m-0">Join Imperion PMS to manage your property</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center font-medium animate-in fade-in">{error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm rounded-xl text-center font-medium animate-in fade-in">Registration successful! Redirecting to login...</div>}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Enter your username" required
                value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3.5 pr-4 pl-11 text-white text-sm outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 box-border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" required
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3.5 px-11 text-white text-sm outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 box-border"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer outline-none">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Role Based Access</label>
            <div className="relative">
              <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <select required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3.5 pr-4 pl-11 text-white text-sm outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 box-border appearance-none cursor-pointer"
              >
                <option value="" disabled>Select Role...</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="mt-3 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-none rounded-xl p-4 text-[15px] font-bold cursor-pointer flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-white font-semibold no-underline hover:text-emerald-400 transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
