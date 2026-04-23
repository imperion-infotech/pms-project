import React, { useState, useMemo } from 'react'
import { Menu, Building2, UserCircle, Bell, Mail, Phone, Globe, MapPin } from 'lucide-react'
import { useSidebar } from '../../../context/SidebarContext'
import { propertyService } from '../../../services/propertyService'
import { AuthImage } from '../common/AuthImage'

const Navbar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
  const [isHotelHovered, setIsHotelHovered] = useState(false)

  // Get active hotel data for branding
  const activeHotel = useMemo(() => {
    const hotels = JSON.parse(localStorage.getItem('adminHotels') || '[]')
    const activeId = localStorage.getItem('activeHotelId')
    return hotels.find((h) => String(h.id) === String(activeId))
  }, [])

  const userDetails = useMemo(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const cleanToken = String(token).trim().replace(/^"|"$/g, '')
        const base64Url = cleanToken.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(window.atob(base64))
        const name = payload.sub || payload.username || payload.name || 'User'

        let rawRole = 'User'

        // Extract role from JWT payload
        if (payload.roles && Array.isArray(payload.roles) && payload.roles.length > 0) {
          // Handle array of objects: [{id: 1, name: 'ROLE_ADMIN'}]
          // AND array of strings: ['ROLE_ADMIN']
          const bestRole =
            payload.roles.find((r) => {
              const rn = (typeof r === 'object' ? r.name || r.authority : r) || ''
              const roleUpper = String(rn).toUpperCase()
              return roleUpper.includes('ADMIN') || roleUpper.includes('SUPER_ADMIN')
            }) || payload.roles[0]

          rawRole =
            typeof bestRole === 'object' ? bestRole.name || bestRole.authority || 'User' : bestRole
        } else if (payload.role) {
          rawRole = payload.role
        } else if (payload.authorities) {
          rawRole = Array.isArray(payload.authorities)
            ? payload.authorities[0]?.authority || payload.authorities[0]
            : payload.authorities
        } else {
          // Final fallback: localStorage
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
  }, [])
  const [showNotification, setShowNotification] = useState(true)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <header className="bg-surface-100 relative z-50 flex h-16 shrink-0 items-center justify-between px-4 text-white shadow-lg transition-colors duration-300 md:px-6">
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
      </div>

      {/* CENTER SECTION: Identity & Hover Details */}
      <div
        className="absolute left-1/2 flex -translate-x-1/2 cursor-help items-center gap-3 py-1"
        onMouseEnter={() => setIsHotelHovered(true)}
        onMouseLeave={() => setIsHotelHovered(false)}
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-linear-to-br from-emerald-500/10 to-emerald-700/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-105">
          {activeHotel?.hotelLogo && activeHotel?.hotelLogo !== 'string' ? (
            <AuthImage
              src={propertyService.getImageUrl(activeHotel.hotelLogo)}
              alt="Logo"
              className="h-full w-full rounded-xl object-contain p-1"
              fallback={
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700">
                  <Building2 className="h-4.5 w-4.5 text-white" />
                </div>
              }
            />
          ) : null}
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700 ${activeHotel?.hotelLogo && activeHotel?.hotelLogo !== 'string' ? 'hidden' : 'flex'}`}
          >
            <Building2 className="h-4.5 w-4.5 text-white" />
          </div>
        </div>
        <div className="hidden flex-col sm:flex">
          <h1 className="text-base leading-tight font-black tracking-tight text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {activeHotel?.hotelName || 'IMPERION'}
          </h1>
          <p className="text-pms-micro mt-0.5 leading-none font-black tracking-[0.4em] text-emerald-400 uppercase opacity-90">
            Admin Console
          </p>
        </div>

        {/* Hover Information Card */}
        {isHotelHovered && activeHotel && (
          <div className="animate-in fade-in zoom-in-95 absolute top-full left-1/2 mt-2 w-80 -translate-x-1/2 overflow-hidden rounded-[24px] border border-slate-700/50 bg-slate-900/95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {/* Image Header */}
            <div className="relative h-24 w-full">
              {activeHotel.hotelImage && activeHotel.hotelImage !== 'string' ? (
                <AuthImage
                  src={propertyService.getImageUrl(activeHotel.hotelImage)}
                  alt="Property"
                  className="h-full w-full object-cover"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-900/40 to-slate-900">
                      <Building2 className="h-8 w-8 text-emerald-500/30" />
                    </div>
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-900/40 to-slate-900">
                  <Building2 className="h-8 w-8 text-emerald-500/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <div className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                <span className="text-pms-tiny font-bold tracking-widest text-emerald-400 uppercase opacity-80">
                  Property Active
                </span>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="max-w-[70%]">
                  <h3 className="text-lg leading-tight font-black text-white uppercase">
                    {activeHotel.hotelName}
                  </h3>
                  <p className="text-pms-mini mt-1 flex items-center gap-1.5 font-medium text-slate-400">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    {activeHotel.city}, {activeHotel.state1}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 shadow-lg">
                  <span className="text-xs font-black text-emerald-400">#{activeHotel.id}</span>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-slate-800/50 pt-4">
                <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/50 text-emerald-400">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  {activeHotel.contactNumber}
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/50 text-emerald-400">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">{activeHotel.email}</span>
                </div>
                {activeHotel.url && (
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/50 text-emerald-400">
                      <Globe className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate text-blue-400">{activeHotel.url}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3 text-center">
                <p className="text-pms-tiny font-bold tracking-widest text-emerald-500 uppercase">
                  Connected via {activeHotel.timezone || 'Main Terminal'}
                </p>
              </div>
            </div>
          </div>
        )}
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
                    <span className="text-pms-tiny rounded-full bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-400">
                      1 New
                    </span>
                  </div>
                  <div className="custom-scrollbar bg-surface-100/90 max-h-[60vh] overflow-y-auto backdrop-blur-sm">
                    <div className="cursor-pointer border-l-2 border-emerald-500 p-4 transition-colors hover:bg-slate-800/80">
                      <p className="mb-1 text-sm font-medium text-slate-200 capitalize">
                        Welcome back, {userDetails.username}!
                      </p>
                      <p className="text-xs text-slate-400">Admin session started successfully.</p>
                      <p className="text-pms-tiny mt-2 font-medium text-slate-500">Just now</p>
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
            <p className="text-pms-tiny tracking-wider text-emerald-400 uppercase">
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
