import React from 'react';
import { Layers } from 'lucide-react';
import FloorManagement from '../../../features/property/components/FloorManagement';
import BuildingManagement from '../../../features/property/components/BuildingManagement';
import RoomTypeManagement from '../../../features/property/components/RoomTypeManagement';
import RoomManagement from '../../../features/property/components/RoomManagement';
import RoomStatusManagement from '../../../features/property/components/RoomStatusManagement';
import PersonalDetailManagement from '../../../features/property/components/PersonalDetailManagement';
import TaxManagement from '../../../features/property/components/TaxManagement';

/**
 * DashboardRouter Component
 * 
 * Determines which management module to display based on the active sidebar item.
 * Supports: Floor, Room Type, Room, Room Status.
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
  currentPage,
  itemsPerPage,
  userRole,
  isLoading
}) => {

  switch (activeItem) {
    case 'Floor':
      return (
        <FloorManagement
          floors={floors}
          searchTerm={searchTerm}
          setIsFloorModalOpen={(isOpen) => toggleModal('floor', isOpen)}
          onEdit={(f) => { setEditFloor(f); toggleModal('floorEdit', true); }}
          onDelete={deleteFloor}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      );
    case 'Building':
      return (
        <BuildingManagement
          buildings={buildings}
          searchTerm={searchTerm}
          setIsBuildingModalOpen={(isOpen) => toggleModal('building', isOpen)}
          onEdit={(b) => { setEditBuilding(b); toggleModal('buildingEdit', true); }}
          onDelete={deleteBuilding}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      );
    case 'Room Type':
      return (
        <RoomTypeManagement
          roomTypes={roomTypes}
          setIsRoomTypeModalOpen={(isOpen) => toggleModal('roomType', isOpen)}
          onEdit={(rt) => { setEditRoomType(rt); toggleModal('roomTypeEdit', true); }}
          onDelete={deleteRoomType}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          userRole={userRole}
        />
      );
    case 'Room Status':
      return (
        <RoomStatusManagement
          roomStatuses={roomStatuses}
          setIsRoomStatusModalOpen={(isOpen) => toggleModal('roomStatus', isOpen)}
          onEdit={(rs) => { setEditRoomStatus(rs); toggleModal('roomStatusEdit', true); }}
          onDelete={deleteRoomStatus}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      );
    case 'Room':
      return (
        <RoomManagement
          rooms={rooms}
          roomTypes={allRoomTypes}
          floors={allFloors}
          buildings={allBuildings}
          searchTerm={searchTerm}
          setIsRoomModalOpen={(isOpen) => toggleModal('room', isOpen)}
          onEdit={(r) => {
            setEditRoom({
              ...r,
              buildingId: r.buildingId || r.building_id || r.building?.id || r.building || r.buildings,
              floorId: r.floorId || r.floor_id || r.floor?.id || r.floor,
              roomTypeId: r.roomTypeId || r.room_type_id || r.roomType?.id || r.roomType,
              smoking: Boolean(r.smoking || r.is_smoking || r.isSmoking),
              handicap: Boolean(r.handicap || r.is_handicap || r.isHandicap),
              nonRoom: Boolean(r.nonRoom || r.non_room || r.isNonRoom)
            });
            toggleModal('roomEdit', true);
          }}
          onDelete={deleteRoom}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
        />
      );
    case 'Tax':
      return (
        <TaxManagement
          taxes={taxes}
          setIsTaxModalOpen={(isOpen) => toggleModal('tax', isOpen)}
          onEdit={(t) => { setEditTax(t); toggleModal('taxEdit', true); }}
          onDelete={deleteTax}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      );
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
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center animate-in fade-in duration-500">
          <Layers className="w-12 h-12 mb-4 text-slate-200" />
          <h3 className="text-lg font-extrabold text-slate-400 uppercase tracking-widest">Master Module Pending</h3>
          <p className="text-xs text-slate-300 mt-2">Working on bringing the {activeItem} screen online.</p>
        </div>
      );
  }
};

export default DashboardRouter;
