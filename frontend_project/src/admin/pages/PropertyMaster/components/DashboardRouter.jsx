import React from 'react';
import { Layers } from 'lucide-react';
import FloorManagement from '../../../features/property/components/FloorManagement';
import RoomTypeManagement from '../../../features/property/components/RoomTypeManagement';
import RoomManagement from '../../../features/property/components/RoomManagement';
import RoomStatusManagement from '../../../features/property/components/RoomStatusManagement';

/**
 * DashboardRouter Component
 * 
 * Determines which management module to display based on the active sidebar item.
 * Supports: Floor, Room Type, Room, Room Status.
 */
const DashboardRouter = ({
  activeItem,
  floors,
  roomTypes,
  roomStatuses,
  rooms,
  toggleModal,
  setEditFloor,
  setEditRoomType,
  setEditRoomStatus,
  setEditRoom,
  deleteFloor,
  deleteRoomType,
  deleteRoomStatus,
  deleteRoom
}) => {

  switch (activeItem) {
    case 'Floor':
      return (
        <FloorManagement
          floors={floors}
          setIsFloorModalOpen={(isOpen) => toggleModal('floor', isOpen)}
          onEdit={(f) => { setEditFloor(f); toggleModal('floorEdit', true); }}
          onDelete={deleteFloor}
        />
      );
    case 'Room Type':
      return (
        <RoomTypeManagement
          roomTypes={roomTypes}
          setIsRoomTypeModalOpen={(isOpen) => toggleModal('roomType', isOpen)}
          onEdit={(rt) => { setEditRoomType(rt); toggleModal('roomTypeEdit', true); }}
          onDelete={deleteRoomType}
        />
      );
    case 'Room Status':
      return (
        <RoomStatusManagement
          roomStatuses={roomStatuses}
          setIsRoomStatusModalOpen={(isOpen) => toggleModal('roomStatus', isOpen)}
          onEdit={(rs) => { setEditRoomStatus(rs); toggleModal('roomStatusEdit', true); }}
          onDelete={deleteRoomStatus}
        />
      );
    case 'Room':
      return (
        <RoomManagement
          rooms={rooms}
          roomTypes={roomTypes}
          floors={floors}
          setIsRoomModalOpen={(isOpen) => toggleModal('room', isOpen)}
          onEdit={(r) => { setEditRoom(r); toggleModal('roomEdit', true); }}
          onDelete={deleteRoom}
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
