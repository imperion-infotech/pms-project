/**
 * Sidebar.jsx (Admin Domain -> Layout component)
 * 
 * Renders the sliding sidebar/navigation for the Admin Dashboard.
 * Includes links to toggle the views (Floor, Room Type, Room) and a 'Go to Home' button to route 
 * to the standalone User HomeScreen page.
 */
// Page layout structures - Sidebar
import { Menu, Building, ChevronDown, ChevronUp, Layers, LayoutDashboard, DoorOpen, CheckSquare, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isPropertyOpen, setIsPropertyOpen, activeItem, setActiveItem }) => {
  const navigate = useNavigate();
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
        className={`bg-[#1e293b] text-white flex flex-col shrink-0 shadow-xl z-30 transition-all duration-300 ease-in-out w-64 fixed lg:static h-full lg:h-auto ${isSidebarOpen ? 'ml-0' : '-ml-64'
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
            {/* Go to Home Button */}
            <button
              onClick={() => {
                navigate('/home', { state: { initialFloor: 'All' } });
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-1 transition-all font-semibold text-sm relative ${activeItem === 'Home'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                }`}
              style={{ borderRadius: '0' }}
            >
              {activeItem === 'Home' && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.7)]"></div>
              )}
              <Home className={`w-5 h-5 ${activeItem === 'Home' ? 'text-white' : 'text-emerald-400'}`} />
              <span>Go to Home</span>
            </button>

            <div className="border-t border-slate-700/40 my-2"></div>

            <div>
              <button
                onClick={() => setIsPropertyOpen(!isPropertyOpen)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium">Room Settings</span>
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
                      className={`w-full flex items-center px-6 py-2.5 text-xs font-medium transition-all relative ${activeItem === item.name
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

export default Sidebar;
