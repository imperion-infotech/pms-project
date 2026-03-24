import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, BedDouble, ArrowRight, Loader2, User } from 'lucide-react';
import LoadingProcess from '../../../components/common/LoadingProcess';



const Login = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the user is already authenticated
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      });

      if (!response.ok) {
        throw new Error('Invalid username or password.');
      }

      const rawText = await response.text();

      try {
        // Attempt to parse as JSON if the backend wrapped it
        const data = JSON.parse(rawText);



        if (data.access_token) localStorage.setItem('access_token', data.access_token);
        if (data.accessToken) localStorage.setItem('access_token', data.accessToken);

        if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
        if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);

        if (data.token) localStorage.setItem('access_token', data.token);
      } catch (e) {
        // If it fails, the response is a raw JWT string (e.g. "eyJ...")
        localStorage.setItem('access_token', rawText);

      }

      // --- DEMO LOGIC MATCHING ---
      let demoRole = localStorage.getItem('demo_role') || 'ROLE_USER';
      if (username.toLowerCase().includes('admin')) demoRole = 'ROLE_ADMIN';
      if (username.toLowerCase().includes('manager')) demoRole = 'ROLE_MANAGER';
      localStorage.setItem('user_role', demoRole);
      // ---------------------------

      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative font-sans bg-slate-50">
      <LoadingProcess isLoading={loading} barOnly={true} />

      {/* Login Card */}
      <div className="relative w-full max-w-[420px] bg-slate-800/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-white m-4 sm:m-5 box-border overflow-y-auto max-h-[95vh] custom-scrollbar">
        <div className="text-center mb-9">
          <div className="w-13 h-13 mx-auto mb-5 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <BedDouble size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold m-0 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-sm m-0">Sign in to Imperion PMS</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center font-medium animate-in fade-in">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Enter your username" required
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3.5 pr-4 pl-11 text-white text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 box-border"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-300">Password</label>
              <a href="#" className="text-xs text-blue-500 no-underline font-semibold hover:text-blue-400 transition-colors">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3.5 px-11 text-white text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 box-border"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer outline-none">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="mt-3 bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none rounded-xl p-4 text-[15px] font-bold cursor-pointer flex justify-center items-center gap-2 shadow-lg shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-400">
          Don't have an account? <Link to="/register" className="text-white font-semibold no-underline hover:text-blue-400 transition-colors">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
