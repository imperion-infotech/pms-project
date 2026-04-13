import React, { useState } from 'react'
import {
  Menu,
  Building,
  ChevronDown,
  ChevronUp,
  Layers,
  LayoutDashboard,
  DoorOpen,
  CheckSquare,
  Home,
  LogOut,
  User,
  Receipt,
  Settings,
  FileText,
  CreditCard,
  Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '../../../context/SidebarContext'

/* ─── Reusable Sub-Item Button ──────────────────────────────── */
const SubItem = ({ item, isActive, color, onClick }) => {
  const colorMap = {
    emerald: {
      activeBg: 'rgba(16, 185, 129, 0.1)',
      activeGlow: '0 0 12px rgba(52,211,153,0.35), inset 0 0 20px rgba(52,211,153,0.05)',
      borderGlow: '0 0 12px rgba(52,211,153,0.8), 0 0 24px rgba(52,211,153,0.4)',
      iconActive: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]',
      iconHover: 'group-hover:text-emerald-400',
      bar: 'bg-emerald-400',
      textActive: 'text-emerald-100',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    blue: {
      activeBg: 'rgba(59, 130, 246, 0.1)',
      activeGlow: '0 0 12px rgba(96,165,250,0.35), inset 0 0 20px rgba(96,165,250,0.05)',
      borderGlow: '0 0 12px rgba(96,165,250,0.8), 0 0 24px rgba(96,165,250,0.4)',
      iconActive: 'text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.9)]',
      iconHover: 'group-hover:text-blue-400',
      bar: 'bg-blue-400',
      textActive: 'text-blue-100',
      badgeBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    },
    orange: {
      activeBg: 'rgba(251, 146, 60, 0.1)',
      activeGlow: '0 0 12px rgba(251,146,60,0.35), inset 0 0 20px rgba(251,146,60,0.05)',
      borderGlow: '0 0 12px rgba(251,146,60,0.8), 0 0 24px rgba(251,146,60,0.4)',
      iconActive: 'text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.9)]',
      iconHover: 'group-hover:text-orange-400',
      bar: 'bg-orange-400',
      textActive: 'text-orange-100',
      badgeBg: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    },
  }

  const c = colorMap[color]

  return (
    <button
      onClick={onClick}
      className="group relative mx-2 my-[3px] flex w-[calc(100%-16px)] items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200"
      style={
        isActive
          ? {
              background: c.activeBg,
              boxShadow: c.activeGlow,
              border: '1px solid rgba(255,255,255,0.06)',
            }
          : {
              background: 'transparent',
              border: '1px solid transparent',
            }
      }
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.border = '1px solid transparent'
        }
      }}
    >
      {/* Left glow bar */}
      {isActive && (
        <div
          className={`absolute top-1/2 left-0 h-[70%] w-[3px] -translate-y-1/2 rounded-r-full ${c.bar}`}
          style={{ boxShadow: c.borderGlow }}
        />
      )}

      {/* Icon */}
      <item.icon
        className={`h-3.5 w-3.5 shrink-0 transition-all duration-200 ${
          isActive ? c.iconActive : `text-slate-500 ${c.iconHover}`
        }`}
      />

      {/* Label */}
      <span
        className={`capitalize transition-colors duration-200 ${
          isActive ? `font-semibold ${c.textActive}` : 'text-slate-400 group-hover:text-slate-200'
        }`}
      >
        {item.name}
      </span>

      {/* Active glowing dot indicator */}
      {isActive && (
        <span className="ml-auto flex items-center">
          <span
            className={`h-1.5 w-1.5 rounded-full ${c.bar}`}
            style={{ boxShadow: c.borderGlow }}
          />
        </span>
      )}
    </button>
  )
}

/* ─── Section Header ────────────────────────────────────────── */
const SectionHeader = ({ label, icon, isOpen, onToggle, isActive, color }) => {
  const SectionIcon = icon
  const headerColorMap = {
    emerald: {
      iconGlow: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]',
      iconDim: 'text-emerald-400/60',
      bar: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]',
      activeBg: 'bg-emerald-900/20',
      labelActive: 'text-emerald-300',
      chevronActive: 'text-emerald-400 opacity-80',
    },
    blue: {
      iconGlow: 'text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.9)]',
      iconDim: 'text-blue-400/60',
      bar: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.7)]',
      activeBg: 'bg-blue-900/20',
      labelActive: 'text-blue-300',
      chevronActive: 'text-blue-400 opacity-80',
    },
    orange: {
      iconGlow: 'text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.9)]',
      iconDim: 'text-orange-400/60',
      bar: 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.7)]',
      activeBg: 'bg-orange-900/20',
      labelActive: 'text-orange-300',
      chevronActive: 'text-orange-400 opacity-80',
    },
  }
  const h = headerColorMap[color]

  return (
    <button
      onClick={onToggle}
      className={`group relative flex w-full items-center justify-between px-4 py-3 transition-all duration-200 hover:bg-slate-800 ${isActive ? h.activeBg : ''}`}
    >
      {isActive && <div className={`absolute top-0 bottom-0 left-0 w-[3px] ${h.bar}`} />}
      <div className="flex items-center gap-3">
        <SectionIcon
          className={`h-5 w-5 transition-all duration-200 ${isOpen || isActive ? h.iconGlow : h.iconDim}`}
        />
        <span
          className={`text-sm font-medium transition-colors duration-200 ${isActive ? h.labelActive : 'text-slate-200'}`}
        >
          {label}
        </span>
      </div>
      {isOpen ? (
        <ChevronUp
          className={`h-4 w-4 transition-all duration-200 ${isActive ? h.chevronActive : 'opacity-50'}`}
        />
      ) : (
        <ChevronDown
          className={`h-4 w-4 transition-all duration-200 ${isActive ? h.chevronActive : 'opacity-50'}`}
        />
      )}
    </button>
  )
}

/* ─── Main Sidebar ──────────────────────────────────────────── */
const Sidebar = ({ isPropertyOpen, setIsPropertyOpen, activeItem, setActiveItem }) => {
  const navigate = useNavigate()
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()

  const propertyItems = [
    { name: 'Building', icon: Building },
    { name: 'Floor', icon: Layers },
    { name: 'Room Type', icon: LayoutDashboard },
    { name: 'Room', icon: DoorOpen },
    { name: 'Room Status', icon: CheckSquare },
    { name: 'Tax', icon: Receipt },
  ]

  const profileItems = [{ name: 'Personal Detail', icon: User }]

  const configurationItems = [
    { name: 'Document Type', icon: FileText },
    { name: 'Payment Type', icon: CreditCard },
    { name: 'Other Charge', icon: Zap },
  ]

  const [isProfileOpen, setIsProfileOpen] = useState(true)
  const [isConfigOpen, setIsConfigOpen] = useState(true)

  const isPropertyActive = propertyItems.some((i) => i.name === activeItem)
  const isProfileActive = profileItems.some((i) => i.name === activeItem)
  const isConfigActive = configurationItems.some((i) => i.name === activeItem)

  const expandedContainer = {
    boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.4), inset 0 -2px 8px rgba(0,0,0,0.3)',
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`bg-surface-100 fixed z-30 flex h-full w-64 shrink-0 flex-col text-white shadow-xl transition-all duration-300 ease-in-out lg:static lg:h-auto ${
          isSidebarOpen ? 'ml-0' : '-ml-64'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-700/50 p-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Menu
              className="h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            />
            <span className="text-sm font-semibold tracking-widest whitespace-nowrap uppercase">
              Imperion
            </span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col overflow-hidden py-0">
          <div className="custom-scrollbar flex-1 overflow-y-auto py-4">
            {/* Go to Home */}
            <button
              onClick={() => {
                navigate('/home', { state: { initialFloor: 'All' } })
                if (window.innerWidth < 1024) setIsSidebarOpen(false)
              }}
              className={`relative mb-1 flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold transition-all ${
                activeItem === 'Home'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
              }`}
              style={{ borderRadius: '0' }}
            >
              {activeItem === 'Home' && (
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.7)]" />
              )}
              <Home
                className={`h-5 w-5 ${activeItem === 'Home' ? 'text-white' : 'text-emerald-400'}`}
              />
              <span>Go to Home</span>
            </button>

            <div className="my-2 border-t border-slate-700/40" />

            {/* ── ROOM SETTINGS ── */}
            <div>
              <SectionHeader
                label="Room Settings"
                icon={Building}
                isOpen={isPropertyOpen}
                onToggle={() => setIsPropertyOpen(!isPropertyOpen)}
                isActive={isPropertyActive}
                color="emerald"
              />
              {isPropertyOpen && (
                <div
                  className="border-y border-slate-800/50 bg-surface-50 py-2"
                  style={expandedContainer}
                >
                  {propertyItems.map((item) => (
                    <SubItem
                      key={item.name}
                      item={item}
                      isActive={activeItem === item.name}
                      color="emerald"
                      onClick={() => {
                        setActiveItem(item.name)
                        if (window.innerWidth < 1024) setIsSidebarOpen(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="my-2 border-t border-slate-700/40" />

            {/* ── PROFILE SETTING ── */}
            <div>
              <SectionHeader
                label="Profile Setting"
                icon={User}
                isOpen={isProfileOpen}
                onToggle={() => setIsProfileOpen(!isProfileOpen)}
                isActive={isProfileActive}
                color="blue"
              />
              {isProfileOpen && (
                <div
                  className="border-y border-slate-800/50 bg-surface-50 py-2"
                  style={expandedContainer}
                >
                  {profileItems.map((item) => (
                    <SubItem
                      key={item.name}
                      item={item}
                      isActive={activeItem === item.name}
                      color="blue"
                      onClick={() => {
                        setActiveItem(item.name)
                        if (window.innerWidth < 1024) setIsSidebarOpen(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="my-2 border-t border-slate-700/40" />

            {/* ── CONFIGURATION ── */}
            <div>
              <SectionHeader
                label="Configuration"
                icon={Settings}
                isOpen={isConfigOpen}
                onToggle={() => setIsConfigOpen(!isConfigOpen)}
                isActive={isConfigActive}
                color="orange"
              />
              {isConfigOpen && (
                <div
                  className="border-y border-slate-800/50 bg-surface-50 py-2"
                  style={expandedContainer}
                >
                  {configurationItems.map((item) => (
                    <SubItem
                      key={item.name}
                      item={item}
                      isActive={activeItem === item.name}
                      color="orange"
                      onClick={() => {
                        setActiveItem(item.name)
                        if (window.innerWidth < 1024) setIsSidebarOpen(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Log Out */}
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

export default Sidebar
