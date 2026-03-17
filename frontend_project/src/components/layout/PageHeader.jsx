// Page layout structures - PageHeader
import React from 'react';
import { Layers, Search, RotateCw, Sun, Moon } from 'lucide-react';

const PageHeader = ({ activeItem, onRefresh, isLoading, isDarkMode, toggleTheme }) => {
  return (
    <div className={`min-h-[3.5rem] ${isDarkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'} border-b flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-2 sm:py-0 shrink-0 gap-3 sm:gap-0 transition-colors duration-300`}>
      <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 w-full sm:w-auto">
        <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="truncate">Property Management</span>
        <span className="text-slate-300">/</span>
        <span className={`font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{activeItem} Master</span>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`p-2 rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
          title="Refresh Data"
        >
          <RotateCw className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} transition-all active:scale-95`}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-slate-500" />
          )}
        </button>

        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeItem.toLowerCase()}s...`}
            className={`pl-9 pr-4 py-1.5 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full sm:w-48 md:w-64`}
          />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
