import React from 'react';
import {
  FloorModal, FloorEditModal,
  RoomTypeModal, RoomTypeEditModal,
  RoomStatusModal, RoomStatusEditModal,
  RoomModal, RoomEditModal
} from '../../../components/common/Modals';

/**
 * DashboardModals Component
 * 
 * Container for all property management modals in the PMS Dashboard.
 * Keeps the main PmsDashboard.jsx file clean.
 */
const DashboardModals = ({
  modals,
  toggleModal,
  // Floor
  newFloor, setNewFloor, handleAddFloor,
  editFloor, setEditFloor, handleUpdateFloor,
  floors,
  // Room Type
  newRoomType, setNewRoomType, handleAddRoomType,
  editRoomType, setEditRoomType, handleUpdateRoomType,
  roomTypes,
  // Room Status
  newRoomStatus, setNewRoomStatus, handleAddRoomStatus,
  editRoomStatus, setEditRoomStatus, handleUpdateRoomStatus,
  roomStatuses,
  // Room
  newRoom, setNewRoom, handleAddRoom,
  editRoom, setEditRoom, handleUpdateRoom,
  rooms
}) => {
  return (
    <>
      {/* Floor Modals */}
      <FloorModal
        isFloorModalOpen={modals.floor}
        setIsFloorModalOpen={(isOpen) => toggleModal('floor', isOpen)}
        newFloor={newFloor} setNewFloor={setNewFloor}
        handleAddFloor={handleAddFloor} floors={floors}
      />
      <FloorEditModal
        isOpen={modals.floorEdit}
        setIsOpen={(isOpen) => toggleModal('floorEdit', isOpen)}
        editFloor={editFloor} setEditFloor={setEditFloor}
        handleUpdateFloor={handleUpdateFloor} floors={floors}
      />

      {/* Room Type Modals */}
      <RoomTypeModal
        isRoomTypeModalOpen={modals.roomType}
        setIsRoomTypeModalOpen={(isOpen) => toggleModal('roomType', isOpen)}
        newRoomType={newRoomType} setNewRoomType={setNewRoomType}
        handleAddRoomType={handleAddRoomType} roomTypes={roomTypes}
      />
      <RoomTypeEditModal
        isOpen={modals.roomTypeEdit}
        setIsOpen={(isOpen) => toggleModal('roomTypeEdit', isOpen)}
        editRoomType={editRoomType} setEditRoomType={setEditRoomType}
        handleUpdateRoomType={handleUpdateRoomType} roomTypes={roomTypes}
      />

      {/* Room Status Modals */}
      <RoomStatusModal
        isOpen={modals.roomStatus}
        setIsOpen={(isOpen) => toggleModal('roomStatus', isOpen)}
        newRoomStatus={newRoomStatus} setNewRoomStatus={setNewRoomStatus}
        handleAddRoomStatus={handleAddRoomStatus} roomStatuses={roomStatuses}
      />
      <RoomStatusEditModal
        isOpen={modals.roomStatusEdit}
        setIsOpen={(isOpen) => toggleModal('roomStatusEdit', isOpen)}
        editRoomStatus={editRoomStatus} setEditRoomStatus={setEditRoomStatus}
        handleUpdateRoomStatus={handleUpdateRoomStatus} roomStatuses={roomStatuses}
      />

      {/* Room Modals */}
      <RoomModal
        isRoomModalOpen={modals.room}
        setIsRoomModalOpen={(isOpen) => toggleModal('room', isOpen)}
        newRoom={newRoom} setNewRoom={setNewRoom}
        handleAddRoom={handleAddRoom} roomTypes={roomTypes} floors={floors} rooms={rooms}
      />
      <RoomEditModal
        isOpen={modals.roomEdit}
        setIsOpen={(isOpen) => toggleModal('roomEdit', isOpen)}
        editRoom={editRoom} setEditRoom={setEditRoom}
        handleUpdateRoom={handleUpdateRoom} roomTypes={roomTypes} floors={floors} rooms={rooms}
      />
    </>
  );
};

export default DashboardModals;
