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
    console.log('HomeScreen: Fetching room data...');
    try {
      const results = await Promise.allSettled([
        api.get('/user/getroommasters'),
        api.get('/user/getfloors'),
        api.get('/user/getroomtypes'),
        api.get('/user/getroomstatuses'),
        api.get('/user/getpersonaldetails'),
      ]);

      const [roomsRes, floorsRes, typesRes, statusRes, personalRes] = results.map(r => r.status === 'fulfilled' ? r.value : { data: [] });

      const extractArray = (data) => {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.content)) return data.content;
        if (data && typeof data === 'object') {
          const arrayProp = Object.values(data).find(val => Array.isArray(val));
          if (arrayProp) return arrayProp;
        }
        return [];
      };

      const floors = extractArray(floorsRes.data);
      const types = extractArray(typesRes.data);
      const statuses = extractArray(statusRes.data);
      const rawRooms = extractArray(roomsRes.data);
      const profiles = extractArray(personalRes.data);

      console.log('HomeScreen Sync Status:', {
        floors: floors.length,
        rooms: rawRooms.length,
        types: types.length
      });

      setAllFloors(floors);
      setRoomTypes(types);
      setRoomStatuses(statuses);
      setPersonalDetails(profiles);

      // Map API data to component structure
      const mappedRooms = rawRooms.map((r, idx) => {
        // Handle varying ID naming conventions (id, floorId, etc)
        const getFloorId = (room) => room.floorId || room.floor_id || room.floor?.id;
        const getTypeId = (room) => room.roomTypeId || room.room_type_id || room.roomType?.id;
        const getStatusId = (room) => room.roomStatusId || room.room_status_id || room.roomStatus?.id;

        const fId = getFloorId(r);
        const tId = getTypeId(r);
        const sId = getStatusId(r);

        const floorObj = floors.find(f => (f.id || f.floorId) == fId);
        const typeObj = types.find(t => (t.id || t.roomTypeId) == tId);
        const statusObj = statuses.find(s => (s.id || s.roomStatusId) == sId) || statuses[idx % statuses.length];

        return {
          id: r.id || r.roomMasterId || idx,
          roomName: r.roomName || r.name || `Room ${idx}`,
          shortName: typeObj ? (typeObj.shortName || typeObj.name) : 'STD',
          roomTypeName: typeObj ? (typeObj.roomTypeName || typeObj.name) : 'Standard',
          floorName: floorObj ? (floorObj.name || floorObj.floorName) : 'Unknown',
          smoking: r.smoking || false,
          handicap: r.handicap || false,
          isNonRoom: r.nonRoom || false,
          statusDetails: statusObj,
          guestName: null, // Resetting guests for now to avoid mock confusion
          buildingName: 'Main Wing'
        };
      });

      setAllRooms(mappedRooms);

      const occupiedRoomsCount = mappedRooms.filter(r => r.statusDetails?.roomStatusName === 'Occupied').length;
      setOccupiedRooms(occupiedRoomsCount);
      setAvailableRooms(mappedRooms.length - occupiedRoomsCount - mappedRooms.filter(r => r.isNonRoom).length);

      const grouped = {};
      floors.forEach(floor => {
        const floorName = floor.name || floor.floorName;
        grouped[floorName] = mappedRooms.filter(r => r.floorName === floorName);
      });

      const unknownRooms = mappedRooms.filter(r => r.floorName === 'Unknown');
      if (unknownRooms.length > 0) grouped['Unknown'] = unknownRooms;

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
