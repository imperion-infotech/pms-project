/**
 * HomeScreen.jsx - Independent User Room View
 * 
 * Purpose:
 * This component provides an independent, simplified view of the property's 
 * real-time room status. It is designed for non-admin users to quickly 
 * check room availability and perform basic guest management.
 * 
 * Key Features:
 * 1. Live synchronization with the property master database.
 * 2. Visual room status (Color-coded based on backend statuses).
 * 3. Grouped room viewing (Rooms are automatically sorted into their respective Floors).
 * 4. Guest Action Modal: Allows adding/editing guest details directly from the room view.
 */
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BedDouble, AlertCircle
} from 'lucide-react';
import usePmsData from '../../../hooks/usePmsData';
import { useTheme } from '../../../context/ThemeContext';
import { useSidebar } from '../../../context/SidebarContext';
import LoadingProcess from '../../../components/common/LoadingProcess';

// Layout & UI Components
import UserSidebar from '../../components/layout/UserSidebar';
import UserNavbar from '../../components/layout/UserNavbar';
import UserPageHeader from '../../components/layout/UserPageHeader';
import FloorSection from './components/FloorSection';
import RoomActionModal from './components/RoomActionModal';

const HomeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  
  // Custom hook to fetch all property data at once
  const {
    rooms: rawRooms,
    floors: allFloors,
    buildings,
    roomTypes,
    roomStatuses,
    isLoading,
    error,
    fetchData: refreshData
  } = usePmsData();

  // Component local states
  const [selectedFloor, setSelectedFloor] = useState(location.state?.initialFloor || 'All');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedRoomAction, setSelectedRoomAction] = useState(null);

  /**
   * mappedData (useMemo Optimization)
   * We calculate room relationships once per data update.
   * This links rooms to their specific Floor names, Type names, and Status colors.
   */
  const mappedData = useMemo(() => {
    if (!rawRooms.length) return { mappedRooms: [], roomsByFloor: {}, stats: { occupied: 0, available: 0 } };

    const mapped = rawRooms.map(r => {
      const floorObj = allFloors.find(f => f.id == r.floorId);
      const typeObj = roomTypes.find(t => t.id == r.roomTypeId);
      const statusObj = roomStatuses.find(s => s.id == r.roomStatusId);

      return {
        ...r,
        shortName: typeObj?.shortName || r.shortName || 'STD',
        roomTypeName: typeObj?.roomTypeName || r.roomTypeName || 'Standard',
        floorName: floorObj?.name || 'Unknown',
        statusDetails: statusObj || { roomStatusName: 'Unknown', roomStatusColor: '#cbd5e1' },
      };
    });

    // Calculate quick stats for the header
    const occupied = mapped.filter(r => r.guestName).length;
    const available = mapped.length - occupied - mapped.filter(r => r.nonRoom).length;

    // Grouping: Convert flat flat array into Floor-based groups for the grid
    const grouped = {};
    allFloors.forEach(f => {
      grouped[f.name] = mapped.filter(r => r.floorName === f.name);
    });
    
    return { mappedRooms: mapped, roomsByFloor: grouped, stats: { occupied, available } };
  }, [rawRooms, allFloors, roomTypes, roomStatuses]);

  const { roomsByFloor, stats } = mappedData;

  const handleRoomClick = useCallback((room) => {
    setSelectedRoomAction(room);
    setIsActionModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* 1. Mobile Sidebar Navigation */}
      <UserSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        roomsByFloor={roomsByFloor}
        allFloors={allFloors}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
        buildings={buildings}
        roomTypes={roomTypes}
        roomStatuses={roomStatuses}
        onGoToPms={() => navigate('/')}
      />

      <LoadingProcess isLoading={isLoading} barOnly={true} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <UserNavbar />

        {/* 2. Page Dynamic Breadcrumb & Stats Layer */}
        <UserPageHeader
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          allFloors={allFloors}
          totalRooms={rawRooms.length}
          totalFloors={allFloors.length}
          availableRooms={stats.available}
          occupiedRooms={stats.occupied}
          onRefresh={refreshData}
          isLoading={isLoading}
        />

        {/* 3. Main Data Visualization Grid */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar bg-[#f8fafc] dark:bg-slate-950">
          <div className="max-w-[1700px] mx-auto px-6 py-8">
            <LoadingProcess isLoading={isLoading} spinnerOnly={true} fullScreen={false} message="Synchronizing property data..." />

            {/* ERROR HANDLING UI */}
            {!isLoading && error && (
              <div className="max-w-md mx-auto mt-20 p-8 rounded-[40px] border border-red-200 bg-white dark:bg-red-950/20 text-center animate-in zoom-in-95">
                <AlertCircle size={32} className="text-red-500 mx-auto mb-6" />
                <h3 className="text-xl font-black text-slate-900 dark:text-red-400 mb-3 uppercase">Sync Failed</h3>
                <p className="text-sm text-slate-500 mb-8">{error}</p>
                <button onClick={refreshData} className="w-full py-4 bg-red-500 text-white font-black rounded-2xl uppercase tracking-widest shadow-lg active:scale-95">Retry</button>
              </div>
            )}

            {/* NO DATA UI */}
            {!isLoading && !error && Object.keys(roomsByFloor).length === 0 && (
              <div className="max-w-lg mx-auto mt-20 p-12 rounded-[50px] border-2 border-dashed border-slate-200 text-center">
                <BedDouble size={40} className="text-slate-300 mx-auto mb-8" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase">Property is Empty</h2>
                <button onClick={() => navigate('/')} className="px-10 py-4 bg-emerald-500 text-white font-black rounded-2xl">Configure PMS</button>
              </div>
            )}

            {/* THE FLOOR GRID: Optimized rendering by floor groups */}
            {!isLoading && !error && Object.entries(roomsByFloor)
              .filter(([floorName]) => selectedFloor === 'All' || selectedFloor === floorName)
              .map(([floorName, rooms]) => (
                <FloorSection
                  key={floorName}
                  floorName={floorName}
                  rooms={rooms}
                  isDark={isDark}
                  onRoomClick={handleRoomClick}
                />
              ))}
          </div>
        </main>
      </div>

      {/* 4. Guest Detail Interaction Modal */}
      <RoomActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        room={selectedRoomAction}
        isDark={isDark}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default HomeScreen;


