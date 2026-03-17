// Page layout structures - Sidebar
import React from 'react';
import { Menu, Building, ChevronDown, ChevronUp, Layers, LayoutDashboard, DoorOpen, CheckSquare } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isPropertyOpen, setIsPropertyOpen, activeItem, setActiveItem }) => {
  const propertyItems = [
    { name: 'Floor', icon: Layers },
    { name: 'Room Type', icon: LayoutDashboard },
    { name: 'Room', icon: DoorOpen },
    { name: 'Room Status', icon: CheckSquare },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`bg-[#1e293b] text-white flex flex-col shrink-0 shadow-xl z-30 transition-all duration-300 ease-in-out w-64 fixed lg:static h-full lg:h-auto ${
          isSidebarOpen ? 'ml-0' : '-ml-64'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <Menu
              className="w-5 h-5 cursor-pointer text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            />
            <span className="font-semibold text-sm tracking-wide whitespace-nowrap">PMS MENU</span>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <div>
            <button
              onClick={() => setIsPropertyOpen(!isPropertyOpen)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Property Management</span>
              </div>
              {isPropertyOpen ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
            </button>

            {isPropertyOpen && (
              <div className="bg-[#111827] py-1 border-y border-slate-800/50">
                {propertyItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveItem(item.name);
                      // Close sidebar on mobile after selection
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-6 py-2.5 text-xs font-medium transition-all relative ${
                      activeItem === item.name
                        ? 'text-white bg-slate-800/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    {activeItem === item.name && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                    )}
                    <span className="capitalize">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
