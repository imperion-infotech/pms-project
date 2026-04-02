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
  setEditFloor,
  setEditBuilding,
  setEditRoomType,
  setEditRoomStatus,
  setEditRoom,
  deleteFloor,
  deleteBuilding,
  deleteRoomType,
  deleteRoomStatus,
  deleteRoom,
  personalDetails,
  onAddPersonalDetail,
  onEditPersonalDetail,
  onDeletePersonalDetail,
  taxes,
  setEditTax,
  deleteTax,
  documentTypes,
  setEditDocumentType,
  deleteDocumentType,
  currentPage,
  itemsPerPage,
  userRole,
  isLoading,
}) => {
  switch (activeItem) {
    case 'Floor':
      return (
        <FloorManagement
          floors={floors}
          searchTerm={searchTerm}
          setIsFloorModalOpen={(isOpen) => toggleModal('floor', isOpen)}
          onEdit={(f) => {
            setEditFloor(f)
            toggleModal('floorEdit', true)
          }}
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
          onEdit={(b) => {
            setEditBuilding(b)
            toggleModal('buildingEdit', true)
          }}
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
          onEdit={(rt) => {
            setEditRoomType(rt)
            toggleModal('roomTypeEdit', true)
          }}
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
          onEdit={(rs) => {
            setEditRoomStatus(rs)
            toggleModal('roomStatusEdit', true)
          }}
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
          onEdit={(r) => {
            // Robust lookup for IDs supporting multiple backend naming conventions
            const rTypeId = r.roomTypeId || r.room_type_id || r.roomType?.id || r.roomType
            const rStatusId =
              r.roomStatusTableId ||
              r.room_status_table_id ||
              r.roomStatusTable?.id ||
              r.room_status_table?.id

            // If IDs are missing, attempt lookup by name strings
            const finalTypeId =
              rTypeId ||
              allRoomTypes.find(
                (rt) =>
                  (rt.roomTypeName || rt.shortName) === r.roomType ||
                  (rt.roomTypeName || rt.shortName) === r.roomTypeName,
              )?.id
            const finalStatusId =
              rStatusId ||
              allRoomStatuses.find(
                (rs) =>
                  (rs.roomStatusName || rs.roomStatusTitle) === r.roomStatus ||
                  (rs.roomStatusName || rs.roomStatusTitle) === r.roomStatusName,
              )?.id

            setEditRoom({
              ...r,
              buildingId:
                r.buildingId || r.building_id || r.building?.id || r.building || r.buildings || '',
              floorId: r.floorId || r.floor_id || r.floor?.id || r.floor || '',
              roomTypeId: finalTypeId || '',
              roomStatusTableId: finalStatusId || '',
              smoking: Boolean(r.smoking || r.is_smoking || r.isSmoking),
              handicap: Boolean(r.handicap || r.is_handicap || r.isHandicap),
              nonRoom: Boolean(r.nonRoom || r.non_room || r.isNonRoom),
            })
            toggleModal('roomEdit', true)
          }}
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
          onEdit={(t) => {
            setEditTax(t)
            toggleModal('taxEdit', true)
          }}
          onDelete={deleteTax}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )
    case 'Personal Detail':
      return (
        <PersonalDetailManagement
          details={personalDetails}
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
          onEdit={(dt) => {
            setEditDocumentType(dt)
            toggleModal('documentTypeEdit', true)
          }}
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
