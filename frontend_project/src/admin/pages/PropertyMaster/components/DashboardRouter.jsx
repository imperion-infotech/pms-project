import React from 'react'
import { Layers } from 'lucide-react'
import FloorManagement from '../../../features/property/components/FloorManagement'
import BuildingManagement from '../../../features/property/components/BuildingManagement'
import RoomTypeManagement from '../../../features/property/components/RoomTypeManagement'
import RoomManagement from '../../../features/property/components/RoomManagement'
import RoomStatusManagement from '../../../features/property/components/RoomStatusManagement'
import PersonalDetailManagement from '../../../features/property/components/PersonalDetailManagement'
import TaxManagement from '../../../features/property/components/TaxManagement'
import DocumentTypeManagement from '../../../features/property/components/DocumentTypeManagement'

/**
 * DashboardRouter - Ye file 'Traffic Inspector' ka kaam karti hai.
 *
 * Sidebar se jo bhi select hota hai (Room, Floor, etc.), ye file
 * decide karti hai ki screen par kon sa table ya management module dikhana hai.
 */
const DashboardRouter = ({
  activeItem,
  floors,
  buildings,
  roomTypes,
  roomStatuses,
  rooms,
  allFloors,
  allBuildings,
  allRoomTypes,
  allRoomStatuses,
  searchTerm,
  toggleModal,
  handleEditFloor,
  handleEditBuilding,
  handleEditRoomType,
  handleEditRoomStatus,
  handleEditRoom,
  deleteFloor,
  deleteBuilding,
  deleteRoomType,
  deleteRoomStatus,
  deleteRoom,
  personalDetails,
  onAddPersonalDetail,
  onEditPersonalDetail,
  onDeletePersonalDetail,
  documentDetails,
  stayDetails,
  guestDetails, // New
  taxes,
  handleEditTax,
  deleteTax,
  documentTypes,
  handleEditDocumentType,
  deleteDocumentType,
  currentPage,
  itemsPerPage,
  userRole,
  isLoading,
}) => {
  switch (activeItem) {
    /* ... skipping other cases ... */
    case 'Floor':
      return (
        <FloorManagement
          floors={floors}
          searchTerm={searchTerm}
          setIsFloorModalOpen={(isOpen) => toggleModal('floor', isOpen)}
          onEdit={handleEditFloor}
          onDelete={deleteFloor}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )
    case 'Building':
      return (
        <BuildingManagement
          buildings={buildings}
          searchTerm={searchTerm}
          setIsBuildingModalOpen={(isOpen) => toggleModal('building', isOpen)}
          onEdit={handleEditBuilding}
          onDelete={deleteBuilding}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )
    case 'Room Type':
      return (
        <RoomTypeManagement
          roomTypes={roomTypes}
          setIsRoomTypeModalOpen={(isOpen) => toggleModal('roomType', isOpen)}
          onEdit={handleEditRoomType}
          onDelete={deleteRoomType}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          userRole={userRole}
        />
      )
    case 'Room Status':
      return (
        <RoomStatusManagement
          roomStatuses={roomStatuses}
          setIsRoomStatusModalOpen={(isOpen) => toggleModal('roomStatus', isOpen)}
          onEdit={handleEditRoomStatus}
          onDelete={deleteRoomStatus}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )
    case 'Room':
      return (
        <RoomManagement
          rooms={rooms}
          roomTypes={allRoomTypes}
          floors={allFloors}
          buildings={allBuildings}
          roomStatuses={allRoomStatuses}
          searchTerm={searchTerm}
          setIsRoomModalOpen={(isOpen) => toggleModal('room', isOpen)}
          onEdit={(r) => handleEditRoom(r, allRoomTypes, allRoomStatuses)}
          onDelete={deleteRoom}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
        />
      )
    case 'Tax':
      return (
        <TaxManagement
          taxes={taxes}
          setIsTaxModalOpen={(isOpen) => toggleModal('tax', isOpen)}
          onEdit={handleEditTax}
          onDelete={deleteTax}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )
      case 'Personal Detail':
      return (
        <PersonalDetailManagement
          details={personalDetails}
          documentDetails={documentDetails}
          stayDetails={stayDetails}
          guestDetails={guestDetails} // New
          documentTypes={documentTypes}
          searchTerm={searchTerm}
          onAdd={onAddPersonalDetail}
          onEdit={onEditPersonalDetail}
          onDelete={onDeletePersonalDetail}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )
    case 'Document Type':
      return (
        <DocumentTypeManagement
          documentTypes={documentTypes}
          searchTerm={searchTerm}
          setIsDocumentTypeModalOpen={(isOpen) => toggleModal('documentType', isOpen)}
          onEdit={handleEditDocumentType}
          onDelete={deleteDocumentType}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )
    default:
      return (
        <div className="animate-in fade-in flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center duration-500 dark:border-slate-700 dark:bg-slate-900">
          <Layers className="mb-4 h-12 w-12 text-slate-200" />
          <h3 className="text-lg font-extrabold tracking-widest text-slate-400 uppercase">
            Master Module Pending
          </h3>
          <p className="mt-2 text-xs text-slate-300">
            Working on bringing the {activeItem} screen online.
          </p>
        </div>
      )
  }
}

export default DashboardRouter
