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
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '../../../context/SidebarContext'

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
  const configurationItems = [{ name: 'Document Type', icon: FileText }]

  const [isProfileOpen, setIsProfileOpen] = useState(true)
  const [isConfigOpen, setIsConfigOpen] = useState(true)

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`bg-surface-100 fixed z-30 flex h-full w-64 shrink-0 flex-col text-white shadow-xl transition-all duration-300 ease-in-out lg:static lg:h-auto ${
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
              Imperion
            </span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col overflow-hidden py-0">
          <div className="custom-scrollbar flex-1 overflow-y-auto py-4">
            {/* Go to Home Button */}
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
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.7)]"></div>
              )}
              <Home
                className={`h-5 w-5 ${activeItem === 'Home' ? 'text-white' : 'text-emerald-400'}`}
              />
              <span>Go to Home</span>
            </button>

            <div className="my-2 border-t border-slate-700/40"></div>

            <div>
              <button
                onClick={() => setIsPropertyOpen(!isPropertyOpen)}
                className="group flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium">Room Settings</span>
                </div>
                {isPropertyOpen ? (
                  <ChevronUp className="h-4 w-4 opacity-50" />
                ) : (
                  <ChevronDown className="h-4 w-4 opacity-50" />
                )}
              </button>

              {isPropertyOpen && (
                <div className="border-y border-slate-800/50 bg-[#111827] py-1">
                  {propertyItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveItem(item.name)
                        // Close sidebar on mobile after selection
                        if (window.innerWidth < 1024) setIsSidebarOpen(false)
                      }}
                      className={`relative flex w-full items-center px-6 py-2.5 text-xs font-medium transition-all ${
                        activeItem === item.name
                          ? 'bg-slate-800/50 text-white'
                          : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'
                      }`}
                    >
                      {activeItem === item.name && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                      )}
                      <span className="capitalize">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="my-2 border-t border-slate-700/40"></div>

            {/* Profile Settings Section */}
            <div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="group flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">Profile Setting</span>
                </div>
                {isProfileOpen ? (
                  <ChevronUp className="h-4 w-4 opacity-50" />
                ) : (
                  <ChevronDown className="h-4 w-4 opacity-50" />
                )}
              </button>

              {isProfileOpen && (
                <div className="border-y border-slate-800/50 bg-[#111827] py-1">
                  {profileItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveItem(item.name)
                        if (window.innerWidth < 1024) setIsSidebarOpen(false)
                      }}
                      className={`relative flex w-full items-center px-6 py-2.5 text-xs font-medium transition-all ${
                        activeItem === item.name
                          ? 'bg-slate-800/50 text-white'
                          : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'
                      }`}
                    >
                      {activeItem === item.name && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
                      )}
                      <span className="capitalize">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="my-2 border-t border-slate-700/40"></div>

            {/* Configuration Section */}
            <div>
              <button
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className="group flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-orange-400" />
                  <span className="text-sm font-medium text-slate-200">Configuration</span>
                </div>
                {isConfigOpen ? (
                  <ChevronUp className="h-4 w-4 opacity-50" />
                ) : (
                  <ChevronDown className="h-4 w-4 opacity-50" />
                )}
              </button>

              {isConfigOpen && (
                <div className="border-y border-slate-800/50 bg-[#111827] py-1">
                  {configurationItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveItem(item.name)
                        if (window.innerWidth < 1024) setIsSidebarOpen(false)
                      }}
                      className={`relative flex w-full items-center px-6 py-2.5 text-xs font-medium transition-all ${
                        activeItem === item.name
                          ? 'bg-slate-800/50 text-white'
                          : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'
                      }`}
                    >
                      {activeItem === item.name && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]"></div>
                      )}
                      <span className="capitalize">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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

export default Sidebar
