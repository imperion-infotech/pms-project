import React, { useState } from 'react'
import { Menu, Building2, UserCircle, Bell } from 'lucide-react'
import { useSidebar } from '../../../context/SidebarContext'

/**
 * UserNavbar component - Global dark header for User Hub.
 * Features an industrial, highly professional design with sleek gradients and spacing.
 */
const UserNavbar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
  const [userDetails] = useState(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const name = payload.sub || payload.username || payload.name || 'User'

        let rawRole = 'User'
        if (payload.role) rawRole = payload.role
        else if (payload.roles)
          rawRole = Array.isArray(payload.roles) ? payload.roles[0] : payload.roles
        else if (payload.authorities)
          rawRole = Array.isArray(payload.authorities)
            ? payload.authorities[0]?.authority || payload.authorities[0]
            : payload.authorities
        else {
          const localRole = localStorage.getItem('user_role')
          if (localRole) rawRole = localRole
        }

        let cleanRole =
          typeof rawRole === 'string' ? rawRole.replace('ROLE_', '').toLowerCase() : 'user'
        const displayRole = cleanRole.charAt(0).toUpperCase() + cleanRole.slice(1)

        return { username: name, role: displayRole }
      } catch {
        return { username: 'User', role: 'Authorized' }
      }
    }
    return { username: 'Loading...', role: '...' }
  })
  const [showNotification, setShowNotification] = useState(true)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <header className="bg-surface-50 relative z-50 flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-4 text-slate-200 shadow-md transition-all duration-300 md:px-6">
      {/* LEFT SECTION: Context & Sidebar Trigger */}
      <div className="flex items-center gap-4">
        {/* Animated Menu Toggle */}
        <div
          className={`flex items-center justify-center overflow-hidden transition-all duration-300 ${!isSidebarOpen ? 'w-10 opacity-100' : 'pointer-events-none w-0 opacity-0'}`}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/20 hover:text-emerald-400"
            title="Expand Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* CENTER SECTION: Identity */}
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-linear-to-br from-emerald-500 to-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <Building2 className="absolute z-10 h-4.5 w-4.5 text-white" />
          <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-transparent via-white/30 to-transparent opacity-80 mix-blend-overlay"></div>
        </div>
        <div className="hidden flex-col sm:flex">
          <h1 className="text-xl leading-none font-black tracking-tight text-white drop-shadow-sm">
            IMPERION
          </h1>
          <p className="mt-1 text-center text-[9px] leading-none font-black tracking-[0.3em] text-emerald-400 uppercase">
            Engine
          </p>
        </div>
      </div>

      {/* RIGHT SECTION: Quick Tools & Auth */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen)
              if (showNotification) setShowNotification(false)
            }}
            className="group relative z-50 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-emerald-400"
          >
            <Bell className="h-5 w-5 origin-top transition-transform group-hover:rotate-12" />
            {showNotification && (
              <span className="border-surface-50 absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 bg-rose-500"></span>
            )}
          </button>

          {isNotificationOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotificationOpen(false)}
              ></div>

              <div className="animate-in fade-in slide-in-from-top-4 absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/95 p-4 backdrop-blur-sm">
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    1 New
                  </span>
                </div>
                <div className="custom-scrollbar max-h-[60vh] overflow-y-auto bg-slate-800/90 backdrop-blur-sm">
                  <div className="cursor-pointer border-l-2 border-emerald-500 p-4 transition-colors hover:bg-slate-700/40">
                    <p className="mb-1 text-sm font-medium text-slate-200 capitalize">
                      Welcome back, {userDetails.username}!
                    </p>
                    <p className="text-xs text-slate-400">
                      Your role has been verified as{' '}
                      <span className="font-semibold text-emerald-400">{userDetails.role}</span>.
                    </p>
                    <p className="mt-2 text-[10px] font-medium text-slate-500">Just now</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block"></div>

        <div className="group flex cursor-pointer items-center gap-3 rounded-full border border-transparent p-1 pr-3 transition-all hover:border-white/10 hover:bg-white/5">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-600 bg-slate-800 shadow-inner transition-colors group-hover:border-emerald-500">
            <UserCircle className="absolute h-full w-full scale-110 text-slate-400 transition-colors group-hover:text-emerald-400" />
          </div>
          <div className="hidden text-right sm:block">
            <p className="mb-1 text-[13px] leading-none font-bold text-slate-200 capitalize transition-colors group-hover:text-white">
              {userDetails.username}
            </p>
            <p className="text-[9px] leading-none font-bold tracking-widest text-emerald-500/80 uppercase">
              {userDetails.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default UserNavbar
