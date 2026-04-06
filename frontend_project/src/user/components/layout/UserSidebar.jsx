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

/**
 * UserSidebar component - Matches exactly with the Admin Dashboard Sidebar.
 * Displays fetched room types and room statuses as nested accordion lists.
 */
const UserSidebar = ({ buildings = [], roomTypes = [], roomStatuses = [], onGoToPms }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
  const [isBuildingMenuOpen, setIsBuildingMenuOpen] = React.useState(true)
  const [isTypeMenuOpen, setIsTypeMenuOpen] = React.useState(true)
  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(true)
  const navigate = useNavigate()

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
            <span className="text-sm font-semibold tracking-widest whitespace-nowrap uppercase">
              Imperion Engine
            </span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col overflow-hidden py-0">
          <div className="custom-scrollbar flex-1 overflow-y-auto py-4">
            {/* Go to Dashboard Button */}
            <button
              onClick={onGoToPms}
              className={`relative mb-1 flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700/60 hover:text-white`}
              style={{ borderRadius: '0' }}
            >
              <LayoutDashboard className={`h-5 w-5 text-emerald-400`} />
              <span>Go to Dashboard</span>
            </button>

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
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold whitespace-nowrap text-slate-500 uppercase opacity-0 transition-opacity group-hover:opacity-100">
                          {building.location || 'Main'}
                        </span>
                      </div>
                    ))}
                    {buildings.length === 0 && (
                      <span className="block px-6 py-3 text-[11px] font-medium text-slate-600 italic">
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
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold whitespace-nowrap text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                          {type.shortName}
                        </span>
                      </div>
                    ))}
                    {roomTypes.length === 0 && (
                      <span className="block px-6 py-3 text-[11px] font-medium text-slate-600 italic">
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
                      <span className="block px-6 py-3 text-[11px] font-medium text-slate-600 italic">
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
            <button
              onClick={() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                navigate('/login')
              }}
              className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5 text-slate-400 transition-colors group-hover:text-red-400" />
              <span className="text-sm font-semibold">Log Out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default UserSidebar
