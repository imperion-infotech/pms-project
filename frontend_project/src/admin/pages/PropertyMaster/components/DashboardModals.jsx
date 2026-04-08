import React from 'react'
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
  GuestPersonalDetailsModal,
  GuestPersonalDetailsEditModal,
  TaxModal,
  TaxEditModal,
  DocumentTypeModal,
  DocumentTypeEditModal,
  PaymentTypeModal,
  PaymentTypeEditModal,
  OtherChargeModal,
  OtherChargeEditModal,
} from '../../../components/common/modals'

/**
 * DashboardModals - Saare Pop-ups (Modals) ki central place.
 */
const DashboardModals = ({
  modals,
  toggleModal,
  // Floor
  newFloor,
  setNewFloor,
  handleAddFloor,
  editFloor,
  setEditFloor,
  handleUpdateFloor,
  floors,
  // Building
  newBuilding,
  setNewBuilding,
  handleAddBuilding,
  editBuilding,
  setEditBuilding,
  handleUpdateBuilding,
  buildings,
  // Room Type
  newRoomType,
  setNewRoomType,
  handleAddRoomType,
  editRoomType,
  setEditRoomType,
  handleUpdateRoomType,
  roomTypes,
  // Room Status
  newRoomStatus,
  setNewRoomStatus,
  handleAddRoomStatus,
  editRoomStatus,
  setEditRoomStatus,
  handleUpdateRoomStatus,
  roomStatuses,
  // Room
  newRoom,
  setNewRoom,
  handleAddRoom,
  editRoom,
  setEditRoom,
  handleUpdateRoom,
  rooms,
  // Personal Detail
  personalFormData,
  setPersonalFormData,
  editPersonalFormData,
  setEditPersonalFormData,
  handlePersonalSubmitCreate,
  handlePersonalSubmitUpdate,
  handlePersonalFileUpload,
  uploadingType,
  // Tax
  taxes,
  newTax,
  setNewTax,
  handleAddTax,
  editTax,
  setEditTax,
  handleUpdateTax,
  // Document Type
  newDocumentType,
  setNewDocumentType,
  handleAddDocumentType,
  editDocumentType,
  setEditDocumentType,
  handleUpdateDocumentType,
  documentTypes,
  // Payment Type
  newPaymentType,
  setNewPaymentType,
  handleAddPaymentType,
  editPaymentType,
  setEditPaymentType,
  handleUpdatePaymentType,
  paymentTypes,
  // Other Charge
  newOtherCharge,
  setNewOtherCharge,
  handleAddOtherCharge,
  editOtherCharge,
  setEditOtherCharge,
  handleUpdateOtherCharge,
  otherCharges,
  rentDetails = [],
  isLoading,
}) => {
  return (
    <>
      {/* Floor Modals */}
      <FloorModal
        isFloorModalOpen={modals.floor}
        setIsFloorModalOpen={(isOpen) => toggleModal('floor', isOpen)}
        newFloor={newFloor}
        setNewFloor={setNewFloor}
        handleAddFloor={handleAddFloor}
        floors={floors}
      />
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
        isBuildingModalOpen={modals.building}
        setIsBuildingModalOpen={(isOpen) => toggleModal('building', isOpen)}
        newBuilding={newBuilding}
        setNewBuilding={setNewBuilding}
        handleAddBuilding={handleAddBuilding}
        buildings={buildings}
      />
      <BuildingEditModal
        isOpen={modals.buildingEdit}
        setIsOpen={(isOpen) => toggleModal('buildingEdit', isOpen)}
        editBuilding={editBuilding}
        setEditBuilding={setEditBuilding}
        handleUpdateBuilding={handleUpdateBuilding}
        buildings={buildings}
      />

      {/* Room Type Modals */}
      <RoomTypeModal
        isRoomTypeModalOpen={modals.roomType}
        setIsRoomTypeModalOpen={(isOpen) => toggleModal('roomType', isOpen)}
        newRoomType={newRoomType}
        setNewRoomType={setNewRoomType}
        handleAddRoomType={handleAddRoomType}
        roomTypes={roomTypes}
      />
      <RoomTypeEditModal
        isOpen={modals.roomTypeEdit}
        setIsOpen={(isOpen) => toggleModal('roomTypeEdit', isOpen)}
        editRoomType={editRoomType}
        setEditRoomType={setEditRoomType}
        handleUpdateRoomType={handleUpdateRoomType}
        roomTypes={roomTypes}
      />

      {/* Room Status Modals */}
      <RoomStatusModal
        isOpen={modals.roomStatus}
        setIsOpen={(isOpen) => toggleModal('roomStatus', isOpen)}
        newRoomStatus={newRoomStatus}
        setNewRoomStatus={setNewRoomStatus}
        handleAddRoomStatus={handleAddRoomStatus}
        roomStatuses={roomStatuses}
      />
      <RoomStatusEditModal
        isOpen={modals.roomStatusEdit}
        setIsOpen={(isOpen) => toggleModal('roomStatusEdit', isOpen)}
        editRoomStatus={editRoomStatus}
        setEditRoomStatus={setEditRoomStatus}
        handleUpdateRoomStatus={handleUpdateRoomStatus}
        roomStatuses={roomStatuses}
      />

      {/* Room Modals */}
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
      <GuestPersonalDetailsModal
        isOpen={modals.personalDetail}
        setIsOpen={(isOpen) => {
          toggleModal('personalDetail', isOpen)
          if (!isOpen) setPersonalFormData({ id: null, isDeleted: false })
        }}
        formData={personalFormData}
        setFormData={setPersonalFormData}
        handleSubmit={handlePersonalSubmitCreate}
        handleFileUpload={handlePersonalFileUpload}
        uploadingType={uploadingType}
        loading={isLoading}
        documentTypes={documentTypes}
        buildings={buildings}
        floors={floors}
        roomTypes={roomTypes}
        rooms={rooms}
        roomStatuses={roomStatuses}
        rentDetails={rentDetails}
        taxes={taxes}
      />

      <GuestPersonalDetailsEditModal
        isOpen={modals.personalDetailEdit}
        setIsOpen={(isOpen) => {
          toggleModal('personalDetailEdit', isOpen)
          if (!isOpen) setEditPersonalFormData({ id: null, isDeleted: false })
        }}
        formData={editPersonalFormData}
        setFormData={setEditPersonalFormData}
        handleSubmit={handlePersonalSubmitUpdate}
        handleFileUpload={handlePersonalFileUpload}
        uploadingType={uploadingType}
        loading={isLoading}
        documentTypes={documentTypes}
        buildings={buildings}
        floors={floors}
        roomTypes={roomTypes}
        rooms={rooms}
        roomStatuses={roomStatuses}
        rentDetails={rentDetails}
        taxes={taxes}
      />

      {/* Document Type Modals */}
      <DocumentTypeModal
        isOpen={modals.documentType}
        setIsOpen={(isOpen) => toggleModal('documentType', isOpen)}
        newDocType={newDocumentType}
        setNewDocType={setNewDocumentType}
        handleAdd={handleAddDocumentType}
        documentTypes={documentTypes}
      />
      <DocumentTypeEditModal
        isOpen={modals.documentTypeEdit}
        setIsOpen={(isOpen) => toggleModal('documentTypeEdit', isOpen)}
        editDocType={editDocumentType}
        setEditDocType={setEditDocumentType}
        handleUpdate={handleUpdateDocumentType}
        documentTypes={documentTypes}
      />

      {/* Payment Type Modals */}
      <PaymentTypeModal
        isOpen={modals.paymentType}
        setIsOpen={(isOpen) => toggleModal('paymentType', isOpen)}
        newPaymentType={newPaymentType}
        setNewPaymentType={setNewPaymentType}
        handleAdd={handleAddPaymentType}
        paymentTypes={paymentTypes}
      />
      <PaymentTypeEditModal
        isOpen={modals.paymentTypeEdit}
        setIsOpen={(isOpen) => toggleModal('paymentTypeEdit', isOpen)}
        editPaymentType={editPaymentType}
        setEditPaymentType={setEditPaymentType}
        handleUpdate={handleUpdatePaymentType}
        paymentTypes={paymentTypes}
      />

      {/* Other Charge Modals */}
      <OtherChargeModal
        isOpen={modals.otherCharge}
        setIsOpen={(isOpen) => toggleModal('otherCharge', isOpen)}
        newOtherCharge={newOtherCharge}
        setNewOtherCharge={setNewOtherCharge}
        handleAdd={handleAddOtherCharge}
        otherCharges={otherCharges}
      />
      <OtherChargeEditModal
        isOpen={modals.otherChargeEdit}
        setIsOpen={(isOpen) => toggleModal('otherChargeEdit', isOpen)}
        editOtherCharge={editOtherCharge}
        setEditOtherCharge={setEditOtherCharge}
        handleUpdate={handleUpdateOtherCharge}
        otherCharges={otherCharges}
      />
    </>
  )
}

export default DashboardModals
