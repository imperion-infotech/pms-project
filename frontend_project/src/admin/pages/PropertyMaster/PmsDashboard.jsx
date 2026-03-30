import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { propertyService } from '../../../services/propertyService';
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
 * PmsDashboard (Admin Dashboard Module Root)
 * 
 * This is the central control panel for the Property Management System (PMS).
 * Features:
 * - Layout: Sidebar, Top Navbar, Breadcrumb PageHeader.
 * - Dynamic Content: Routes between Floor, Room Type, Room, and Room Status management.
 * - CRUD Logic: Uses the centralized usePmsData hook to interact with backend services.
 * - State: Manages UI states like active navigation items and modal visibility.
 */
const PmsDashboard = () => {
  const { isDark } = useTheme();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  // User Role Detection for permissions
  const [userRole] = useState(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return 'ROLE_USER';
    try {
      const payload = JSON.parse(atob(token.trim().replace(/^"|"$/g, '').split('.')[1]));
      return payload.role || (Array.isArray(payload.roles) ? payload.roles[0] : payload.roles) ||
        (Array.isArray(payload.authorities) ? payload.authorities[0]?.authority || payload.authorities[0] : payload.authorities) ||
        localStorage.getItem('user_role') || 'ROLE_USER';
    } catch {
      return localStorage.getItem('user_role') || 'ROLE_ADMIN';
    }
  });

  // Centralized data fetching hook
  const {
    floors, buildings, roomTypes, roomStatuses, rooms, isLoading, fetchData,
    addFloor, updateFloor, deleteFloor,
    addBuilding, updateBuilding, deleteBuilding,
    addRoomType, updateRoomType, deleteRoomType,
    addRoomStatus, updateRoomStatus: hookUpdateRoomStatus, deleteRoomStatus,
    addRoom, updateRoom: hookUpdateRoom, deleteRoom,
    taxes, addTax, updateTax, deleteTax,
    personalDetails, addPersonalDetail, updatePersonalDetail, deletePersonalDetail,
    searchRooms, searchFloors, searchBuildings, searchRoomTypes, searchRoomStatuses,
  } = usePmsData();

  // Dashboard navigation state
  const [activeItem, setActiveItem] = useState('Building');
  const [isPropertyOpen, setIsPropertyOpen] = useState(true);

  // Grouped modal visibility states
  const [modals, setModals] = useState({
    floor: false, floorEdit: false,
    building: false, buildingEdit: false,
    roomType: false, roomTypeEdit: false,
    roomStatus: false, roomStatusEdit: false,
    room: false, roomEdit: false,
    personalDetail: false,
    personalDetailEdit: false,
    tax: false, taxEdit: false,
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
  const [newBuilding, setNewBuilding] = useState({ name: '', description: '' });
  const [editBuilding, setEditBuilding] = useState({ id: null, name: '', description: '' });
  const [newRoomType, setNewRoomType] = useState({ shortName: '', roomTypeName: '', price: '' });
  const [editRoomType, setEditRoomType] = useState({ id: null, shortName: '', roomTypeName: '', price: '' });
  const [newRoomStatus, setNewRoomStatus] = useState({ roomStatusName: '', roomStatusTitle: '', roomStatusColor: '#2798e8' });
  const [editRoomStatus, setEditRoomStatus] = useState({ id: null, roomStatusName: '', roomStatusTitle: '', roomStatusColor: '#2798e8' });
  const [newRoom, setNewRoom] = useState({ roomName: '', roomShortName: '', roomTypeId: '', floorId: '', buildingId: '', smoking: false, handicap: false, nonRoom: false });
  const [editRoom, setEditRoom] = useState({ id: null, roomName: '', roomShortName: '', roomTypeId: '', floorId: '', buildingId: '', smoking: false, handicap: false, nonRoom: false });
  const [newTax, setNewTax] = useState({ taxMasterName: '', taxTypeEnum: 'Occupancy_tax', perDayTax: false, perStayTax: false });
  const [editTax, setEditTax] = useState({ id: null, taxMasterName: '', taxTypeEnum: 'Occupancy_tax', perDayTax: false, perStayTax: false });

  // Personal Detail State
  const [personalFormData, setPersonalFormData] = useState({ firstName: '', lastName: '', companyName: '', phone: '', email: '', address: '', profilePhoto: '', signature: '' });
  const [uploadingType, setUploadingType] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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
    await updateFloor(editFloor.id, editFloor);
    toggleModal('floorEdit', false);
  };

  const handleAddBuilding = async (e) => {
    e.preventDefault();
    if (!newBuilding.name) return;
    try {
      await addBuilding(newBuilding);
      setNewBuilding({ name: '', description: '' });
      toggleModal('building', false);
    } catch (err) {
      console.error('Add Building Error:', err);
      alert('Failed to add building. Please try again.');
    }
  };

  const handleUpdateBuilding = async (e) => {
    e.preventDefault();
    if (!editBuilding.name) return;
    try {
      // Send id in body to ensure entire object is updated correctly by backend
      await updateBuilding(editBuilding.id, {
        id: editBuilding.id,
        name: editBuilding.name,
        description: editBuilding.description || ''
      });
      toggleModal('buildingEdit', false);
    } catch (err) {
      console.error('Update Building Error:', err);
      alert('Failed to update building. Please check your data.');
    }
  };

  const handleAddRoomType = async (e) => {
    e.preventDefault();
    if (!newRoomType.roomTypeName) return;
    await addRoomType(newRoomType);
    setNewRoomType({ shortName: '', roomTypeName: '', price: '' });
    toggleModal('roomType', false);
  };

  const handleUpdateRoomType = async (e) => {
    e.preventDefault();
    if (!editRoomType.roomTypeName) return;
    await updateRoomType(editRoomType.id, {
      shortName: editRoomType.shortName,
      roomTypeName: editRoomType.roomTypeName,
      price: editRoomType.price
    });
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
    await hookUpdateRoomStatus(editRoomStatus.id, { ...editRoomStatus, roomStatusTextColor: '#000000' });
    toggleModal('roomStatusEdit', false);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const isNonRoom = Boolean(newRoom.nonRoom || newRoom.non_room || newRoom.isNonRoom);
    if (!newRoom.roomName || (!isNonRoom && !newRoom.roomTypeId) || !newRoom.floorId || !newRoom.buildingId) return;

    // Prepare payload matching the provided JSON schema
    const payload = {
      roomName: newRoom.roomName,
      name: newRoom.roomName, // Synchronized as per schema
      roomShortName: newRoom.roomShortName || newRoom.roomName,
      roomTypeId: isNonRoom ? null : Number(newRoom.roomTypeId),
      floorId: Number(newRoom.floorId),
      buildingId: Number(newRoom.buildingId),
      smoking: Boolean(newRoom.smoking),
      handicap: Boolean(newRoom.handicap),
      nonRoom: isNonRoom
    };

    await addRoom(payload);
    setNewRoom({ roomName: '', roomShortName: '', roomTypeId: '', floorId: '', buildingId: '', smoking: false, handicap: false, nonRoom: false });
    toggleModal('room', false);
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    const isNonRoom = Boolean(editRoom.nonRoom || editRoom.non_room || editRoom.isNonRoom);
    if (!editRoom.roomName || (!isNonRoom && !editRoom.roomTypeId) || !editRoom.floorId || !editRoom.buildingId) return;

    // Prepare payload matching the provided JSON schema
    const payload = {
      id: editRoom.id,
      roomName: editRoom.roomName,
      name: editRoom.roomName, // Synchronized
      roomShortName: editRoom.roomShortName || editRoom.roomName,
      roomTypeId: isNonRoom ? null : Number(editRoom.roomTypeId),
      floorId: Number(editRoom.floorId),
      buildingId: Number(editRoom.buildingId),
      smoking: Boolean(editRoom.smoking),
      handicap: Boolean(editRoom.handicap),
      nonRoom: isNonRoom,
      createdOn: editRoom.createdOn // Preserve metadata if present
    };

    await hookUpdateRoom(editRoom.id, payload);
    toggleModal('roomEdit', false);
  };

  const handleAddTax = async (e) => {
    e.preventDefault();
    if (!newTax.taxMasterName) return;
    await addTax(newTax);
    setNewTax({ taxMasterName: '', taxTypeEnum: 'Occupancy_tax', perDayTax: false, perStayTax: false });
    toggleModal('tax', false);
  };

  const handleUpdateTax = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: editTax.id,
        taxMasterName: editTax.taxMasterName,
        taxTypeEnum: editTax.taxTypeEnum,
        perDayTax: Boolean(editTax.perDayTax),
        perStayTax: Boolean(editTax.perStayTax),
        createdOn: editTax.createdOn
      };
      await updateTax(editTax.id, payload);
      console.log("Payload--------------------------->", payload)
      toggleModal('taxEdit', false);
    } catch (err) {
      console.error('Update Tax Error:', err);
      alert('Update failed. Ensure that Tax Type Enum is a valid value recognised by the backend.');
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    if (!personalFormData.firstName) return;

    setIsSaving(true);
    try {
      if (personalFormData.id) {
        await updatePersonalDetail(personalFormData.id, personalFormData);
        alert('Profile updated successfully!');
      } else {
        await addPersonalDetail(personalFormData);
        alert('Profile created successfully!');
      }
      setPersonalFormData({ firstName: '', lastName: '', companyName: '', phone: '', email: '', address: '', profilePhoto: '', signature: '' });
      toggleModal('personalDetail', false);
      toggleModal('personalDetailEdit', false);
    } catch (err) {
      console.error('Personal Detail Error:', err);
      alert('Failed to save profile. Please check the console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePersonalFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingType(type);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await propertyService.uploadImage(uploadFormData);
      const responseData = response.data.fileName || response.data;

      // Industrial cleanup: Extract only the path/filename if the response includes a success message
      let fileName = responseData;
      if (typeof responseData === 'string' && responseData.includes(': ')) {
        fileName = responseData.split(': ')[1].trim();
      }

      setPersonalFormData(prev => ({
        ...prev,
        [type === 'photo' ? 'profilePhoto' : 'signature']: fileName
      }));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploadingType(null);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchTerm, setSearchTerm] = useState('');

  // Reset page when switching tabs or searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeItem, searchTerm]);

  // Global Server-side Search implementation
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        switch (activeItem) {
          case 'Building': searchBuildings(searchTerm); break;
          case 'Floor': searchFloors(searchTerm); break;
          case 'Room Type': searchRoomTypes(searchTerm); break;
          case 'Room': searchRooms(searchTerm); break;
          case 'Room Status': searchRoomStatuses(searchTerm); break;
          default: break;
        }
      } else {
        // Reset to full list if search is cleared
        fetchData();
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, activeItem, fetchData, searchBuildings, searchFloors, searchRoomStatuses, searchRoomTypes, searchRooms]);

  // Industrial Standard Performance Optimization: UseMemo for filtering
  const filteredData = React.useMemo(() => {
    const filter = (data) => {
      if (!Array.isArray(data)) return [];
      if (!searchTerm) return data;
      const lowerSearch = searchTerm.toLowerCase();
      return data.filter(item => {
        const m = (val) => val && String(val).toLowerCase().includes(lowerSearch);
        return m(item.roomName) || m(item.name) || m(item.roomTypeName) || m(item.roomStatusName) ||
          m(item.firstName) || m(item.lastName) || m(item.email) || m(item.phone) || m(item.companyName) ||
          m(item.taxMasterName) || m(item.taxTypeEnum);
      });
    };
    return {
      floors: filter(floors), buildings: filter(buildings), roomTypes: filter(roomTypes),
      rooms: filter(rooms), roomStatuses: filter(roomStatuses), personalDetails: filter(personalDetails),
      taxes: filter(taxes)
    };
  }, [searchTerm, floors, buildings, roomTypes, roomStatuses, rooms, personalDetails, taxes]);

  // ✅ Industrial Standard Performance Optimization: UseMemo for pagination
  const paginatedData = React.useMemo(() => {
    const paginate = (data) => {
      if (!Array.isArray(data)) return [];
      const start = (currentPage - 1) * itemsPerPage;
      return data.slice(start, start + itemsPerPage);
    };
    return {
      floors: paginate(filteredData.floors),
      buildings: paginate(filteredData.buildings),
      roomTypes: paginate(filteredData.roomTypes),
      rooms: paginate(filteredData.rooms),
      roomStatuses: paginate(filteredData.roomStatuses),
      personalDetails: paginate(filteredData.personalDetails),
      taxes: paginate(filteredData.taxes)
    };
  }, [currentPage, itemsPerPage, filteredData]);

  return (
    <div className={`flex h-screen ${isDark ? 'bg-surface-50 text-slate-100' : 'bg-[#f4f7fa] text-slate-800'} font-sans overflow-hidden transition-colors duration-300`}>
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
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* 5. Main Content Area - Scrollable */}
        <main className={`flex-1 overflow-auto ${isDark ? 'bg-surface-50' : 'bg-[#f8fafc]'} custom-scrollbar p-3 md:p-6 lg:p-8 transition-colors duration-300`}>
          <div className="max-w-[1600px] mx-auto space-y-4 md:y-6 flex flex-col">

            {/* Dynamic Dashboard Module Rendering */}
            <DashboardRouter
              activeItem={activeItem}
              floors={paginatedData.floors}
              buildings={paginatedData.buildings}
              roomTypes={paginatedData.roomTypes}
              roomStatuses={paginatedData.roomStatuses}
              rooms={paginatedData.rooms}
              allFloors={floors}
              allBuildings={buildings}
              allRoomTypes={roomTypes}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              toggleModal={toggleModal}
              setEditFloor={setEditFloor}
              setEditBuilding={setEditBuilding}
              setEditRoomType={setEditRoomType}
              setEditRoomStatus={setEditRoomStatus}
              setEditRoom={setEditRoom}
              deleteFloor={deleteFloor}
              deleteBuilding={deleteBuilding}
              deleteRoomType={deleteRoomType}
              deleteRoomStatus={deleteRoomStatus}
              deleteRoom={deleteRoom}
              setEditTax={setEditTax}
              deleteTax={deleteTax}
              taxes={paginatedData.taxes}
              personalDetails={paginatedData.personalDetails}
              onAddPersonalDetail={() => {
                setPersonalFormData({ firstName: '', lastName: '', companyName: '', phone: '', email: '', address: '', profilePhoto: '', signature: '' });
                toggleModal('personalDetail', true);
              }}
              onEditPersonalDetail={(item) => {
                setPersonalFormData(item);
                toggleModal('personalDetailEdit', true);
              }}
              onDeletePersonalDetail={deletePersonalDetail}
              currentPage={currentPage}
              isLoading={isLoading}
              userRole={userRole}
            />

            {/* Pagination Controls */}
            {(activeItem === 'Floor' || activeItem === 'Building' || activeItem === 'Room Type' || activeItem === 'Room' || activeItem === 'Room Status' || activeItem === 'Personal Detail' || activeItem === 'Tax') && (
              <div className="mt-8">
                <Pagination
                  activeItem={activeItem}
                  floors={filteredData.floors}
                  buildings={filteredData.buildings}
                  roomTypes={filteredData.roomTypes}
                  rooms={filteredData.rooms}
                  roomStatuses={filteredData.roomStatuses}
                  taxes={filteredData.taxes}
                  personalDetails={filteredData.personalDetails}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
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
        newBuilding={newBuilding} setNewBuilding={setNewBuilding} handleAddBuilding={handleAddBuilding}
        editBuilding={editBuilding} setEditBuilding={setEditBuilding} handleUpdateBuilding={handleUpdateBuilding}
        buildings={buildings}
        newRoomType={newRoomType} setNewRoomType={setNewRoomType} handleAddRoomType={handleAddRoomType}
        editRoomType={editRoomType} setEditRoomType={setEditRoomType} handleUpdateRoomType={handleUpdateRoomType}
        roomTypes={roomTypes}
        newRoomStatus={newRoomStatus} setNewRoomStatus={setNewRoomStatus} handleAddRoomStatus={handleAddRoomStatus}
        editRoomStatus={editRoomStatus} setEditRoomStatus={setEditRoomStatus} handleUpdateRoomStatus={handleUpdateRoomStatus}
        roomStatuses={roomStatuses}
        newRoom={newRoom} setNewRoom={setNewRoom} handleAddRoom={handleAddRoom}
        editRoom={editRoom} setEditRoom={setEditRoom} handleUpdateRoom={handleUpdateRoom}
        rooms={rooms}
        newTax={newTax} setNewTax={setNewTax} handleAddTax={handleAddTax}
        editTax={editTax} setEditTax={setEditTax} handleUpdateTax={handleUpdateTax}
        taxes={taxes}
        personalFormData={personalFormData}
        setPersonalFormData={setPersonalFormData}
        handlePersonalSubmit={handlePersonalSubmit}
        handlePersonalFileUpload={handlePersonalFileUpload}
        uploadingType={uploadingType}
        isLoading={isLoading || isSaving}
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
