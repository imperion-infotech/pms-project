import React, { useState } from 'react'
import { Menu, Building2, UserCircle, Bell } from 'lucide-react'
import { useSidebar } from '../../../context/SidebarContext'

const Navbar = () => {
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
        return { username: 'Admin', role: 'Super User' }
      }
    }
    return { username: 'Loading...', role: '...' }
  })
  const [showNotification, setShowNotification] = useState(true)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <header className="bg-surface-100 z-10 flex h-16 shrink-0 items-center justify-between px-4 text-white shadow-lg transition-colors duration-300 md:px-6">
      <div className="flex min-w-0 items-center gap-2 md:gap-6">
        <div
          className={`flex items-center justify-center overflow-hidden transition-all duration-300 ${!isSidebarOpen ? 'w-10 opacity-100' : 'pointer-events-none w-0 opacity-0'}`}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="shrink-0 rounded-lg p-2 transition-colors hover:bg-slate-800"
            title="Open Sidebar"
          >
            <Menu className="h-5 w-5 text-emerald-400 md:h-6 md:w-6" />
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/20 md:h-9 md:w-9">
            <Building2 className="h-5 w-5 text-white md:h-6 md:w-6" />
          </div>
          <div>
            <h1 className="text-lg leading-none font-bold tracking-tight md:text-xl">IMPERION</h1>
            <p className="mt-1 text-[8px] font-bold tracking-[0.2em] text-emerald-400 uppercase md:text-[10px]">
              Infotech
            </p>
          </div>
        </div>
        <div className="mx-2 h-8 w-px bg-slate-700"></div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen)
                if (showNotification) setShowNotification(false)
              }}
              className="group relative z-50 mr-2 hidden rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-emerald-400 sm:flex"
            >
              <Bell className="h-5 w-5 origin-top transition-transform group-hover:rotate-12" />
              {showNotification && (
                <span className="border-surface-100 absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 bg-rose-500"></span>
              )}
            </button>

            {isNotificationOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationOpen(false)}
                ></div>

                <div className="bg-surface-100 animate-in fade-in slide-in-from-top-4 absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-700/80 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.6)]">
                  <div className="bg-surface-100/95 flex items-center justify-between border-b border-slate-700/80 p-4 backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-white">Dashboard Alerts</h3>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      1 New
                    </span>
                  </div>
                  <div className="custom-scrollbar bg-surface-100/90 max-h-[60vh] overflow-y-auto backdrop-blur-sm">
                    <div className="cursor-pointer border-l-2 border-emerald-500 p-4 transition-colors hover:bg-slate-800/80">
                      <p className="mb-1 text-sm font-medium text-slate-200 capitalize">
                        Welcome back, {userDetails.username}!
                      </p>
                      <p className="text-xs text-slate-400">Admin session started successfully.</p>
                      <p className="mt-2 text-[10px] font-medium text-slate-500">Just now</p>
                    </div>
                  </div>
                  <div className="bg-surface-100/95 border-t border-slate-700/80 p-3 backdrop-blur-sm">
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="w-full cursor-pointer rounded-lg py-2 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                    >
                      Clear all alerts
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-bold text-white capitalize">{userDetails.username}</p>
            <p className="text-[10px] tracking-wider text-emerald-400 uppercase">
              {userDetails.role}
            </p>
          </div>
          <div className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-800 transition-all hover:border-emerald-500">
            <UserCircle className="h-7 w-7 text-slate-400 transition-colors group-hover:text-emerald-400" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
