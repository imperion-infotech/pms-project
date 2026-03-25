import React, { useState, useEffect } from 'react';
import { Menu, Building2, UserCircle, Bell } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';

/**
 * UserNavbar component - Global dark header for User Hub.
 * Features an industrial, highly professional design with sleek gradients and spacing.
 */
const UserNavbar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [userDetails, setUserDetails] = useState({ username: 'Loading...', role: '...' });
  const [showNotification, setShowNotification] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const name = payload.sub || payload.username || payload.name || 'User';

        let rawRole = 'User';
        if (payload.role) rawRole = payload.role;
        else if (payload.roles) rawRole = Array.isArray(payload.roles) ? payload.roles[0] : payload.roles;
        else if (payload.authorities) rawRole = Array.isArray(payload.authorities) ? payload.authorities[0]?.authority || payload.authorities[0] : payload.authorities;
        else {
          const localRole = localStorage.getItem('user_role');
          if (localRole) rawRole = localRole;
        }

        let cleanRole = typeof rawRole === 'string' ? rawRole.replace('ROLE_', '').toLowerCase() : 'user';
        const displayRole = cleanRole.charAt(0).toUpperCase() + cleanRole.slice(1);

        setUserDetails({ username: name, role: displayRole });
      } catch (err) {
        setUserDetails({ username: 'User', role: 'Authorized' });
      }
    }
  }, []);

  return (
    <header className="h-16 bg-[#0f172a] border-b border-white/5 text-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-50 transition-all duration-300 relative shadow-md">

      {/* LEFT SECTION: Context & Sidebar Trigger */}
      <div className="flex items-center gap-4">
        {/* Animated Menu Toggle */}
        <div className={`transition-all duration-300 overflow-hidden flex items-center justify-center ${!isSidebarOpen ? "w-10 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 rounded-lg transition-all"
            title="Expand Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* CENTER SECTION: Identity */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.25)] border border-emerald-400/20">
          <Building2 className="w-[1.125rem] h-[1.125rem] text-white absolute z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-80 rounded-xl mix-blend-overlay"></div>
        </div>
        <div className="hidden sm:flex flex-col">
          <h1 className="font-black text-xl tracking-tight leading-none text-white drop-shadow-sm">IMPERION</h1>
          <p className="text-[9px] font-black text-emerald-400 tracking-[0.3em] uppercase mt-1 leading-none text-center">Engine</p>
        </div>
      </div>

      {/* RIGHT SECTION: Quick Tools & Auth */}
      <div className="flex items-center gap-3 sm:gap-4">

        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              if (showNotification) setShowNotification(false);
            }}
            className="relative p-2 text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-colors group z-50"
          >
            <Bell className="w-5 h-5 transition-transform origin-top group-hover:rotate-12" />
            {showNotification && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-[#0f172a] rounded-full"></span>}
          </button>

          {isNotificationOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotificationOpen(false)}
              ></div>

              <div className="absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700/50 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-4">
                <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/95 backdrop-blur-sm">
                  <h3 className="font-bold text-white text-sm">Notifications</h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">1 New</span>
                </div>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-800/90 backdrop-blur-sm">
                  <div className="p-4 hover:bg-slate-700/40 transition-colors border-l-2 border-emerald-500 cursor-pointer">
                    <p className="text-sm text-slate-200 font-medium mb-1 capitalize">Welcome back, {userDetails.username}!</p>
                    <p className="text-xs text-slate-400">Your role has been verified as <span className="text-emerald-400 font-semibold">{userDetails.role}</span>.</p>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">Just now</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-6 bg-white/10 hidden sm:block mx-1"></div>

        <div className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 cursor-pointer transition-all group">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center group-hover:border-emerald-500 transition-colors overflow-hidden relative shadow-inner">
            <UserCircle className="w-full h-full text-slate-400 group-hover:text-emerald-400 absolute scale-110 transition-colors" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[13px] font-bold text-slate-200 leading-none mb-1 group-hover:text-white transition-colors capitalize">{userDetails.username}</p>
            <p className="text-[9px] text-emerald-500/80 uppercase font-bold tracking-widest leading-none">{userDetails.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
