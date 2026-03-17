// Main Dashboard file shift ho gayi hai - Page-level components
import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import PageHeader from '../../components/layout/PageHeader';
import FloorManagement from '../../features/property/components/FloorManagement';
import RoomTypeManagement from '../../features/property/components/RoomTypeManagement';
import RoomManagement from '../../features/property/components/RoomManagement';
import Pagination from '../../components/common/Pagination';
import { FloorModal, RoomTypeModal, RoomModal } from '../../components/common/Modals';

const PmsDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPropertyOpen, setIsPropertyOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Floor');
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newFloor, setNewFloor] = useState({ name: '', description: '' });
  const [newRoomType, setNewRoomType] = useState({
    shortName: '',
    name: '',
    color: '#e0e0e0',
    overBooking: 0,
    bindWith: '% 100',
    description: '',
    allowed: false
  });

  const [newRoom, setNewRoom] = useState({
    roomName: '',
    shortName: '',
    roomType: 'Standard',
    floor: 'Ground Floor',
    isSmoking: false,
    isHandicap: false,
    isNonRoom: false
  });

  const [floors, setFloors] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/data/propertyData.json');
      const data = await response.json();
      setFloors(data.floors || []);
      setRoomTypes(data.roomTypes || []);
      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Error fetching property data:", error);
    } finally {
      // Adding a small delay to make the transition feel smoother
      setTimeout(() => setIsLoading(false), 500);
    }
  };


  const handleAddFloor = (e) => {
    e.preventDefault();
    if (newFloor.name) {
      setFloors([...floors, newFloor]);
      setNewFloor({ name: '', description: '' });
      setIsFloorModalOpen(false);
    }
  };

  const handleAddRoomType = (e) => {
    e.preventDefault();
    if (newRoomType.name) {
      const id = roomTypes.length > 0 ? Math.max(...roomTypes.map(r => r.id)) + 1 : 1;
      setRoomTypes([...roomTypes, { ...newRoomType, id }]);
      setNewRoomType({ shortName: '', name: '', color: '#e0e0e0', overBooking: 0, bindWith: '% 100', description: '', allowed: false });
      setIsRoomTypeModalOpen(false);
    }
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (newRoom.roomName) {
      const id = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
      setRooms([...rooms, {
        id,
        roomName: newRoom.roomName,
        shortName: newRoom.shortName,
        roomTypeName: newRoom.roomType,
        buildingName: 'Main',
        floorName: newRoom.floor,
        smoking: newRoom.isSmoking,
        handicap: newRoom.isHandicap,
        isNonRoom: newRoom.isNonRoom
      }]);
      setNewRoom({
        roomName: '',
        shortName: '',
        roomType: 'Standard',
        floor: 'Ground Floor',
        isSmoking: false,
        isHandicap: false,
        isNonRoom: false
      });
      setIsRoomModalOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7fa] text-slate-800 font-sans overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isPropertyOpen={isPropertyOpen}
        setIsPropertyOpen={setIsPropertyOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0 h-full">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <PageHeader activeItem={activeItem} onRefresh={fetchData} isLoading={isLoading} />

        <main className="flex-1 overflow-auto bg-[#f8fafc] custom-scrollbar p-3 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-4 md:y-6">
            {activeItem === 'Floor' ? (
              <FloorManagement floors={floors} setIsFloorModalOpen={setIsFloorModalOpen} />
            ) : activeItem === 'Room Type' ? (
              <RoomTypeManagement roomTypes={roomTypes} setIsRoomTypeModalOpen={setIsRoomTypeModalOpen} />
            ) : activeItem === 'Room' ? (
              <RoomManagement rooms={rooms} setIsRoomModalOpen={setIsRoomModalOpen} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[500px] bg-white rounded-2xl border border-dashed border-slate-300 animate-pulse p-4 text-center">
                <Layers className="w-12 h-12 md:w-20 md:h-20 mb-4 text-slate-200" />
                <h3 className="text-lg md:text-xl font-extrabold text-slate-400 uppercase tracking-widest leading-tight">Master Module Pending</h3>
                <p className="text-xs md:text-sm text-slate-300 mt-2">Working on bringing the {activeItem} screen online.</p>
              </div>
            )}

            {(activeItem === 'Floor' || activeItem === 'Room Type' || activeItem === 'Room') && (
              <Pagination activeItem={activeItem} floors={floors} roomTypes={roomTypes} rooms={rooms} isLoading={isLoading} />
            )}
          </div>
        </main>
      </div>

      <FloorModal
        isFloorModalOpen={isFloorModalOpen}
        setIsFloorModalOpen={setIsFloorModalOpen}
        newFloor={newFloor}
        setNewFloor={setNewFloor}
        handleAddFloor={handleAddFloor}
      />

      <RoomTypeModal
        isRoomTypeModalOpen={isRoomTypeModalOpen}
        setIsRoomTypeModalOpen={setIsRoomTypeModalOpen}
        newRoomType={newRoomType}
        setNewRoomType={setNewRoomType}
        handleAddRoomType={handleAddRoomType}
      />

      <RoomModal
        isRoomModalOpen={isRoomModalOpen}
        setIsRoomModalOpen={setIsRoomModalOpen}
        newRoom={newRoom}
        setNewRoom={setNewRoom}
        handleAddRoom={handleAddRoom}
        roomTypes={roomTypes}
        floors={floors}
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
  );
};

export default PmsDashboard;
