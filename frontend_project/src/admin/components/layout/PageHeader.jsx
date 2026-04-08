import { Layers, Search, RotateCw, Sun, Moon, Home } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

const PageHeader = ({ activeItem, onRefresh, isLoading, searchTerm, setSearchTerm }) => {
  const { isDark, toggleTheme } = useTheme()

  const getParentLabel = () => {
    if (activeItem === 'Personal Detail') return 'Profile Setting'
    if (activeItem === 'Document Type' || activeItem === 'Payment Type') return 'Configuration'
    return 'Room Settings'
  }

  return (
    <div
      className={`min-h-14 ${isDark ? 'bg-surface-100 border-slate-800' : 'border-slate-200 bg-white'} flex shrink-0 flex-col items-center justify-between gap-3 border-b px-4 py-2 transition-colors duration-300 sm:flex-row sm:gap-0 sm:py-0 md:px-6`}
    >
      <div className="flex w-full items-center gap-2 text-xs font-medium text-slate-500 sm:w-auto md:text-sm">
        {activeItem === 'Home' ? (
          <>
            <Home className="h-4 w-4 shrink-0 text-emerald-500" />
            <span className="truncate">Home</span>
            <span className="text-slate-300">/</span>
            <span className={`truncate font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Room View
            </span>
          </>
        ) : (
          <>
            <Layers className="h-4 w-4 shrink-0 text-emerald-500" />
            <span className="truncate">{getParentLabel()}</span>
            <span className="text-slate-300">/</span>
            <span className={`truncate font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              {activeItem}
            </span>
          </>
        )}
      </div>
      <div className="flex w-full items-center gap-3 sm:w-auto">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`rounded-lg border p-2 ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} transition-all ${isLoading ? 'cursor-not-allowed opacity-50' : 'active:scale-95'}`}
          title="Refresh Data"
        >
          <RotateCw
            className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'} ${isLoading ? 'animate-spin' : ''}`}
          />
        </button>

        <button
          onClick={toggleTheme}
          className={`rounded-lg border p-2 ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} transition-all active:scale-95`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-500" />
          ) : (
            <Moon className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {activeItem !== 'Home' && (
          <div className="relative w-full sm:w-auto">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeItem.toLowerCase()}s...`}
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`py-1.5 pr-4 pl-9 ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-500' : 'border-slate-200 bg-slate-50 text-slate-800'} w-full rounded-lg border text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none sm:w-48 md:w-64`}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader
