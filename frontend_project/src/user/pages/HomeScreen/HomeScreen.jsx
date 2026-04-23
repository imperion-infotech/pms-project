/**
 * HomeScreen.jsx - Independent User Room View
 *
 * Purpose:
 * This component provides an independent, simplified view of the property's
 * real-time room status. It is designed for non-admin users to quickly
 * check room availability and perform basic guest management.
 *
 * Key Features:
 * 1. Live synchronization with the property master database.
 * 2. Visual room status (Color-coded based on backend statuses).
 * 3. Grouped room viewing (Rooms are automatically sorted into their respective Floors).
 * 4. Guest Action Modal: Allows adding/editing guest details directly from the room view.
 */
import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BedDouble, AlertCircle } from 'lucide-react'
import usePmsData from '../../../hooks/usePmsData'
import { useTheme } from '../../../context/ThemeContext'
import { useSidebar } from '../../../context/SidebarContext'
import LoadingProcess from '../../../components/common/LoadingProcess'
import { RoomCardSkeleton } from '../../../components/common/Skeleton' // Industrial Skeletons

// Layout & UI Components
import UserSidebar from '../../components/layout/UserSidebar'
import UserNavbar from '../../components/layout/UserNavbar'
import UserPageHeader from '../../components/layout/UserPageHeader'
import FloorSection from './components/FloorSection'
import GuestProfileModal from './components/GuestProfileModal'
import ContextMenu from './components/ContextMenu'

// Calendar Components
import PropertyMasterCalendar from '../../components/calendar/PropertyMasterCalendar'

const HomeScreen = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useTheme()
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()

  // Custom hook to fetch all property data at once
  const dataExports = usePmsData()
  const {
    rooms: rawRooms,
    floors: allFloors,
    personalDetails,
    buildings,
    roomTypes,
    roomStatuses,
    isLoading,
    error,
    fetchData: refreshData,
    updateRoom, // Destructure updateRoom directly
  } = dataExports

  // Component local states
  const [selectedFloor, setSelectedFloor] = useState(location.state?.initialFloor || 'All')
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [selectedRoomAction, setSelectedRoomAction] = useState(null)
  const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false)

  // Context Menu State
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, room: null })

  const handleRoomUpdate = useCallback(
    async (roomId, statusId) => {
      // Find the original raw room data to ensure we send all required fields (avoiding 400 error)
      const originalRoom = rawRooms.find((r) => String(r.id) === String(roomId))
      if (!originalRoom) return

      try {
        const payload = {
          ...originalRoom,
          roomStatusTableId: statusId,
          roomStatusId: statusId, // Sync both ID fields to ensure UI mapping works reliably
        }
        await updateRoom(roomId, payload)
      } catch (err) {
        console.error('Failed to update room status:', err)
      }
    },
    [updateRoom, rawRooms],
  )

  const handleContextMenu = useCallback((e, room) => {
    e.preventDefault()
    const x = e.clientX
    const y = e.clientY

    setContextMenu({ visible: true, x, y, room })
  }, [])

  /**
   * mappedData (useMemo Optimization)
   * We calculate room relationships once per data update.
   * This links rooms to their specific Floor names, Type names, and Status colors.
   */
  const mappedData = useMemo(() => {
    if (!rawRooms.length)
      return { mappedRooms: [], roomsByFloor: {}, stats: { occupied: 0, available: 0 } }

    const mapped = rawRooms.map((r) => {
      const floorObj = allFloors.find((f) => String(f.id) === String(r.floorId))
      const typeObj = roomTypes.find((t) => String(t.id) === String(r.roomTypeId))
      const statusObj = roomStatuses.find(
        (s) => String(s.id) === String(r.roomStatusTableId || r.roomStatusId),
      )

      // Industrial Mapping: Link guest personal details to the room
      const profile = personalDetails.find((p) => {
        const matchById = r.personalDetailId && String(p.id) === String(r.personalDetailId)
        const matchByRoomId = p.roomId && String(p.roomId) === String(r.id)

        // Name matching as fallback
        const pRoomName = String(p.roomName || p.roomname || '')
          .trim()
          .toLowerCase()
          .replace(/[^0-9]/g, '')
        const rRoomName = String(r.roomName || r.roomname || r.name || '')
          .trim()
          .toLowerCase()
          .replace(/[^0-9]/g, '')
        const matchByName = pRoomName !== '' && pRoomName === rRoomName

        return matchById || matchByRoomId || matchByName
      })

      const displayProfile = profile || null

      return {
        ...r,
        shortName: typeObj?.shortName || r.shortName || 'STD',
        roomTypeName: typeObj?.roomTypeName || r.roomTypeName || 'Standard',
        floorName: floorObj?.name || 'Unknown',
        statusDetails: statusObj || { roomStatusName: 'Unknown', roomStatusColor: '#cbd5e1' },
        profile: displayProfile,
        // Proactively spread profile names for the RoomCard display
        firstName: displayProfile?.firstName || r.firstName,
        lastName: displayProfile?.lastName || r.lastName,
        guestName: displayProfile
          ? `${displayProfile.firstName} ${displayProfile.lastName}`
          : r.guestName,
      }
    })
    console.log('------------------Mapped Data----------------:', mapped)

    // Calculate quick stats for the header
    const occupied = mapped.filter((r) => r.guestName).length
    console.log('--------------Occupied---------', occupied)
    const available = mapped.length - occupied - mapped.filter((r) => r.nonRoom).length
    console.log('--------------Available---------', available)

    // Grouping: Convert flat flat array into Floor-based groups for the grid
    const grouped = {}
    allFloors.forEach((f) => {
      grouped[f.name] = mapped.filter((r) => r.floorName === f.name)
    })

    return { mappedRooms: mapped, roomsByFloor: grouped, stats: { occupied, available } }
  }, [rawRooms, allFloors, roomTypes, roomStatuses, personalDetails])

  const { roomsByFloor, stats } = mappedData

  const handleRoomClick = useCallback((room) => {
    // Industrial logic: If room is Vacant & Ready, prioritize opening the Profile form
    const isReady = room.statusDetails?.roomStatusName?.toLowerCase().includes('vacant ready')
    console.log('--------------Vacant Ready---------', isReady)
    const isVacant = room.statusDetails?.roomStatusName?.toLowerCase().includes('vacant ready')
    console.log('--------------Vacant Ready---------', isVacant)

    if (isReady && isVacant) {
      setSelectedRoomAction(room)
      setIsActionModalOpen(true)
    } else {
      // For occupied rooms, you can still open the profile or a different modal
      setSelectedRoomAction(room)
      setIsActionModalOpen(true)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans transition-colors duration-300 dark:bg-slate-950">
      {/* 1. Mobile Sidebar Navigation */}
      <UserSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        roomsByFloor={roomsByFloor}
        allFloors={allFloors}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
        buildings={buildings}
        roomTypes={roomTypes}
        roomStatuses={roomStatuses}
        onOpenCalendar={() => setIsFullCalendarOpen(true)}
      />

      <LoadingProcess isLoading={isLoading} barOnly={true} />

      <div className="relative flex h-screen flex-1 flex-col overflow-hidden">
        <UserNavbar />

        {/* 2. Page Dynamic Breadcrumb & Stats Layer */}
        <UserPageHeader
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          allFloors={allFloors}
          totalRooms={rawRooms.length}
          totalFloors={allFloors.length}
          availableRooms={stats.available}
          occupiedRooms={stats.occupied}
          onRefresh={refreshData}
          isLoading={isLoading}
        />

        {/* 3. Main Data Visualization Grid */}
        <main className="custom-scrollbar relative flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc] dark:bg-slate-950">
          <div className="mx-auto max-w-[1900px] px-4 py-8">
            {/* Industrial Skeleton View - Jab data fetch hota hai */}
            {isLoading && (
              <div className="space-y-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-6">
                    <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <RoomCardSkeleton repeat={15} />
                  </div>
                ))}
              </div>
            )}

            {/* ERROR HANDLING UI */}
            {!isLoading && error && (
              <div className="animate-in zoom-in-95 mx-auto mt-20 max-w-md rounded-[40px] border border-red-200 bg-white p-8 text-center dark:bg-red-950/20">
                <AlertCircle size={32} className="mx-auto mb-6 text-red-500" />
                <h3 className="mb-3 text-xl font-black text-slate-900 uppercase dark:text-red-400">
                  Sync Failed
                </h3>
                <p className="mb-8 text-sm text-slate-500">
                  {`${error?.response?.data?.message || error?.message || 'Connection Error: Please check your backend connection.'}`}
                </p>
                <button
                  onClick={refreshData}
                  className="w-full rounded-2xl bg-red-500 py-4 font-black tracking-widest text-white uppercase shadow-lg active:scale-95"
                >
                  Retry
                </button>
              </div>
            )}

            {/* NO DATA UI */}
            {!isLoading && !error && Object.keys(roomsByFloor).length === 0 && (
              <div className="mx-auto mt-20 max-w-lg rounded-[50px] border-2 border-dashed border-slate-200 p-12 text-center">
                <BedDouble size={40} className="mx-auto mb-8 text-slate-300" />
                <h2 className="mb-4 text-2xl font-black text-slate-900 uppercase dark:text-white">
                  Property is Empty
                </h2>
                <button
                  onClick={() => navigate('/')}
                  className="rounded-2xl bg-emerald-500 px-10 py-4 font-black text-white"
                >
                  Configure PMS
                </button>
              </div>
            )}

            {/* THE FLOOR GRID: Optimized rendering by floor groups */}
            {!isLoading &&
              !error &&
              Object.entries(roomsByFloor)
                .filter(([floorName]) => selectedFloor === 'All' || selectedFloor === floorName)
                .map(([floorName, rooms]) => (
                  <FloorSection
                    key={floorName}
                    floorName={floorName}
                    rooms={rooms}
                    isDark={isDark}
                    onRoomClick={handleRoomClick}
                    onContextMenu={handleContextMenu}
                  />
                ))}

            {/* Context Menu Overlay */}
            {contextMenu.visible && (
              <ContextMenu
                {...contextMenu}
                onClose={() => setContextMenu({ ...contextMenu, visible: false })}
                onStatusUpdate={handleRoomUpdate}
                roomStatuses={roomStatuses}
              />
            )}
          </div>
        </main>
      </div>

      {/* 4. Guest Detail Interaction Modal */}
      <GuestProfileModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        room={selectedRoomAction}
        isDark={isDark}
        onRefresh={refreshData}
      />

      {/* 5. Full Screen Interactive Calendar */}
      <AnimatePresence>
        {isFullCalendarOpen && (
          <PropertyMasterCalendar onClose={() => setIsFullCalendarOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomeScreen
