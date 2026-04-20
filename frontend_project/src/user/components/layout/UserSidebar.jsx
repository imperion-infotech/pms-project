import React from 'react'
import {
  CheckCircle2,
  Layers,
  Menu,
  LogOut,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Building,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '../../../context/SidebarContext'

// Helper to check for Admin role
const checkIsAdmin = () => {
  const token = localStorage.getItem('access_token')
  if (!token) return false
  try {
    const cleanToken = token.trim().replace(/^"|"$/g, '')
    const payload = JSON.parse(atob(cleanToken.split('.')[1]))
    const roles = payload.roles || []
    return roles.some((r) => {
      const name = (typeof r === 'object' ? r.name || r.authority : r) || ''
      const roleStr = String(name).toUpperCase()
      return (
        roleStr.includes('ADMIN') ||
        roleStr.includes('MANAGER') ||
        roleStr.includes('SUPER_ADMIN')
      )
    })
  } catch {
    return String(localStorage.getItem('user_role') || '').toUpperCase().includes('ADMIN')
  }
}

const checkIsSuperAdmin = () => {
  const token = localStorage.getItem('access_token')
  if (!token) return false
  try {
    const cleanToken = token.trim().replace(/^"|"$/g, '')
    const payload = JSON.parse(atob(cleanToken.split('.')[1]))
    const roles = payload.roles || []
    return roles.some((r) => {
      const name = (typeof r === 'object' ? r.name || r.authority : r) || ''
      const roleStr = String(name).toUpperCase()
      return roleStr.includes('SUPER_ADMIN')
    })
  } catch {
    return String(localStorage.getItem('user_role') || '').toUpperCase().includes('SUPER_ADMIN')
  }
}

/**
 * UserSidebar component - Matches exactly with the Admin Dashboard Sidebar.
 * Displays fetched room types and room statuses as nested accordion lists.
 */
const UserSidebar = ({ buildings = [], roomTypes = [], roomStatuses = [] }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
  const [isBuildingMenuOpen, setIsBuildingMenuOpen] = React.useState(true)
  const [isTypeMenuOpen, setIsTypeMenuOpen] = React.useState(true)
  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(true)
  const navigate = useNavigate()

  const isAdmin = checkIsAdmin()
  const isSuper = checkIsSuperAdmin()

  // Industrial Fix: Get the active hotel name to show in the branding section
  const activeHotelName = localStorage.getItem('activeHotelName') || 'Imperion Engine'

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`bg-surface-100 fixed z-50 flex h-full w-64 shrink-0 flex-col text-white shadow-2xl transition-all duration-300 ease-in-out lg:static lg:h-auto ${
          isSidebarOpen ? 'ml-0' : '-ml-64'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-700/50 p-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Menu
              className="h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-pms-tiny font-black tracking-[0.2em] text-emerald-500 uppercase opacity-90">
                Property Engine
              </span>
              <span className="text-[13px] font-black leading-tight tracking-wide text-white uppercase">
                {activeHotelName}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col overflow-hidden py-0">
          <div className="custom-scrollbar flex-1 overflow-y-auto py-4">
            {/* Go to Dashboard Button (Industrial Fix: Single Click for Admin) */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  navigate('/dashboard')
                  if (window.innerWidth < 1024) setIsSidebarOpen(false)
                }}
                className={`relative mb-1 flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-emerald-500/10 hover:text-emerald-400`}
                style={{ borderRadius: '0' }}
              >
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                <LayoutDashboard className={`h-5 w-5 text-emerald-400`} />
                <span>Go to Dashboard</span>
              </button>
            )}

            <div className="my-2 border-t border-slate-700/40"></div>


            {/* BUILDINGS ACCORDION */}
            <div>
              <button
                onClick={() => setIsBuildingMenuOpen(!isBuildingMenuOpen)}
                className="group flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    Buildings
                  </span>
                </div>
                {isBuildingMenuOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400 opacity-50 group-hover:text-white" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400 opacity-50 group-hover:text-white" />
                )}
              </button>

              <AnimatePresence>
                {isBuildingMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-y border-slate-800/50 bg-[#111827] py-1"
                  >
                    {buildings.map((building) => (
                      <div
                        key={building.id}
                        className={`group relative flex w-full items-center justify-between px-6 py-2.5 text-xs font-medium text-slate-400 transition-all hover:bg-slate-800/30 hover:text-white`}
                      >
                        <span className="capitalize">{building.name}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-pms-tiny font-bold whitespace-nowrap text-slate-500 uppercase opacity-0 transition-opacity group-hover:opacity-100">
                          {building.location || 'Main'}
                        </span>
                      </div>
                    ))}
                    {buildings.length === 0 && (
                      <span className="block px-6 py-3 text-pms-mini font-medium text-slate-600 italic">
                        No buildings found.
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ROOM TYPES ACCORDION */}
            <div>
              <button
                onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
                className="group flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    Room Types
                  </span>
                </div>
                {isTypeMenuOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400 opacity-50 group-hover:text-white" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400 opacity-50 group-hover:text-white" />
                )}
              </button>

              <AnimatePresence>
                {isTypeMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-y border-slate-800/50 bg-[#111827] py-1"
                  >
                    {roomTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`group relative flex w-full items-center justify-between px-6 py-2.5 text-xs font-medium text-slate-400 transition-all hover:bg-slate-800/30 hover:text-white`}
                      >
                        <span className="capitalize">{type.roomTypeName}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-pms-tiny font-bold whitespace-nowrap text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                          {type.shortName}
                        </span>
                      </div>
                    ))}
                    {roomTypes.length === 0 && (
                      <span className="block px-6 py-3 text-pms-mini font-medium text-slate-600 italic">
                        No room types found.
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ROOM STATUSES ACCORDION */}
            <div>
              <button
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className="group flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    Room Status
                  </span>
                </div>
                {isStatusMenuOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400 opacity-50 group-hover:text-white" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400 opacity-50 group-hover:text-white" />
                )}
              </button>

              <AnimatePresence>
                {isStatusMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-y border-slate-800/50 bg-[#111827] py-1"
                  >
                    {roomStatuses.map((status) => (
                      <div
                        key={status.id}
                        className={`group relative flex w-full items-center gap-3 px-6 py-2.5 text-xs font-medium text-slate-400 transition-all hover:bg-slate-800/30 hover:text-white`}
                      >
                        <div
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: status.roomStatusColor || '#ef4444' }}
                        ></div>
                        <span className="w-full truncate capitalize">{status.roomStatusName}</span>
                      </div>
                    ))}
                    {roomStatuses.length === 0 && (
                      <span className="block px-6 py-3 text-pms-mini font-medium text-slate-600 italic">
                        No statuses found.
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="my-2 border-t border-slate-700/40"></div>
          </div>

          <div className="mt-auto border-t border-slate-700/50 p-4">
            {/* Only Super Admins can switch properties/see the selection page */}
            {isSuper && (
              <button
                onClick={() => {
                  localStorage.removeItem('activeHotelId')
                  localStorage.removeItem('activeHotelName')
                  navigate('/property-selection')
                }}
                className="group mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Layers className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-400" />
                <span className="text-sm font-semibold">Switch Property</span>
              </button>
            )}

            <button
              onClick={() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('user_role')
                localStorage.removeItem('activeHotelId')
                localStorage.removeItem('adminHotels')
                navigate('/login')
              }}
              className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5 text-slate-400 transition-colors group-hover:text-red-400" />
              <span className="text-sm font-semibold text-slate-300 group-hover:text-red-400">
                Log Out
              </span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default UserSidebar
