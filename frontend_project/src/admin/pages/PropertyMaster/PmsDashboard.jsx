import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import PageHeader from '../../components/layout/PageHeader';
import Pagination from '../../components/common/Pagination';
import LoadingProcess from '../../../components/common/LoadingProcess';

// Contexts & Hooks
import usePmsData from '../../../hooks/usePmsData';
import { useTheme } from '../../../context/ThemeContext';
import { useSidebar } from '../../../context/SidebarContext';

// Sub-components (Refactored for maintainability)
import DashboardRouter from './components/DashboardRouter';
import DashboardModals from './components/DashboardModals';

/**
 * PmsDashboard (Admin Module Root)
 * 
 * This is the central control panel for the Property Management System (PMS).
 * Features:
 * - Layout: Sidebar, Top Navbar, Breadcrumb PageHeader.
 * - Dynamic Content: Routes between Floor, Room Type, Room, and Room Status management.
 * - CRUD Logic: Uses the centralized usePmsData hook to interact with backend services.
 * - State: Manages UI states like active navigation items and modal visibility.
 */
const PmsDashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  // Centralized data fetching hook
  const {
    floors, roomTypes, roomStatuses, rooms, isLoading, fetchData,
    addFloor, updateFloor, deleteFloor,
    addRoomType, updateRoomType, deleteRoomType,
    addRoomStatus, updateRoomStatus, deleteRoomStatus,
    addRoom, updateRoom, deleteRoom
  } = usePmsData();

  // Dashboard navigation state
  const [activeItem, setActiveItem] = useState('Floor');
  const [isPropertyOpen, setIsPropertyOpen] = useState(true);

  // Grouped modal visibility states
  const [modals, setModals] = useState({
    floor: false, floorEdit: false,
    roomType: false, roomTypeEdit: false,
    roomStatus: false, roomStatusEdit: false,
    room: false, roomEdit: false
  });

  const toggleModal = (modalName, isOpen) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  };

  /**
   * Data Persistence States (Forms)
   * We maintain separate state for Create (newX) and Edit (editX) scenarios.
   */
  const [newFloor, setNewFloor] = useState({ name: '', description: '' });
  const [editFloor, setEditFloor] = useState({ id: null, name: '', description: '' });
  const [newRoomType, setNewRoomType] = useState({ shortName: '', roomTypeName: '' });
  const [editRoomType, setEditRoomType] = useState({ id: null, shortName: '', roomTypeName: '' });
  const [newRoomStatus, setNewRoomStatus] = useState({ roomStatusName: '', roomStatusTitle: '', roomStatusColor: '#2798e8' });
  const [editRoomStatus, setEditRoomStatus] = useState({ id: null, roomStatusName: '', roomStatusTitle: '', roomStatusColor: '#2798e8' });
  const [newRoom, setNewRoom] = useState({ roomName: '', roomTypeId: '', floorId: '', smoking: false, handicap: false, nonRoom: false });
  const [editRoom, setEditRoom] = useState({ id: null, roomName: '', roomTypeId: '', floorId: '', smoking: false, handicap: false, nonRoom: false });

  /**
   * EVENT HANDLERS - Property Management Actions
   */
  const handleAddFloor = async (e) => {
    e.preventDefault();
    if (!newFloor.name) return;
    await addFloor(newFloor);
    setNewFloor({ name: '', description: '' });
    toggleModal('floor', false);
  };

  const handleUpdateFloor = async (e) => {
    e.preventDefault();
    if (!editFloor.name) return;
    await updateFloor(editFloor.id, { name: editFloor.name, description: editFloor.description });
    toggleModal('floorEdit', false);
  };

  const handleAddRoomType = async (e) => {
    e.preventDefault();
    if (!newRoomType.roomTypeName) return;
    await addRoomType(newRoomType);
    setNewRoomType({ shortName: '', roomTypeName: '' });
    toggleModal('roomType', false);
  };

  const handleUpdateRoomType = async (e) => {
    e.preventDefault();
    if (!editRoomType.roomTypeName) return;
    await updateRoomType(editRoomType.id, { shortName: editRoomType.shortName, roomTypeName: editRoomType.roomTypeName });
    toggleModal('roomTypeEdit', false);
  };

  const handleAddRoomStatus = async (e) => {
    e.preventDefault();
    if (!newRoomStatus.roomStatusName) return;
    await addRoomStatus({ ...newRoomStatus, roomStatusTextColor: '#000000' });
    setNewRoomStatus({ roomStatusName: '', roomStatusTitle: '', roomStatusColor: '#2798e8' });
    toggleModal('roomStatus', false);
  };

  const handleUpdateRoomStatus = async (e) => {
    e.preventDefault();
    if (!editRoomStatus.roomStatusName) return;
    await updateRoomStatus(editRoomStatus.id, { ...editRoomStatus, roomStatusTextColor: '#000000' });
    toggleModal('roomStatusEdit', false);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.roomName || (!newRoom.nonRoom && !newRoom.roomTypeId) || !newRoom.floorId) return;
    await addRoom({ ...newRoom, roomShortName: newRoom.roomName });
    setNewRoom({ roomName: '', roomTypeId: '', floorId: '', smoking: false, handicap: false, nonRoom: false });
    toggleModal('room', false);
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (!editRoom.roomName || (!editRoom.nonRoom && !editRoom.roomTypeId) || !editRoom.floorId) return;
    await updateRoom(editRoom.id, { ...editRoom, roomShortName: editRoom.roomName });
    toggleModal('roomEdit', false);
  };

  return (
    <div className={`flex h-screen ${isDark ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f4f7fa] text-slate-800'} font-sans overflow-hidden transition-colors duration-300`}>
      {/* 1. Global Navigation Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isPropertyOpen={isPropertyOpen}
        setIsPropertyOpen={setIsPropertyOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* 2. Full-Page Loading State Overlays */}
      <LoadingProcess isLoading={isLoading} barOnly={true} />

      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0 h-full">
        {/* 3. Top Header Layer (Global) */}
        <Navbar />

        {/* 4. Page Specific Title/Breadcrumb Layer */}
        <PageHeader
          activeItem={activeItem}
          onRefresh={fetchData}
          isLoading={isLoading}
        />

        {/* 5. Main Content Area - Scrollable */}
        <main className={`flex-1 overflow-auto ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'} custom-scrollbar p-3 md:p-6 lg:p-8 transition-colors duration-300`}>
          <div className="max-w-[1600px] mx-auto space-y-4 md:y-6 h-full flex flex-col">

            {/* Dynamic Dashboard Module Rendering */}
            <DashboardRouter
              activeItem={activeItem}
              floors={floors}
              roomTypes={roomTypes}
              roomStatuses={roomStatuses}
              rooms={rooms}
              toggleModal={toggleModal}
              setEditFloor={setEditFloor}
              setEditRoomType={setEditRoomType}
              setEditRoomStatus={setEditRoomStatus}
              setEditRoom={setEditRoom}
              deleteFloor={deleteFloor}
              deleteRoomType={deleteRoomType}
              deleteRoomStatus={deleteRoomStatus}
              deleteRoom={deleteRoom}
            />

            {/* Pagination Controls */}
            {(activeItem === 'Floor' || activeItem === 'Room Type' || activeItem === 'Room') && (
              <div className="mt-8">
                <Pagination activeItem={activeItem} floors={floors} roomTypes={roomTypes} rooms={rooms} isLoading={isLoading} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 6. Centered Property Management Modals */}
      <DashboardModals
        modals={modals}
        toggleModal={toggleModal}
        newFloor={newFloor} setNewFloor={setNewFloor} handleAddFloor={handleAddFloor}
        editFloor={editFloor} setEditFloor={setEditFloor} handleUpdateFloor={handleUpdateFloor}
        floors={floors}
        newRoomType={newRoomType} setNewRoomType={setNewRoomType} handleAddRoomType={handleAddRoomType}
        editRoomType={editRoomType} setEditRoomType={setEditRoomType} handleUpdateRoomType={handleUpdateRoomType}
        roomTypes={roomTypes}
        newRoomStatus={newRoomStatus} setNewRoomStatus={setNewRoomStatus} handleAddRoomStatus={handleAddRoomStatus}
        editRoomStatus={editRoomStatus} setEditRoomStatus={setEditRoomStatus} handleUpdateRoomStatus={handleUpdateRoomStatus}
        roomStatuses={roomStatuses}
        newRoom={newRoom} setNewRoom={setNewRoom} handleAddRoom={handleAddRoom}
        editRoom={editRoom} setEditRoom={setEditRoom} handleUpdateRoom={handleUpdateRoom}
        rooms={rooms}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
};

export default PmsDashboard;
