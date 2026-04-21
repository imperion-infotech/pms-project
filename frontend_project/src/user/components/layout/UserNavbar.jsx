import React, { useState, useMemo } from 'react'
import { Menu, Building2, UserCircle, Bell, MapPin, Phone, Mail, Globe, Info } from 'lucide-react'
import { useSidebar } from '../../../context/SidebarContext'
import { propertyService } from '../../../services/propertyService'
import AuthImage from '../../../admin/components/common/AuthImage'

/**
 * UserNavbar component - Global dark header for User Hub.
 * Features an industrial, highly professional design with sleek gradients and spacing.
 */
const UserNavbar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
  const [isHotelHovered, setIsHotelHovered] = useState(false)

  // ... (userDetails and activeHotel logic remains the same) ...

  const userDetails = useMemo(() => {
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
  }, [])

  // Memoized active hotel details
  const activeHotel = useMemo(() => {
    try {
      const activeId = localStorage.getItem('activeHotelId')
      const storedHotels = localStorage.getItem('adminHotels')
      if (activeId && storedHotels) {
        const hotels = JSON.parse(storedHotels)
        return hotels.find((h) => String(h.id) === String(activeId))
      }
    } catch (e) {
      console.error('Failed to parse active hotel', e)
    }
    return null
  }, [])

  const [showNotification, setShowNotification] = useState(true)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <header className="bg-surface-50 relative z-50 flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-4 text-slate-200 shadow-md transition-all duration-300 md:px-6">
      {/* PREFETCH LAYER: Loads images in background so they reflect instantly on hover */}
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
        {activeHotel?.hotelLogo && (
          <AuthImage src={propertyService.getImageUrl(activeHotel.hotelLogo)} />
        )}
        {activeHotel?.hotelImage && (
          <AuthImage src={propertyService.getImageUrl(activeHotel.hotelImage)} />
        )}
      </div>

      {/* LEFT SECTION: Context & Sidebar Trigger */}
      <div className="flex items-center gap-4">
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

      {/* CENTER SECTION: Identity & Hover Details */}
      <div
        className="absolute left-1/2 flex -translate-x-1/2 cursor-help items-center gap-4 py-1"
        onMouseEnter={() => setIsHotelHovered(true)}
        onMouseLeave={() => setIsHotelHovered(false)}
      >
        <div
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-500 hover:scale-110 ${
            isHotelHovered
              ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
              : 'border-white/10 bg-linear-to-br from-emerald-500/10 to-emerald-700/20 shadow-inner'
          } backdrop-blur-md`}
        >
          {activeHotel?.hotelLogo && activeHotel?.hotelLogo !== 'string' ? (
            <AuthImage
              src={propertyService.getImageUrl(activeHotel.hotelLogo)}
              alt="Logo"
              className="h-full w-full rounded-xl object-contain p-1.5 transition-transform duration-500"
            />
          ) : null}
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700 transition-opacity duration-300 ${activeHotel?.hotelLogo && activeHotel?.hotelLogo !== 'string' ? 'opacity-0' : 'opacity-100'}`}
          >
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-transparent via-white/10 to-transparent opacity-80 mix-blend-overlay"></div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-base leading-tight font-black tracking-tight text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {activeHotel?.hotelName || 'IMPERION'}
          </h1>
          <p className="text-pms-tiny mt-0.5 leading-none font-black tracking-[0.4em] text-emerald-400 uppercase opacity-90">
            Engine
          </p>
        </div>

        {/* Floating Property Detail Card */}
        {isHotelHovered && activeHotel && (
          <div className="animate-in fade-in zoom-in-95 slide-in-from-top-4 absolute top-full left-1/2 z-50 mt-5 w-80 -translate-x-1/2 overflow-hidden rounded-[32px] border border-emerald-500/30 bg-slate-900 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8),0_0_25px_rgba(16,185,129,0.2)] backdrop-blur-2xl">
            {/* Top Shine Layer */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/50 to-transparent"></div>

            <div className="relative h-28 w-full">
              {activeHotel.hotelImage && activeHotel.hotelImage !== 'string' ? (
                <AuthImage
                  src={propertyService.getImageUrl(activeHotel.hotelImage)}
                  alt="Cover"
                  className="h-full w-full object-cover opacity-60 brightness-75 transition-all duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-emerald-600/40 to-slate-900"></div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-4 left-5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                  <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase">
                    Property Active
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl leading-tight font-black text-white">
                    {activeHotel.hotelName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin size={12} className="text-emerald-500" />
                    <span className="text-[11px] font-bold">
                      {activeHotel.city}, {activeHotel.state1}
                    </span>
                  </div>
                </div>
                <div className="flex h-10 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 transition-colors hover:bg-emerald-500/10">
                  <span className="text-xs font-black text-emerald-400">#{activeHotel.id}</span>
                </div>
              </div>

              <div className="space-y-3.5 border-t border-white/5 pt-4">
                {activeHotel.contactNumber && (
                  <div className="group flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                      <Phone size={14} />
                    </div>
                    <p className="text-xs font-bold text-slate-300">{activeHotel.contactNumber}</p>
                  </div>
                )}
                {activeHotel.email && (
                  <div className="group flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                      <Mail size={14} />
                    </div>
                    <p className="max-w-[180px] truncate text-xs font-bold text-slate-300">
                      {activeHotel.email}
                    </p>
                  </div>
                )}
                {activeHotel.url && (
                  <div className="group flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                      <Globe size={14} />
                    </div>
                    <p className="max-w-[180px] truncate text-xs font-bold text-emerald-400 underline decoration-emerald-400/30 underline-offset-4">
                      {activeHotel.url.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-2">
                <div className="group flex w-full items-center justify-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 py-3 transition-all hover:bg-emerald-500/10 active:scale-[0.98]">
                  <span className="text-[10px] font-black tracking-[0.15em] text-emerald-500 uppercase">
                    Connected Mode Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
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
                  <span className="text-pms-tiny rounded-full bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-400">
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
                    <p className="text-pms-tiny mt-2 font-medium text-slate-500">Just now</p>
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
            <p className="text-pms-micro leading-none font-bold tracking-widest text-emerald-500/80 uppercase">
              {userDetails.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default UserNavbar
