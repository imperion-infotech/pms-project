import React, { useEffect } from 'react';
import { PlusCircle, Search, Cigarette, CigaretteOff, Accessibility, Check, Minus, Ban, Pencil, Trash2 } from 'lucide-react';

const RoomManagement = ({
  rooms = [],
  roomTypes = [],
  floors = [],
  buildings = [],
  searchTerm = '',
  setSearchTerm = () => { },
  setIsRoomModalOpen = () => { },
  onEdit = () => { },
  onDelete = () => { },
  currentPage = 1,
  itemsPerPage = 8
}) => {

  // Debug effect to show all fetched data in console
  useEffect(() => {
    console.group("--- ROOM MANAGEMENT API DATA ---");
    console.log("Current Rooms:", rooms);
    console.log("Current Buildings:", buildings);
    console.log("Current Floors:", floors);
    console.log("Current Room Types:", roomTypes);
    console.groupEnd();
  }, [rooms, buildings, floors, roomTypes]);

  // Helper to get name from ID if the API doesn't provide the joined name
  const getRoomTypeName = (room) => {
    if (room.roomTypeName) return room.roomTypeName;
    const roomTypeId = room.roomTypeId || room.roomType?.id || room.roomType;
    if (!roomTypeId) return 'Standard';
    const type = roomTypes.find(rt => String(rt.id) === String(roomTypeId));
    return type ? type.roomTypeName : 'Standard';
  };

  console.log("RogetRoomTypeName", getRoomTypeName());

  const getFloorName = (room) => {
    if (room.floorName) return room.floorName;
    const floorId = room.floorId || room.floor?.id || room.floor;
    if (!floorId) return 'N/A';
    const floor = floors.find(f => String(f.id) === String(floorId));
    return floor ? floor.name : 'N/A';
  };

  console.log("RogetFloorName", getFloorName());

  const getBuildingName = (room) => {
    if (!room) return 'Unknown';
    // Deep lookup for building name or ID
    if (room.buildingName) return room.buildingName;
    if (room.building?.name) return room.building.name;

    const buildingId = room.buildingId || room.building?.id || room.building;
    if (!buildingId) return 'Unknown';

    const building = buildings.find(b => String(b.id) === String(buildingId));
    return building ? building.name : 'Unknown';
  };

  console.log("RogetBuildingName", getBuildingName());

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-800 overflow-hidden transition-all duration-300">
      {/* Header & Search Section */}
      <div className="p-5 md:p-7 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
            Rooms
            <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-black rounded-full tracking-widest">
              Live Data
            </span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">Manage and organize physical property rooms</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => setIsRoomModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/25"
          >
            <PlusCircle className="w-5 h-5" />
            ADD NEW ROOM
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-5">No.</th>
              <th className="px-6 py-5">Room Name</th>
              <th className="px-6 py-5">Building Name</th>
              <th className="px-6 py-5">Room Type Name</th>
              <th className="px-6 py-5">Floor Name</th>
              <th className="px-4 py-5 text-center text-orange-600 dark:text-orange-500">Smoking</th>
              <th className="px-4 py-5 text-center text-blue-600 dark:text-blue-500">Handicap</th>
              <th className="px-4 py-5 text-center text-red-600 dark:text-red-500">Non-room</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {rooms.length > 0 ? (
              rooms.map((room, idx) => (
                <tr key={room.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors h-16 group">
                  <td className="px-6 py-3 font-bold text-slate-400 dark:text-slate-600 font-mono text-xs">
                    {((currentPage - 1) * itemsPerPage) + idx + 1}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{room.roomName}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: {room.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="font-medium text-slate-600 dark:text-slate-400 text-sm">
                      {getBuildingName(room)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold">
                      {getRoomTypeName(room)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      {getFloorName(room)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      {room.smoking ?
                        <Cigarette className="w-5 h-5 text-orange-500 opacity-90" /> :
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      {room.handicap ?
                        <Accessibility className="w-5 h-5 text-blue-500 opacity-90" /> :
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      {room.nonRoom ?
                        <Ban className="w-5 h-5 text-red-400 opacity-90" /> :
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      }
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(room)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl text-blue-500 transition-all active:scale-90"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(room.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-red-500 transition-all active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">No rooms found matching your criteria.</p>
                    <p className="text-xs opacity-60">Try adjusting your search or add a new room.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomManagement;
