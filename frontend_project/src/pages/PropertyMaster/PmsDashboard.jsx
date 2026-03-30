/**
 * PmsDashboard.jsx (Admin Domain)
 *
 * Main wrapper/layout for the Admin interface.
 * Holds state for sidebar visibility, active view (Floor, Room, Room Type), and themes (Light/Dark).
 * Handles API calls to fetch overarching data like floors, room types, and rooms to distribute
 * to the sub-components respectively.
 */
// Main Dashboard file - Page-level components
import React, { useState, useEffect, useCallback } from 'react'
import { Layers } from 'lucide-react'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from '../../components/layout/Navbar'
import PageHeader from '../../components/layout/PageHeader'
import FloorManagement from '../../features/property/components/FloorManagement'
import RoomTypeManagement from '../../features/property/components/RoomTypeManagement'
import RoomManagement from '../../features/property/components/RoomManagement'
import RoomStatusManagement from '../../features/property/components/RoomStatusManagement'
import BuildingManagement from '../../features/property/components/BuildingManagement'

import usePmsData from '../../../hooks/usePmsData'
import Pagination from '../../components/common/Pagination'
import LoadingProcess from '../../../components/common/LoadingProcess'

import {
  FloorModal,
  FloorEditModal,
  BuildingModal,
  BuildingEditModal,
  RoomTypeModal,
  RoomTypeEditModal,
  RoomStatusModal,
  RoomStatusEditModal,
  RoomModal,
  RoomEditModal,
} from '../../components/common/Modals'
// Spring Boot API instance not used directly here anymore

const PmsDashboard = () => {
  const {
    floors,
    roomTypes,
    roomStatuses,
    isLoading,
    fetchData,
    addFloor,
    updateFloor,
    deleteFloor,
    addRoomType,
    updateRoomType,
    deleteRoomType,
    addRoomStatus,
    updateRoomStatus,
    deleteRoomStatus,
    rooms,
    addRoom,
    updateRoom,
    deleteRoom,
    buildings,
    addBuilding,
    updateBuilding,
    deleteBuilding,
  } = usePmsData()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isPropertyOpen, setIsPropertyOpen] = useState(true)
  const [activeItem, setActiveItem] = useState('Floor')
  const [darkMode, setDarkMode] = useState(false)

  // Grouped modal states
  const [modals, setModals] = useState({
    floor: false,
    floorEdit: false,
    roomType: false,
    roomTypeEdit: false,
    roomStatus: false,
    roomStatusEdit: false,
    room: false,
    roomEdit: false,
    building: false,
    buildingEdit: false,
  })

  // Helper to toggle modals
  const toggleModal = (modalName, isOpen) => {
    setModals((prev) => ({ ...prev, [modalName]: isOpen }))
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const [newFloor, setNewFloor] = useState({ name: '', description: '' })
  const [editFloor, setEditFloor] = useState({ id: null, name: '', description: '' })

  const [newRoomType, setNewRoomType] = useState({ shortName: '', roomTypeName: '', price: '' })
  const [editRoomType, setEditRoomType] = useState({
    id: null,
    shortName: '',
    roomTypeName: '',
    price: '',
  })

  const [newRoomStatus, setNewRoomStatus] = useState({
    roomStatusName: '',
    roomStatusTitle: '',
    roomStatusColor: '#2798e8',
  })
  const [editRoomStatus, setEditRoomStatus] = useState({
    id: null,
    roomStatusName: '',
    roomStatusTitle: '',
    roomStatusColor: '#2798e8',
  })

  const [newRoom, setNewRoom] = useState({
    roomName: '',
    roomTypeId: '',
    floorId: '',
    buildingId: '',
    roomStatusTableId: '',
    smoking: false,
    handicap: false,
    nonRoom: false,
  })

  const [editRoom, setEditRoom] = useState({
    id: null,
    roomName: '',
    roomTypeId: '',
    floorId: '',
    buildingId: '',
    roomStatusTableId: '',
    smoking: false,
    handicap: false,
    nonRoom: false,
  })

  // ─── POST: Create a new floor ───────────
  const handleAddFloor = useCallback(
    async (e) => {
      e.preventDefault()
      if (!newFloor.name) return
      try {
        await addFloor(newFloor)
        setNewFloor({ name: '', description: '' })
        toggleModal('floor', false)
      } catch (error) {
        console.error('Failed to create floor.', error)
      }
    },
    [newFloor, addFloor],
  )

  // ─── PUT: Edit / Update a floor ──────────
  const handleEditFloor = useCallback((floor) => {
    setEditFloor({ id: floor.id, name: floor.name, description: floor.description || '' })
    toggleModal('floorEdit', true)
  }, [])

  const handleUpdateFloor = useCallback(
    async (e) => {
      e.preventDefault()
      if (!editFloor.name) return
      try {
        await updateFloor(editFloor.id, {
          name: editFloor.name,
          description: editFloor.description,
        })
        toggleModal('floorEdit', false)
      } catch (error) {
        console.error('Failed to update floor.', error)
      }
    },
    [editFloor, updateFloor],
  )

  const handleDeleteFloor = useCallback(
    async (id) => {
      try {
        await deleteFloor(id)
      } catch (e) {
        console.error('Failed to delete floor.', e)
      }
    },
    [deleteFloor],
  )

  // ─── BUILDING CRUD ─────────────────────
  const [newBuilding, setNewBuilding] = useState({ name: '', description: '' })
  const [editBuilding, setEditBuilding] = useState({ id: null, name: '', description: '' })

  const handleAddBuilding = useCallback(
    async (e) => {
      e.preventDefault()
      if (!newBuilding.name) return
      try {
        await addBuilding(newBuilding)
        setNewBuilding({ name: '', description: '' })
        toggleModal('building', false)
      } catch (error) {
        console.error('Failed to create building.', error)
      }
    },
    [newBuilding, addBuilding],
  )

  const handleEditBuilding = useCallback((building) => {
    setEditBuilding({
      id: building.id,
      name: building.name,
      description: building.description || '',
    })
    toggleModal('buildingEdit', true)
  }, [])

  const handleUpdateBuilding = useCallback(
    async (e) => {
      e.preventDefault()
      if (!editBuilding.name) return
      try {
        await updateBuilding(editBuilding.id, {
          id: editBuilding.id,
          name: editBuilding.name,
          description: editBuilding.description || '',
        })
        toggleModal('buildingEdit', false)
      } catch (error) {
        console.error('Failed to update building.', error)
      }
    },
    [editBuilding, updateBuilding],
  )

  const handleDeleteBuilding = useCallback(
    async (id) => {
      try {
        await deleteBuilding(id)
      } catch (e) {
        console.error('Failed to delete building.', e)
      }
    },
    [deleteBuilding],
  )

  // ─── POST: Create a new Room Type ───────
  const handleAddRoomType = useCallback(
    async (e) => {
      e.preventDefault()
      if (!newRoomType.roomTypeName) return
      try {
        await addRoomType(newRoomType)
        setNewRoomType({ shortName: '', roomTypeName: '' })
        toggleModal('roomType', false)
      } catch (error) {
        console.error('Failed to create room type.', error)
      }
    },
    [newRoomType, addRoomType],
  )

  // ─── PUT: Edit / Update a Room Type ──────────
  const handleEditRoomType = useCallback((roomType) => {
    setEditRoomType({
      id: roomType.id,
      shortName: roomType.shortName || '',
      roomTypeName: roomType.roomTypeName || '',
      price: roomType.price || '',
    })
    toggleModal('roomTypeEdit', true)
  }, [])

  const handleUpdateRoomType = useCallback(
    async (e) => {
      e.preventDefault()
      if (!editRoomType.roomTypeName) return
      try {
        await updateRoomType(editRoomType.id, {
          shortName: editRoomType.shortName,
          roomTypeName: editRoomType.roomTypeName,
          price: editRoomType.price,
        })
        toggleModal('roomTypeEdit', false)
      } catch (error) {
        console.error('Failed to update room type.', error)
      }
    },
    [editRoomType, updateRoomType],
  )

  const handleDeleteRoomType = useCallback(
    async (id) => {
      try {
        await deleteRoomType(id)
      } catch (e) {
        console.error('Failed to delete room type.', e)
      }
    },
    [deleteRoomType],
  )

  // ─── POST: Create a new Room Status ────────
  const handleAddRoomStatus = useCallback(
    async (e) => {
      e.preventDefault()
      if (!newRoomStatus.roomStatusName) return
      try {
        await addRoomStatus({ ...newRoomStatus, roomStatusTextColor: '#000000' })
        setNewRoomStatus({ roomStatusName: '', roomStatusTitle: '', roomStatusColor: '#2798e8' })
        toggleModal('roomStatus', false)
      } catch (error) {
        console.error('Failed to create room status.', error)
      }
    },
    [newRoomStatus, addRoomStatus],
  )

  // ─── PUT: Edit / Update a Room Status ────
  const handleEditRoomStatus = useCallback((status) => {
    setEditRoomStatus({
      id: status.id,
      roomStatusName: status.roomStatusName || '',
      roomStatusTitle: status.roomStatusTitle || '',
      roomStatusColor: status.roomStatusColor || '#2798e8',
    })
    toggleModal('roomStatusEdit', true)
  }, [])

  const handleUpdateRoomStatus = useCallback(
    async (e) => {
      e.preventDefault()
      if (!editRoomStatus.roomStatusName) return
      try {
        await updateRoomStatus(editRoomStatus.id, {
          ...editRoomStatus,
          roomStatusTextColor: '#000000',
        })
        toggleModal('roomStatusEdit', false)
      } catch (error) {
        console.error('Failed to update room status.', error)
      }
    },
    [editRoomStatus, updateRoomStatus],
  )

  const handleDeleteRoomStatus = useCallback(
    async (id) => {
      try {
        await deleteRoomStatus(id)
      } catch (e) {
        console.error('Failed to delete room status.', e)
      }
    },
    [deleteRoomStatus],
  )

  // ─── ROOM MASTER CRUD ───────────────────────────────────────────
  const handleAddRoom = useCallback(
    async (e) => {
      e.preventDefault()
      if (
        !newRoom.roomName ||
        (!newRoom.nonRoom && (!newRoom.roomTypeId || !newRoom.roomStatusTableId)) ||
        !newRoom.floorId ||
        !newRoom.buildingId
      )
        return
      try {
        const roomData = {
          roomName: newRoom.roomName,
          roomShortName: newRoom.roomName,
          floorId: Number(newRoom.floorId),
          buildingId: Number(newRoom.buildingId),
          smoking: newRoom.nonRoom ? false : newRoom.smoking,
          handicap: newRoom.nonRoom ? false : newRoom.handicap,
          nonRoom: newRoom.nonRoom ? false : newRoom.nonRoom,
        }
        if (!newRoom.nonRoom) {
          if (newRoom.roomTypeId) roomData.roomTypeId = Number(newRoom.roomTypeId)
          if (newRoom.roomStatusTableId) {
            roomData.roomStatusTableId = Number(newRoom.roomStatusTableId)
            const matchedObj = roomStatuses.find(rs => String(rs.id) === String(newRoom.roomStatusTableId))
            roomData.roomStatus = matchedObj ? matchedObj.roomStatusName : null
          }
        }
        await addRoom(roomData)
        console.log('------------------------Room Added------------------------', roomData)
        setNewRoom({
          roomName: '',
          roomTypeId: '',
          floorId: '',
          buildingId: '',
          roomStatusTableId: '',
          smoking: false,
          handicap: false,
          nonRoom: false,
        })
        toggleModal('room', false)
      } catch (error) {
        console.error('Failed to create room.', error)
      }
    },
    [newRoom, addRoom, roomStatuses],
  )

  const handleEditRoom = useCallback((room) => {
    setEditRoom({
      id: room.id,
      roomName: room.roomName || '',
      roomTypeId: room.roomTypeId || room.roomType?.id || '',
      roomStatusTableId: room.roomStatusTableId || room.room_status_table_id || room.roomStatusTable?.id || room.room_status_table?.id || '',
      floorId: room.floorId || room.floor?.id || '',
      buildingId: room.buildingId || room.building?.id || '',
      smoking: room.smoking || false,
      handicap: room.handicap || false,
      nonRoom: room.nonRoom || false,
    })
    toggleModal('roomEdit', true)
  }, [])

  const handleUpdateRoom = useCallback(
    async (e) => {
      e.preventDefault()
      if (
        !editRoom.roomName ||
        (!editRoom.nonRoom && (!editRoom.roomTypeId || !editRoom.roomStatusTableId)) ||
        !editRoom.floorId ||
        !editRoom.buildingId
      )
        return
      try {
        const roomData = {
          roomName: editRoom.roomName,
          roomShortName: editRoom.roomName,
          floorId: Number(editRoom.floorId),
          buildingId: Number(editRoom.buildingId),
          smoking: editRoom.nonRoom ? false : editRoom.smoking,
          handicap: editRoom.nonRoom ? false : editRoom.handicap,
          nonRoom: editRoom.nonRoom,
        }
        if (!editRoom.nonRoom) {
          if (editRoom.roomTypeId) roomData.roomTypeId = Number(editRoom.roomTypeId)
          if (editRoom.roomStatusTableId) {
             roomData.roomStatusTableId = Number(editRoom.roomStatusTableId)
             const matchedObj = roomStatuses.find(rs => String(rs.id) === String(editRoom.roomStatusTableId))
             roomData.roomStatus = matchedObj ? matchedObj.roomStatusName : null
          }
        }
        await updateRoom(editRoom.id, roomData)
        toggleModal('roomEdit', false)
      } catch (error) {
        console.error('Failed to update room.', error)
      }
    },
    [editRoom, updateRoom, roomStatuses],
  )

  const handleDeleteRoom = useCallback(
    async (roomId) => {
      try {
        await deleteRoom(roomId)
      } catch (error) {
        console.error('Failed to delete room.', error)
      }
    },
    [deleteRoom],
  )

  return (
    <div
      className={`flex h-screen ${darkMode ? 'bg-surface-50 text-slate-100' : 'bg-[#f4f7fa] text-slate-800'} overflow-hidden font-sans transition-colors duration-300`}
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isPropertyOpen={isPropertyOpen}
        setIsPropertyOpen={setIsPropertyOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* GLOBAL LOADING PROGRESS (TOP BAR) */}
      <LoadingProcess isLoading={isLoading} barOnly={true} />

      <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <PageHeader
          activeItem={activeItem}
          onRefresh={fetchData}
          isLoading={isLoading}
          isDarkMode={darkMode}
          toggleTheme={() => setDarkMode(!darkMode)}
        />

        <main
          className={`flex-1 overflow-auto ${darkMode ? 'bg-surface-50' : 'bg-[#f8fafc]'} custom-scrollbar p-3 transition-colors duration-300 md:p-6 lg:p-8`}
        >
          <div className="md:y-6 mx-auto max-w-[1600px] space-y-4">
            {activeItem === 'Building' ? (
              <BuildingManagement
                buildings={buildings}
                setIsBuildingModalOpen={(isOpen) => toggleModal('building', isOpen)}
                onEdit={handleEditBuilding}
                onDelete={handleDeleteBuilding}
              />
            ) : activeItem === 'Floor' ? (
              <FloorManagement
                floors={floors}
                setIsFloorModalOpen={(isOpen) => toggleModal('floor', isOpen)}
                onEdit={handleEditFloor}
                onDelete={handleDeleteFloor}
              />
            ) : activeItem === 'Room Type' ? (
              <RoomTypeManagement
                roomTypes={roomTypes}
                setIsRoomTypeModalOpen={(isOpen) => toggleModal('roomType', isOpen)}
                onEdit={handleEditRoomType}
                onDelete={handleDeleteRoomType}
              />
            ) : activeItem === 'Room Status' ? (
              <RoomStatusManagement
                roomStatuses={roomStatuses}
                setIsRoomStatusModalOpen={(isOpen) => toggleModal('roomStatus', isOpen)}
                onEdit={handleEditRoomStatus}
                onDelete={handleDeleteRoomStatus}
              />
            ) : activeItem === 'Room' ? (
              <RoomManagement
                rooms={rooms}
                roomTypes={roomTypes}
                floors={floors}
                buildings={buildings}
                roomStatuses={roomStatuses}
                setIsRoomModalOpen={(isOpen) => toggleModal('room', isOpen)}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
              />
            ) : (
              <div className="flex min-h-[300px] animate-pulse flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center md:min-h-[500px]">
                <Layers className="mb-4 h-12 w-12 text-slate-200 md:h-20 md:w-20" />
                <h3 className="text-lg leading-tight font-extrabold tracking-widest text-slate-400 uppercase md:text-xl">
                  Master Module Pending
                </h3>
                <p className="mt-2 text-xs text-slate-300 md:text-sm">
                  Working on bringing the {activeItem} screen online.
                </p>
              </div>
            )}

            {(activeItem === 'Floor' ||
              activeItem === 'Room Type' ||
              activeItem === 'Room' ||
              activeItem === 'Building') && (
              <Pagination
                activeItem={activeItem}
                floors={floors}
                buildings={buildings}
                roomTypes={roomTypes}
                rooms={rooms}
                isLoading={isLoading}
              />
            )}
          </div>
        </main>
      </div>

      {/* Add Floor Modal */}
      <FloorModal
        isFloorModalOpen={modals.floor}
        setIsFloorModalOpen={(isOpen) => toggleModal('floor', isOpen)}
        newFloor={newFloor}
        setNewFloor={setNewFloor}
        handleAddFloor={handleAddFloor}
        floors={floors}
      />

      {/* Edit Floor Modal */}
      <FloorEditModal
        isOpen={modals.floorEdit}
        setIsOpen={(isOpen) => toggleModal('floorEdit', isOpen)}
        editFloor={editFloor}
        setEditFloor={setEditFloor}
        handleUpdateFloor={handleUpdateFloor}
        floors={floors}
      />

      {/* Building Modals */}
      <BuildingModal
        isOpen={modals.building}
        setIsOpen={(isOpen) => toggleModal('building', isOpen)}
        newBuilding={newBuilding}
        setNewBuilding={setNewBuilding}
        handleAddBuilding={handleAddBuilding}
      />

      <BuildingEditModal
        isOpen={modals.buildingEdit}
        setIsOpen={(isOpen) => toggleModal('buildingEdit', isOpen)}
        editBuilding={editBuilding}
        setEditBuilding={setEditBuilding}
        handleUpdateBuilding={handleUpdateBuilding}
      />

      <RoomTypeModal
        isRoomTypeModalOpen={modals.roomType}
        setIsRoomTypeModalOpen={(isOpen) => toggleModal('roomType', isOpen)}
        newRoomType={newRoomType}
        setNewRoomType={setNewRoomType}
        handleAddRoomType={handleAddRoomType}
        roomTypes={roomTypes}
      />

      {/* Edit Room Type Modal */}
      <RoomTypeEditModal
        isOpen={modals.roomTypeEdit}
        setIsOpen={(isOpen) => toggleModal('roomTypeEdit', isOpen)}
        editRoomType={editRoomType}
        setEditRoomType={setEditRoomType}
        handleUpdateRoomType={handleUpdateRoomType}
        roomTypes={roomTypes}
      />

      {/* Add Room Status Modal */}
      <RoomStatusModal
        isOpen={modals.roomStatus}
        setIsOpen={(isOpen) => toggleModal('roomStatus', isOpen)}
        newRoomStatus={newRoomStatus}
        setNewRoomStatus={setNewRoomStatus}
        handleAddRoomStatus={handleAddRoomStatus}
        roomStatuses={roomStatuses}
      />

      {/* Edit Room Status Modal */}
      <RoomStatusEditModal
        isOpen={modals.roomStatusEdit}
        setIsOpen={(isOpen) => toggleModal('roomStatusEdit', isOpen)}
        editRoomStatus={editRoomStatus}
        setEditRoomStatus={setEditRoomStatus}
        handleUpdateRoomStatus={handleUpdateRoomStatus}
        roomStatuses={roomStatuses}
      />

      <RoomModal
        isRoomModalOpen={modals.room}
        setIsRoomModalOpen={(isOpen) => toggleModal('room', isOpen)}
        newRoom={newRoom}
        setNewRoom={setNewRoom}
        handleAddRoom={handleAddRoom}
        roomTypes={roomTypes}
        floors={floors}
        buildings={buildings}
        roomStatuses={roomStatuses}
        rooms={rooms}
      />

      <RoomEditModal
        isOpen={modals.roomEdit}
        setIsOpen={(isOpen) => toggleModal('roomEdit', isOpen)}
        editRoom={editRoom}
        setEditRoom={setEditRoom}
        handleUpdateRoom={handleUpdateRoom}
        roomTypes={roomTypes}
        floors={floors}
        buildings={buildings}
        roomStatuses={roomStatuses}
        rooms={rooms}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  )
}

export default PmsDashboard
