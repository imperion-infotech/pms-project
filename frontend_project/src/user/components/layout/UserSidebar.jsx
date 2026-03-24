import React from 'react';
import {
  CheckCircle2, Layers, Menu, LogOut, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
/**
 * UserSidebar component - Matches exactly with the Admin Dashboard Sidebar.
 * Displays fetched room types and room statuses as nested accordion lists.
 */
const UserSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  roomTypes = [],
  roomStatuses = [],
  onGoToPms
}) => {
  const [isTypeMenuOpen, setIsTypeMenuOpen] = React.useState(true);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(true);
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`bg-[#1e293b] text-white flex flex-col shrink-0 shadow-2xl z-50 transition-all duration-300 ease-in-out w-64 fixed lg:static h-full lg:h-auto ${isSidebarOpen ? 'ml-0' : '-ml-64'
          }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <Menu
              className="w-5 h-5 cursor-pointer text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            />
            <span className="font-semibold text-sm tracking-wide whitespace-nowrap">IMPERION MENU</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col py-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
            {/* Go to Dashboard Button */}
            <button
              onClick={onGoToPms}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-1 transition-all font-semibold text-sm relative text-slate-300 hover:bg-slate-700/60 hover:text-white`}
              style={{ borderRadius: '0' }}
            >
              <LayoutDashboard className={`w-5 h-5 text-emerald-400`} />
              <span>Go to Dashboard</span>
            </button>

            <div className="border-t border-slate-700/40 my-2"></div>

            {/* ROOM TYPES ACCORDION */}
            <div>
              <button
                onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">Room Types</span>
                </div>
                {isTypeMenuOpen ? <ChevronUp className="w-4 h-4 opacity-50 text-slate-400 group-hover:text-white" /> : <ChevronDown className="w-4 h-4 opacity-50 text-slate-400 group-hover:text-white" />}
              </button>

              <AnimatePresence>
                {isTypeMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#111827] py-1 border-y border-slate-800/50"
                  >
                    {roomTypes.map(type => (
                      <div key={type.id} className={`w-full flex items-center justify-between px-6 py-2.5 text-xs font-medium transition-all relative text-slate-400 hover:text-white hover:bg-slate-800/30 group`}>
                        <span className="capitalize">{type.roomTypeName}</span>
                        <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {type.shortName}
                        </span>
                      </div>
                    ))}
                    {roomTypes.length === 0 && <span className="block px-6 py-3 text-[11px] text-slate-600 italic font-medium">No room types found.</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ROOM STATUSES ACCORDION */}
            <div>
              <button
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">Room Status</span>
                </div>
                {isStatusMenuOpen ? <ChevronUp className="w-4 h-4 opacity-50 text-slate-400 group-hover:text-white" /> : <ChevronDown className="w-4 h-4 opacity-50 text-slate-400 group-hover:text-white" />}
              </button>

              <AnimatePresence>
                {isStatusMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#111827] py-1 border-y border-slate-800/50"
                  >
                    {roomStatuses.map(status => (
                      <div key={status.id} className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-medium transition-all relative text-slate-400 hover:text-white hover:bg-slate-800/30 group`}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: status.roomStatusColor || '#ef4444' }}></div>
                        <span className="capitalize truncate w-full">{status.roomStatusName}</span>
                      </div>
                    ))}
                    {roomStatuses.length === 0 && <span className="block px-6 py-3 text-[11px] text-slate-600 italic font-medium">No statuses found.</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-slate-700/50">
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-colors group"
            >
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
              <span className="font-semibold text-sm">Log Out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default UserSidebar;
