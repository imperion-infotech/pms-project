import React from 'react';
import {
  FloorModal, FloorEditModal,
  BuildingModal, BuildingEditModal,
  RoomTypeModal, RoomTypeEditModal,
  RoomStatusModal, RoomStatusEditModal,
  RoomModal, RoomEditModal,
  PersonalDetailsModal,
  PersonalDetailsEditModal,
  TaxModal,
  TaxEditModal
} from '../../../components/common/Modals';

/**
 * DashboardModals - Saare Pop-ups (Modals) ki central place.
 * 
 * Is file mein saare 'Add' aur 'Edit' karne waale windows ko
 * manage kiya gaya hai. Ye file decide karti hai ki kab kon sa form khulna hai.
 */
const DashboardModals = ({
  modals,
  toggleModal,
  // Floor
  newFloor, setNewFloor, handleAddFloor,
  editFloor, setEditFloor, handleUpdateFloor,
  floors,
  // Building
  newBuilding, setNewBuilding, handleAddBuilding,
  editBuilding, setEditBuilding, handleUpdateBuilding,
  buildings,
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
  rooms,
  // Personal Detail
  personalFormData, setPersonalFormData, handlePersonalSubmit,
  handlePersonalFileUpload, uploadingType,
  // Tax
  newTax, setNewTax, handleAddTax,
  editTax, setEditTax, handleUpdateTax,
  taxes, isLoading
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

      {/* Building Modals */}
      <BuildingModal
        isBuildingModalOpen={modals.building}
        setIsBuildingModalOpen={(isOpen) => toggleModal('building', isOpen)}
        newBuilding={newBuilding} setNewBuilding={setNewBuilding}
        handleAddBuilding={handleAddBuilding} buildings={buildings}
      />
      <BuildingEditModal
        isOpen={modals.buildingEdit}
        setIsOpen={(isOpen) => toggleModal('buildingEdit', isOpen)}
        editBuilding={editBuilding} setEditBuilding={setEditBuilding}
        handleUpdateBuilding={handleUpdateBuilding} buildings={buildings}
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
        handleAddRoom={handleAddRoom} roomTypes={roomTypes} floors={floors} buildings={buildings} roomStatuses={roomStatuses} rooms={rooms}
      />
      <RoomEditModal
        isOpen={modals.roomEdit}
        setIsOpen={(isOpen) => toggleModal('roomEdit', isOpen)}
        editRoom={editRoom} setEditRoom={setEditRoom}
        handleUpdateRoom={handleUpdateRoom} roomTypes={roomTypes} floors={floors} buildings={buildings} roomStatuses={roomStatuses} rooms={rooms}
      />

      {/* Tax Modals */}
      <TaxModal
        isOpen={modals.tax}
        setIsOpen={(isOpen) => toggleModal('tax', isOpen)}
        newTax={newTax}
        setNewTax={setNewTax}
        handleAddTax={handleAddTax}
        taxes={taxes}
      />
      <TaxEditModal
        isOpen={modals.taxEdit}
        setIsOpen={(isOpen) => toggleModal('taxEdit', isOpen)}
        editTax={editTax}
        setEditTax={setEditTax}
        handleUpdateTax={handleUpdateTax}
        taxes={taxes}
      />

      {/* Personal Detail Modals */}
      <PersonalDetailsModal
        isOpen={modals.personalDetail}
        setIsOpen={(isOpen) => toggleModal('personalDetail', isOpen)}
        formData={personalFormData}
        setFormData={setPersonalFormData}
        handleSubmit={handlePersonalSubmit}
        handleFileUpload={handlePersonalFileUpload}
        uploadingType={uploadingType}
        loading={isLoading}
      />

      <PersonalDetailsEditModal
        isOpen={modals.personalDetailEdit}
        setIsOpen={(isOpen) => toggleModal('personalDetailEdit', isOpen)}
        formData={personalFormData}
        setFormData={setPersonalFormData}
        handleSubmit={handlePersonalSubmit}
        handleFileUpload={handlePersonalFileUpload}
        uploadingType={uploadingType}
        loading={isLoading}
      />

    </>
  );
};

export default DashboardModals;
