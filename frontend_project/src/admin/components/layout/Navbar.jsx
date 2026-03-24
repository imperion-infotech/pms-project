/**
 * Navbar.jsx (Admin Domain -> Layout component)
 * 
 * Top Navigation Bar for the Admin Dashboard showing user profile, notifications, and settings.
 * Includes a hamburger menu icon to toggle the Sidebar on mobile vs desktop layout.
 */
// Page layout structures - Navbar
import React, { useState, useEffect } from 'react';
import { Menu, Building2, UserCircle, Bell } from 'lucide-react';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
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
        setUserDetails({ username: 'Admin', role: 'Super User' });
      }
    }
  }, []);

  return (
    <header className="h-16 bg-[#1e293b] text-white flex items-center justify-between px-4 md:px-6 shrink-0 shadow-lg z-10">
      <div className="flex items-center gap-2 md:gap-6 min-w-0">
        <div className={`transition-all duration-300 overflow-hidden flex items-center justify-center ${!isSidebarOpen ? "w-10 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            title="Open Sidebar"
          >
            <Menu className="w-5 h-5 md:w-6 h-6 text-emerald-400" />
          </button>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Building2 className="w-5 h-5 md:w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg md:text-xl leading-none tracking-tight">IMPERION</h1>
            <p className="text-[8px] md:text-[10px] text-emerald-400 font-bold tracking-[0.2em] mt-1">Infotech</p>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-700 mx-2"></div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                if (showNotification) setShowNotification(false);
              }}
              className="hidden sm:flex relative p-2 mr-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors group z-50"
            >
              <Bell className="w-5 h-5 transition-transform origin-top group-hover:rotate-12" />
              {showNotification && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-[#1e293b] rounded-full"></span>}
            </button>

            {/* Right Side Notification Dropdown */}
            {isNotificationOpen && (
              <>
                {/* Overlay for clicking outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationOpen(false)}
                ></div>

                <div className="absolute right-0 mt-3 w-80 bg-[#1e293b] border border-slate-700/80 rounded-2xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.6)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-4">
                  <div className="p-4 border-b border-slate-700/80 flex justify-between items-center bg-[#1e293b]/95 backdrop-blur-sm">
                    <h3 className="font-bold text-white text-sm">Dashboard Alerts</h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">1 New</span>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-[#1e293b]/90 backdrop-blur-sm">
                    <div className="p-4 hover:bg-slate-800/80 transition-colors border-l-2 border-emerald-500 cursor-pointer">
                      <p className="text-sm text-slate-200 font-medium mb-1 capitalize">Welcome back, {userDetails.username}!</p>
                      <p className="text-xs text-slate-400">Admin session started successfully.</p>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">Just now</p>
                    </div>
                    <div className="p-4 hover:bg-slate-800/80 transition-colors cursor-pointer opacity-70">
                      <p className="text-sm text-slate-300 font-medium mb-1">Backup Complete</p>
                      <p className="text-xs text-slate-400">Daily database snapshot taken securely.</p>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">3 hours ago</p>
                    </div>
                  </div>
                  <div className="p-3 border-t border-slate-700/80 bg-[#1e293b]/95 backdrop-blur-sm">
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="w-full py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Clear all alerts
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white capitalize">{userDetails.username}</p>
            <p className="text-[10px] text-emerald-400 uppercase tracking-wider">{userDetails.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-all group">
            <UserCircle className="w-7 h-7 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
