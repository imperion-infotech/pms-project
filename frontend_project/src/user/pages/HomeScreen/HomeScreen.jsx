import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BedDouble, RefreshCw,
  LogOut,
  CheckCircle2, AlertCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import LoadingProcess from '../../../components/common/LoadingProcess';

import UserSidebar from '../../components/layout/UserSidebar';
import UserNavbar from '../../components/layout/UserNavbar';
import UserPageHeader from '../../components/layout/UserPageHeader';
import FloorSection from './components/FloorSection';
import RoomActionModal from './components/RoomActionModal';

// ─── Main HomeScreen Page ───
const HomeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [roomsByFloor, setRoomsByFloor] = useState({});
  const [allRooms, setAllRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(location.state?.initialFloor || 'All');
  const [allFloors, setAllFloors] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [occupiedRooms, setOccupiedRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedRoomAction, setSelectedRoomAction] = useState(null);
  const [personalDetails, setPersonalDetails] = useState([]);


  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [roomsRes, floorsRes, typesRes, statusRes, personalRes] = await Promise.all([
        api.get('/auth/getroommasters').catch(() => ({ data: [] })),
        api.get('/auth/getfloors').catch(() => ({ data: [] })),
        api.get('/auth/getroomtypes').catch(() => ({ data: [] })),
        api.get('/auth/getroomstatuses').catch(() => ({ data: [] })),
        api.get('/auth/getpersonaldetails').catch(() => ({ data: [] })),
      ]);
      const floors = floorsRes.data || [];
      const types = typesRes.data || [];
      const statuses = statusRes.data || [];
      const rawRooms = roomsRes.data || [];
      const profiles = personalRes.data || [];
      setAllFloors(floors);
      setRoomTypes(types);
      setRoomStatuses(statuses);
      setPersonalDetails(profiles);


      // Map API data to component structure
      const mappedRooms = rawRooms.map((r, idx) => {
        const floorObj = floors.find(f => f.id == r.floorId);
        const typeObj = types.find(t => t.id == r.roomTypeId);
        const statusObj = statuses.find(s => s.id == r.roomStatusId) || statuses[idx % statuses.length];

        // Mock data for visual completeness (Matching the provided image)
        const mockGuests = ['Abhishek', 'Test Guest', 'Asi Test', 'Vivek Singh', 'Juliez Gerry', 'Mustafa Shaikhah'];
        const mockPrices = ['1,509.00', '1,403.50', '1,505.00', '0.00', '4,505.00'];
        const hasGuest = idx % 3 === 0 || idx === 1;

        return {
          id: r.id,
          roomName: r.roomName,
          shortName: typeObj ? typeObj.shortName : 'STD',
          roomTypeName: typeObj ? typeObj.roomTypeName : 'Standard',
          floorName: floorObj ? floorObj.name : 'Unknown',
          smoking: r.smoking,
          handicap: r.handicap,
          isNonRoom: r.nonRoom,
          statusDetails: statusObj,
          guestName: hasGuest ? mockGuests[idx % mockGuests.length] : null,
          buildingName: 'Main Wing'
        };
      });

      // Extra occupied room calculation for stats
      const occupiedRoomsCount = mappedRooms.filter(r => r.guestName).length;
      setAllRooms(mappedRooms);
      setOccupiedRooms(occupiedRoomsCount);
      setAvailableRooms(mappedRooms.length - occupiedRoomsCount - mappedRooms.filter(r => r.isNonRoom).length);

      const grouped = {};
      floors.forEach(floor => {
        grouped[floor.name] = mappedRooms.filter(r => r.floorName === floor.name);
      });
      // Fallback for rooms without a matched floor
      const unknownRooms = mappedRooms.filter(r => r.floorName === 'Unknown');
      if (unknownRooms.length > 0) {
        grouped['Unknown'] = unknownRooms;
      }

      setRoomsByFloor(grouped);
    } catch (err) {
      console.error('HomeScreen fetch error:', err);
      setError('Unable to load room data. Please check your connection and try again.');
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const totalRooms = allRooms.length;
  const totalFloors = Object.keys(roomsByFloor).length;

  const handleRoomClick = (room) => {
    // Search for guest profile matching either room guestName or room status
    const guestProfile = personalDetails.find(p => p.personalDetailName === room.guestName) || personalDetails[0];
    setSelectedRoomAction({ ...room, profile: guestProfile });
    setIsActionModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">

      {/* PROFESSIONAL SIDEBAR (Admin Style) */}
      <UserSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        roomsByFloor={roomsByFloor}
        allFloors={allFloors}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
        roomTypes={roomTypes}
        roomStatuses={roomStatuses}
        onGoToPms={() => navigate('/')}
      />


      {/* GLOBAL LOADING PROGRESS (TOP BAR) */}
      <LoadingProcess isLoading={isLoading} barOnly={true} />


      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* GLOBAL HEADER (Dark) */}
        <UserNavbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* CONTEXT HEADER (Light/Double Header) */}
        <UserPageHeader
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          allFloors={allFloors}
          totalRooms={totalRooms}
          totalFloors={totalFloors}
          availableRooms={availableRooms}
          occupiedRooms={occupiedRooms}
          isDark={isDark}
          setIsDark={setIsDark}
          onRefresh={fetchRooms}
          isLoading={isLoading}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar bg-[#f8fafc] dark:bg-slate-950">
          <div className="max-w-[1700px] mx-auto px-6 py-8">

            {/* LOADING STATE - Centered inside content */}
            <LoadingProcess
              isLoading={isLoading}
              spinnerOnly={true}
              fullScreen={false}
              message="Synchronizing room status data..."
            />


            {/* ERROR STATE */}
            {!isLoading && error && (
              <div className="max-w-md mx-auto mt-20 p-8 rounded-[40px] border border-red-200 dark:border-red-900/50 bg-white dark:bg-red-950/20 text-center animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-red-400 mb-3 uppercase tracking-tight">Sync Failed</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed px-4">{error}</p>
                <button
                  onClick={fetchRooms}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all active:scale-95"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && !error && Object.keys(roomsByFloor).length === 0 && (
              <div className="max-w-lg mx-auto mt-20 p-12 rounded-[50px] border-2 border-dashed border-slate-200 dark:border-white/5 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-8">
                  <BedDouble size={40} className="text-slate-300 dark:text-slate-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter italic">Property is Empty</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10 text-[13px] font-medium leading-relaxed px-6">
                  It seems there are no rooms or floors configured yet. Please head over to the PMS Dashboard to add your property details.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-10 py-4 bg-slate-900 dark:bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Go to PMS Dashboard
                </button>
              </div>
            )}

            {/* MAIN DATA RENDER */}
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

      <RoomActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        room={selectedRoomAction}
        isDark={isDark}
      />
    </div>
  );
};

export default HomeScreen;
