import React, { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from '../../components/layout/Navbar'
import { propertyService } from '../../../services/propertyService'
import PageHeader from '../../components/layout/PageHeader'
import Pagination from '../../components/common/Pagination'
import LoadingProcess from '../../../components/common/LoadingProcess'

// Contexts & Hooks
import usePmsData from '../../../hooks/usePmsData'
import { useTheme } from '../../../context/ThemeContext'
import { useSidebar } from '../../../context/SidebarContext'

// Sub-components (Refactored for maintainability)
import DashboardRouter from './components/DashboardRouter'
import DashboardModals from './components/DashboardModals'

// Logic hooks (Encapsulated module-level state)
import { useBuildingManagement } from '../../features/property/hooks/useBuildingManagement'
import { useFloorManagement } from '../../features/property/hooks/useFloorManagement'
import { useRoomTypeManagement } from '../../features/property/hooks/useRoomTypeManagement'
import { useRoomStatusManagement } from '../../features/property/hooks/useRoomStatusManagement'
import { useRoomManagement } from '../../features/property/hooks/useRoomManagement'
import { useTaxManagement } from '../../features/property/hooks/useTaxManagement'
import { usePersonalDetailManagement } from '../../features/property/hooks/usePersonalDetailManagement'
import { useDocumentTypeManagement } from '../../features/property/hooks/useDocumentTypeManagement'

/**
 * PmsDashboard (Admin Dashboard Root)
 *
 * Ye file Admin Dashboard ka main structure hai.
 * Iska kaam hai poore dashboard ka Layout (Sidebar, Navbar) dikhana
 * aur alag-alag modules (Room, Floor, etc.) ko manage karna.
 */
const PmsDashboard = () => {
  const { isDark } = useTheme()
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()

  // User Role Detection for permissions
  const [userRole] = useState(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return 'ROLE_USER'
    try {
      const payload = JSON.parse(atob(token.trim().replace(/^"|"$/g, '').split('.')[1]))
      return (
        payload.role ||
        (Array.isArray(payload.roles) ? payload.roles[0] : payload.roles) ||
        (Array.isArray(payload.authorities)
          ? payload.authorities[0]?.authority || payload.authorities[0]
          : payload.authorities) ||
        localStorage.getItem('user_role') ||
        'ROLE_USER'
      )
    } catch {
      return localStorage.getItem('user_role') || 'ROLE_ADMIN'
    }
  })

  // Centralized data fetching hook
  const {
    floors,
    buildings,
    roomTypes,
    roomStatuses,
    rooms,
    isLoading,
    fetchData,
    addFloor,
    updateFloor,
    deleteFloor,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    addRoomType,
    updateRoomType,
    deleteRoomType,
    addRoomStatus,
    updateRoomStatus: hookUpdateRoomStatus,
    deleteRoomStatus,
    addRoom,
    updateRoom: hookUpdateRoom,
    deleteRoom,
    taxes,
    addTax,
    updateTax,
    deleteTax,
    personalDetails,
    addPersonalDetail,
    updatePersonalDetail,
    deletePersonalDetail,
    documentTypes,
    addDocumentType,
    updateDocumentType,
    deleteDocumentType,
    addDocumentDetail,
    updateDocumentDetail,
    documentDetails,
    stayDetails,
    addStayDetail,
    updateStayDetail,
    deleteStayDetail,
    searchRooms,
    searchFloors,
    searchBuildings,
    searchRoomTypes,
    searchRoomStatuses,
    searchDocumentTypes,
  } = usePmsData()

  // Dashboard navigation state
  const [activeItem, setActiveItem] = useState('Building')
  const [isPropertyOpen, setIsPropertyOpen] = useState(true)

  // Grouped modal visibility states
  const [modals, setModals] = useState({
    floor: false,
    floorEdit: false,
    building: false,
    buildingEdit: false,
    roomType: false,
    roomTypeEdit: false,
    roomStatus: false,
    roomStatusEdit: false,
    room: false,
    roomEdit: false,
    personalDetail: false,
    personalDetailEdit: false,
    tax: false,
    taxEdit: false,
    documentType: false,
    documentTypeEdit: false,
  })

  const toggleModal = React.useCallback((modalName, isOpen) => {
    setModals((prev) => ({ ...prev, [modalName]: isOpen }))
  }, [])

  // Module Logic Hooks
  const {
    newBuilding,
    setNewBuilding,
    editBuilding,
    setEditBuilding,
    handleAddBuilding,
    handleUpdateBuilding,
    handleEditBuilding,
  } = useBuildingManagement({ addBuilding, updateBuilding, toggleModal })

  const {
    newFloor,
    setNewFloor,
    editFloor,
    setEditFloor,
    handleAddFloor,
    handleUpdateFloor,
    handleEditFloor,
  } = useFloorManagement({ addFloor, updateFloor, toggleModal })

  const {
    newRoomType,
    setNewRoomType,
    editRoomType,
    setEditRoomType,
    handleAddRoomType,
    handleUpdateRoomType,
    handleEditRoomType,
  } = useRoomTypeManagement({ addRoomType, updateRoomType, toggleModal })

  const {
    newRoomStatus,
    setNewRoomStatus,
    editRoomStatus,
    setEditRoomStatus,
    handleAddRoomStatus,
    handleUpdateRoomStatus,
    handleEditRoomStatus,
  } = useRoomStatusManagement({ 
    addRoomStatus, 
    updateRoomStatus: hookUpdateRoomStatus, 
    toggleModal 
  })

  const {
    newRoom,
    setNewRoom,
    editRoom,
    setEditRoom,
    handleAddRoom,
    handleUpdateRoom,
    handleEditRoom,
  } = useRoomManagement({
    floors,
    roomTypes,
    roomStatuses,
    addRoom,
    updateRoom: hookUpdateRoom,
    toggleModal,
  })

  const {
    newTax,
    setNewTax,
    editTax,
    setEditTax,
    handleAddTax,
    handleUpdateTax,
    handleEditTax,
  } = useTaxManagement({ addTax, updateTax, toggleModal })

  const {
    newDocumentType,
    setNewDocumentType,
    editDocumentType,
    setEditDocumentType,
    handleAddDocumentType,
    handleUpdateDocumentType,
    handleEditDocumentType,
  } = useDocumentTypeManagement({ addDocumentType, updateDocumentType, toggleModal })

  const {
    personalFormData,
    setPersonalFormData,
    editPersonalFormData,
    setEditPersonalFormData,
    handleAddPersonalDetail,
    handleUpdatePersonalDetail,
    handleEditPersonalDetail,
  } = usePersonalDetailManagement({
    addPersonalDetail,
    updatePersonalDetail,
    addDocumentDetail,
    updateDocumentDetail,
    addStayDetail,
    updateStayDetail,
    toggleModal,
  })

  const [uploadingType, setUploadingType] = useState(null)

  /**
   * EVENT HANDLERS - Property Management Actions
   */
  const handlePersonalSubmit = async (e) => {
    e.preventDefault()
    // Determine which action to take based on whether we have an ID in edit state
    if (editPersonalFormData && editPersonalFormData.id) {
      handleUpdatePersonalDetail()
    } else {
      handleAddPersonalDetail()
    }
  }

  const handlePersonalFileUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingType(type)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await propertyService.uploadImage(uploadFormData)
      const responseData = response.data.fileName || response.data

      // Industrial cleanup: Extract only the path/filename if the response includes a success message
      let fileName = responseData
      if (typeof responseData === 'string' && responseData.includes(': ')) {
        fileName = responseData.split(': ')[1].trim()
      }

      let fieldName = type
      if (type === 'photo') fieldName = 'profilePhoto'
      if (type === 'signature') fieldName = 'signature'
      if (type === 'front') fieldName = 'frontImagePath'
      if (type === 'back') fieldName = 'backImagePath'

      if (modals.personalDetail) {
        setPersonalFormData((prev) => ({
          ...prev,
          [fieldName]: fileName,
        }))
      } else if (modals.personalDetailEdit) {
        setEditPersonalFormData((prev) => ({
          ...prev,
          [fieldName]: fileName,
        }))
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploadingType(null)
    }
  }

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const [searchTerm, setSearchTerm] = useState('')

  // Reset page when switching tabs or searching
  React.useEffect(() => {
    setCurrentPage(1)
  }, [activeItem, searchTerm])

  // Global Server-side Search implementation
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        switch (activeItem) {
          case 'Building':
            searchBuildings(searchTerm)
            break
          case 'Floor':
            searchFloors(searchTerm)
            break
          case 'Room Type':
            searchRoomTypes(searchTerm)
            break
          case 'Room':
            searchRooms(searchTerm)
            break
          case 'Room Status':
            searchRoomStatuses(searchTerm)
            break
          case 'Document Type':
            searchDocumentTypes(searchTerm)
            break
          default:
            break
        }
      } else {
        // Reset to full list if search is cleared
        fetchData()
      }
    }, 600) // 600ms debounce

    return () => clearTimeout(delayDebounce)
  }, [
    searchTerm,
    activeItem,
    fetchData,
    searchBuildings,
    searchFloors,
    searchRoomStatuses,
    searchRoomTypes,
    searchRooms,
    searchDocumentTypes,
  ])

  // Industrial Standard Performance Optimization: UseMemo for filtering
  const filteredData = React.useMemo(() => {
    const filter = (data) => {
      if (!Array.isArray(data)) return []
      if (!searchTerm) return data
      const lowerSearch = searchTerm.toLowerCase()
      return data.filter((item) => {
        const m = (val) => val && String(val).toLowerCase().includes(lowerSearch)
        return (
          m(item.roomName) ||
          m(item.name) ||
          m(item.roomTypeName) ||
          m(item.roomStatusName) ||
          m(item.firstName) ||
          m(item.lastName) ||
          m(item.email) ||
          m(item.phone) ||
          m(item.companyName) ||
          m(item.taxMasterName) ||
          m(item.taxTypeEnum)
        )
      })
    }
    return {
      floors: filter(floors),
      buildings: filter(buildings),
      roomTypes: filter(roomTypes),
      rooms: filter(rooms),
      roomStatuses: filter(roomStatuses),
      personalDetails: filter(personalDetails),
      taxes: filter(taxes),
      documentTypes: filter(documentTypes),
    }
  }, [
    searchTerm,
    floors,
    buildings,
    roomTypes,
    roomStatuses,
    rooms,
    personalDetails,
    taxes,
    documentTypes,
  ])


  return (
    <div
      className={`flex h-screen ${isDark ? 'bg-surface-50 text-slate-100' : 'bg-[#f4f7fa] text-slate-800'} overflow-hidden font-sans transition-colors duration-300`}
    >
      {/* 1. Global Navigation Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isPropertyOpen={isPropertyOpen}
        setIsPropertyOpen={setIsPropertyOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* 2. Full-Page Loading State Overlays */}
      <LoadingProcess isLoading={isLoading} barOnly={true} />

      <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* 3. Top Header Layer (Global) */}
        <Navbar />

        {/* 4. Page Specific Title/Breadcrumb Layer */}
        <PageHeader
          activeItem={activeItem}
          onRefresh={fetchData}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* 5. Main Content Area - Scrollable */}
        <main
          className={`flex-1 overflow-auto ${isDark ? 'bg-surface-50' : 'bg-[#f8fafc]'} custom-scrollbar p-3 transition-colors duration-300 md:p-6 lg:p-8`}
        >
          <div className="md:y-6 mx-auto flex max-w-[1600px] flex-col space-y-4">
            {/* Dynamic Dashboard Module Rendering */}
            <DashboardRouter
              activeItem={activeItem}
              floors={filteredData.floors}
              buildings={filteredData.buildings}
              roomTypes={filteredData.roomTypes}
              roomStatuses={roomStatuses}
              rooms={filteredData.rooms}
              allFloors={floors}
              allBuildings={buildings}
              allRoomTypes={roomTypes}
              allRoomStatuses={roomStatuses}
              searchTerm={searchTerm}
              toggleModal={toggleModal}
              handleEditFloor={handleEditFloor}
              handleEditBuilding={handleEditBuilding}
              handleEditRoomType={handleEditRoomType}
              handleEditRoomStatus={handleEditRoomStatus}
              handleEditRoom={handleEditRoom}
              deleteFloor={deleteFloor}
              deleteBuilding={deleteBuilding}
              deleteRoomType={deleteRoomType}
              deleteRoomStatus={deleteRoomStatus}
              deleteRoom={deleteRoom}
              onAddPersonalDetail={() => toggleModal('personalDetail', true)}
              onEditPersonalDetail={handleEditPersonalDetail}
              onDeletePersonalDetail={deletePersonalDetail}
              personalDetails={personalDetails}
              documentDetails={documentDetails}
              stayDetails={stayDetails}
              onDeleteStayDetail={deleteStayDetail}
              taxes={taxes}
              handleEditTax={handleEditTax}
              deleteTax={deleteTax}
              documentTypes={documentTypes}
              handleEditDocumentType={handleEditDocumentType}
              deleteDocumentType={deleteDocumentType}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              userRole={userRole}
              isLoading={isLoading}
            />

            {/* Pagination Controls */}
            {(activeItem === 'Floor' ||
              activeItem === 'Building' ||
              activeItem === 'Room Type' ||
              activeItem === 'Room' ||
              activeItem === 'Room Status' ||
              activeItem === 'Personal Detail' ||
              activeItem === 'Document Type' ||
              activeItem === 'Tax') && (
              <div className="mt-8">
                <Pagination
                  activeItem={activeItem}
                  floors={filteredData.floors}
                  buildings={filteredData.buildings}
                  roomTypes={filteredData.roomTypes}
                  rooms={filteredData.rooms}
                  roomStatuses={filteredData.roomStatuses}
                  taxes={filteredData.taxes}
                  personalDetails={filteredData.personalDetails}
                  documentTypes={filteredData.documentTypes}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 6. Centered Property Management Modals */}
      <DashboardModals
        modals={modals}
        toggleModal={toggleModal}
        // Floor
        newFloor={newFloor}
        setNewFloor={setNewFloor}
        handleAddFloor={handleAddFloor}
        editFloor={editFloor}
        setEditFloor={setEditFloor}
        handleUpdateFloor={handleUpdateFloor}
        floors={floors}
        // Building
        newBuilding={newBuilding}
        setNewBuilding={setNewBuilding}
        handleAddBuilding={handleAddBuilding}
        editBuilding={editBuilding}
        setEditBuilding={setEditBuilding}
        handleUpdateBuilding={handleUpdateBuilding}
        buildings={buildings}
        // Room Type
        newRoomType={newRoomType}
        setNewRoomType={setNewRoomType}
        handleAddRoomType={handleAddRoomType}
        editRoomType={editRoomType}
        setEditRoomType={setEditRoomType}
        handleUpdateRoomType={handleUpdateRoomType}
        roomTypes={roomTypes}
        // Room Status
        newRoomStatus={newRoomStatus}
        setNewRoomStatus={setNewRoomStatus}
        handleAddRoomStatus={handleAddRoomStatus}
        editRoomStatus={editRoomStatus}
        setEditRoomStatus={setEditRoomStatus}
        handleUpdateRoomStatus={handleUpdateRoomStatus}
        roomStatuses={roomStatuses}
        // Room
        newRoom={newRoom}
        setNewRoom={setNewRoom}
        handleAddRoom={handleAddRoom}
        editRoom={editRoom}
        setEditRoom={setEditRoom}
        handleUpdateRoom={handleUpdateRoom}
        rooms={rooms}
        // Personal Detail
        personalFormData={personalFormData}
        setPersonalFormData={setPersonalFormData}
        editPersonalFormData={editPersonalFormData}
        setEditPersonalFormData={setEditPersonalFormData}
        handlePersonalSubmit={handlePersonalSubmit}
        handleEditPersonalDetail={handleEditPersonalDetail}
        handlePersonalFileUpload={handlePersonalFileUpload}
        uploadingType={uploadingType}
        // Tax
        newTax={newTax}
        setNewTax={setNewTax}
        handleAddTax={handleAddTax}
        editTax={editTax}
        setEditTax={setEditTax}
        handleUpdateTax={handleUpdateTax}
        taxes={taxes}
        // Document Type
        newDocumentType={newDocumentType}
        setNewDocumentType={setNewDocumentType}
        handleAddDocumentType={handleAddDocumentType}
        editDocumentType={editDocumentType}
        setEditDocumentType={setEditDocumentType}
        handleUpdateDocumentType={handleUpdateDocumentType}
        isLoading={isLoading}
        stayDetails={stayDetails}
        documentTypes={documentTypes}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  )
}

export default PmsDashboard
