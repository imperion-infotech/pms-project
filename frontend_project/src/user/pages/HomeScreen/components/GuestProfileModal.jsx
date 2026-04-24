import React, { useState, useEffect } from 'react'
import {
  X,
  User,
  Save,
  Loader2,
  Building,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Printer,
  RefreshCw,
  ArrowLeftRight,
  CalendarCheck,
  FileText,
  Edit,
  Camera,
  Paperclip,
  ShieldCheck,
  Receipt,
  BedDouble,
  Pen as SignatureIcon,
  Plus,
  Trash2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import usePmsData from '../../../../hooks/usePmsData'
import { propertyService } from '../../../../services/propertyService'

// Sub-components
import ImageUpload from './roomAction/ImageUpload'
import DocumentModal from './roomAction/DocumentModal'
import StaySpecifications from '../../../../components/common/StaySpecifications'
import GuestInformation from '../../../../components/common/GuestInformation'
import RentDetails from '../../../../components/common/RentDetails'
import { AuthImage } from '../../../../admin/components/common/AuthImage'

/**
 * cleanImageUrl - Helper to extract just the filename from potentially complex paths.
 */
const cleanImageUrl = (path) => {
  if (!path || path === 'photo' || path === 'sign') return null
  let cleanPath = String(path)
  if (cleanPath.includes(': ')) cleanPath = cleanPath.split(': ')[1].trim()
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1)
  const parts = cleanPath.split('/')
  return parts[parts.length - 1]
}

// Local-timezone date/time helpers (avoids UTC vs IST mismatch)
const localDateStr = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}
const localTimeStr = () => {
  const d = new Date()
  return [
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
    String(d.getSeconds()).padStart(2, '0'),
  ].join(':')
}

/**
 * GuestProfileModal Component
 *
 * A unique, high-end modal for managing Guest Personal Profiles.
 * It combines media capture (Photo/Signature) and guest details into a unified workspace.
 * Replaces the older RoomActionModal and integrates the GuestForm directly.
 */
const GuestProfileModal = ({ isOpen, onClose, room, isDark, onRefresh }) => {
  const {
    addPersonalDetail,
    updatePersonalDetail,
    updateRoom,
    roomStatuses,
    rooms: rawRooms,
    documentTypes,
    fetchDocumentDetailsByPersonalDetailId,
    fetchPersonalDetailById,
    addDocumentDetail,
    deleteDocumentDetail,
    addStayDetail,
    buildings,
    floors,
    roomTypes,
    taxes,
    addRentDetail,
    updateRentDetail,
    addGuestDetail,
    updateGuestDetail,
    fetchFolioNo,
    guestDetails = [],
    rentDetails = [],
    stayDetails = [],
  } = usePmsData()

  // Local state for Document Details (List of uploaded docs with types)
  const [documentDetails, setDocumentDetails] = useState([])

  // const activeHotelId = Number(localStorage.getItem('activeHotelId')) || 0
  // const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [localPreviews, setLocalPreviews] = useState({ profilePhoto: null, signature: null })

  // Initial state for the unified guest form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    email: '',
    address: '',
    profilePhoto: '',
    signature: '',
    contactInformationTypeEnum: 'HOME',
    documents: [],
    folioNo: '',
    crsFolioNo: '',
    // Stay Details
    stayId: null,
    floorId: '',
    buildingId: '',
    roomTypeId: '',
    roomMasterId: '',
    comment: '',
    rateTypeEnum: 'RACK',
    noOfGuest: 1,
    stayStatusEnum: 'Confirmed',
    // Temporal
    checkInId: null,
    guestDetailId: null,
    checkInDate: localDateStr(0),
    checkOutDate: localDateStr(1),
    checkInTime: localTimeStr(),
    checkOutTime: localTimeStr(),
    guestDetailsStatus: 'Reservation',
    noOfDays: 1,
    roomStatusId: '',
    // Stay Details (stayStatusEnum backend accepts: 'Confirmed' | 'UnConfirmed' ONLY)
    // Rent
    rentId: null,
    rent: '',
    basic: '',
    taxId: '',
    totalRental: '',
    otherCharges: '',
    discount: '',
    totalCharges: '',
    payments: '',
    ccAuthorized: '',
    deposite: '',
    balance: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingType, setUploadingType] = useState(null)

  const [showDocForm, setShowDocForm] = useState(false)
  const [editingDocIndex, setEditingDocIndex] = useState(-1)

  // 1. Initial Data Fetching & Synchronization
  useEffect(() => {
    if (!isOpen) return

    const loadData = async () => {
      const targetId = room?.profile?.id || room?.personalDetailId || room?.profileId

      // Base data from room object
      const baseProfile = room?.profile || (room?.firstName ? room : {})
      let fName = baseProfile.firstName || ''
      let lName = baseProfile.lastName || ''

      if (!fName && baseProfile.personalDetailName) {
        const parts = baseProfile.personalDetailName.split(' ')
        fName = parts[0] || ''
        lName = parts.slice(1).join(' ') || ''
      }

      // Robust ID extraction (Handles both primitives and objects)
      const getID = (val) => (val && typeof val === 'object' ? val.id || val : val)

      const bId = getID(
        room.buildingId || room.building_id || room.building || room.buildings || '',
      )
      const fId = getID(room.floorId || room.floor_id || room.floor || room.floors || '')
      const rtId = getID(
        room.roomTypeId || room.room_type_id || room.roomType || room.room_type || '',
      )

      const initialForm = {
        firstName: fName,
        lastName: lName,
        companyName: baseProfile.companyName || '',
        phone: baseProfile.phone || '',
        email: baseProfile.email || '',
        address: baseProfile.address || '',
        profilePhoto: baseProfile.profilePhoto || '',
        signature: baseProfile.signature || '',
        contactInformationTypeEnum: baseProfile.contactInformationTypeEnum || 'HOME',
        // Stay & Temporal
        floorId: fId,
        buildingId: bId,
        roomTypeId: rtId,
        roomMasterId: room.id || '',
        comment: '',
        rateTypeEnum: 'RACK',
        noOfGuest: 1,
        stayStatusEnum: 'Confirmed',
        checkInId: room.checkInId || null,
        guestDetailId: room.guestDetailId || null,
        checkInDate: room.checkInDate ? room.checkInDate.split('T')[0] : localDateStr(0),
        checkOutDate: room.checkOutDate ? room.checkOutDate.split('T')[0] : localDateStr(1),
        checkInTime: room.checkInTime || localTimeStr(),
        checkOutTime: room.checkOutTime || localTimeStr(),
        roomStatusId: room.roomStatusTableId || room.roomStatusId || '',
        guestDetailsStatus: room.guestDetailsStatus || 'Reservation',
        noOfDays: room.noOfDays || 1,
        // Rent
        rentId: room.rentDetailsId || room.rentId || null,
        rent: room.rentDetails?.rent || '',
        basic: room.rentDetails?.basic || '',
        taxId: room.rentDetails?.taxId || '',
        totalRental: room.rentDetails?.totalRental || '',
        otherCharges: room.rentDetails?.otherCharges || '',
        discount: room.rentDetails?.discount || '',
        totalCharges: room.rentDetails?.totalCharges || '',
        payments: room.rentDetails?.payments || '',
        ccAuthorized: room.rentDetails?.ccAuthorized || '',
        deposite: room.rentDetails?.deposite || '',
        balance: room.rentDetails?.balance || '',
        folioNo: '', // Clear old folio by default
      }

      // 2. Fetch Fresh Data if ID exists
      if (targetId) {
        try {
          const [profileRes, docs] = await Promise.all([
            fetchPersonalDetailById(targetId),
            fetchDocumentDetailsByPersonalDetailId(targetId),
          ])

          setDocumentDetails(docs || [])

          if (profileRes?.data) {
            const p = profileRes.data

            const matchedGuest = guestDetails.find(
              (g) =>
                String(g.personalDetailsId) === String(targetId) &&
                String(g.roomMasterId) === String(room.id),
            )

            let extraData = {}
            if (matchedGuest) {
              const matchedRent = rentDetails.find(
                (r) => String(r.id) === String(matchedGuest.rentDetailsId),
              )
              const matchedStay = stayDetails.find(
                (s) => String(s.id) === String(matchedGuest.stayDetailsId),
              )

              extraData = {
                guestDetailId: matchedGuest.id,
                checkInDate: matchedGuest.checkInDate
                  ? matchedGuest.checkInDate.split('T')[0]
                  : initialForm.checkInDate,
                checkOutDate: matchedGuest.checkOutDate
                  ? matchedGuest.checkOutDate.split('T')[0]
                  : initialForm.checkOutDate,
                checkInTime: matchedGuest.checkInTime || initialForm.checkInTime,
                checkOutTime: matchedGuest.checkOutTime || initialForm.checkOutTime,
                noOfDays: matchedGuest.noOfDays || initialForm.noOfDays,
                guestDetailsStatus:
                  matchedGuest.guestDetailsStatus || initialForm.guestDetailsStatus,

                // Rent
                rentId: matchedRent?.id || initialForm.rentId,
                rent: matchedRent?.rent || initialForm.rent,
                basic: matchedRent?.basic || initialForm.basic,
                taxId: matchedRent?.taxId || initialForm.taxId,
                totalRental: matchedRent?.totalRental || initialForm.totalRental,
                otherCharges: matchedRent?.otherCharges || initialForm.otherCharges,
                discount: matchedRent?.discount || initialForm.discount,
                totalCharges: matchedRent?.totalCharges || initialForm.totalCharges,
                payments: matchedRent?.payments || initialForm.payments,
                ccAuthorized: matchedRent?.ccAuthorized || initialForm.ccAuthorized,
                deposite: matchedRent?.deposite || initialForm.deposite,
                balance: matchedRent?.balance || initialForm.balance,

                // Stay
                stayId: matchedStay?.id || initialForm.stayId,
                floorId: matchedStay?.floorId || initialForm.floorId,
                buildingId: matchedStay?.buildingId || initialForm.buildingId,
                roomTypeId: matchedStay?.roomTypeId || initialForm.roomTypeId,
                comment: matchedStay?.comment || initialForm.comment,
                rateTypeEnum: matchedStay?.rateTypeEnum || initialForm.rateTypeEnum,
                noOfGuest: matchedStay?.noOfGuest || initialForm.noOfGuest,
                stayStatusEnum: matchedStay?.stayStatusEnum || initialForm.stayStatusEnum,
              }
            }

            setFormData({
              ...initialForm,
              firstName: p.firstName || fName,
              lastName: p.lastName || lName,
              companyName: p.companyName || initialForm.companyName,
              phone: p.phone || initialForm.phone,
              email: p.email || initialForm.email,
              address: p.address || initialForm.address,
              profilePhoto: p.profilePhoto || initialForm.profilePhoto,
              signature: p.signature || initialForm.signature,
              contactInformationTypeEnum: p.contactInformationTypeEnum || 'HOME',
              folioNo: p.folioNo || '',
              crsFolioNo: p.crsFolioNo || '',
              ...extraData,
            })
            return
          }
        } catch (err) {
          console.error('Core Data Load Error:', err)
        }
      } else {
        // Only fetch folio if we're in creation mode
        setDocumentDetails([])
        try {
          console.log('[Folio] Fetching for new profile...')
          const res = await fetchFolioNo()
          // Robust extraction: Handle both raw string and object response
          const folioValue = typeof res === 'object' && res?.folioNo ? res.folioNo : res
          setFormData((prev) => ({
            ...prev,
            ...initialForm,
            folioNo: String(folioValue || ''),
          }))
        } catch (err) {
          console.warn('Folio fetch failed', err)
          const fallbackFolio = '4382' + Date.now() + Math.floor(Math.random() * 1000)
          setFormData((prev) => ({ ...prev, ...initialForm, folioNo: fallbackFolio }))
        }
        return
      }

      setFormData((prev) => ({ ...prev, ...initialForm }))
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, isOpen])

  // Cleanup previews on modal close
  useEffect(() => {
    if (!isOpen) {
      setLocalPreviews((prev) => {
        Object.values(prev).forEach((p) => p && URL.revokeObjectURL(p))
        return { profilePhoto: null, signature: null }
      })
    }
  }, [isOpen])

  if (!isOpen || !room) return null

  const profile = room.profile || (room.firstName ? room : {})
  const isExisting = !!(profile.id || room.profile || room.firstName)

  const reservationStatus = roomStatuses.find(
    (s) =>
      s.roomStatusName?.toLowerCase().includes('reserv') ||
      s.shortName?.toLowerCase().includes('res'),
  )
  const reservationColor = reservationStatus?.roomStatusColor?.trim() || '#2F8B2C'

  const occupiedStatus = roomStatuses.find(
    (s) =>
      s.roomStatusName?.toLowerCase().includes('occupied') ||
      s.shortName?.toLowerCase().includes('occ'),
  )
  const occupiedColor = occupiedStatus?.roomStatusColor?.trim() || '#2563eb' // fallback blue-600

  const currentStatusName = (room.statusDetails?.roomStatusName || '').toLowerCase()
  const isReserved =
    currentStatusName.includes('reserved') || currentStatusName.includes('reservation')

  // Shared classes for integrated form (Exactly like Admin Modal)
  const inputContainerClass = 'group relative'
  const iconClass =
    'absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500'
  const inputClass =
    'w-full rounded-md border border-slate-200 bg-white py-1.5 pr-4 pl-10 text-xs font-semibold text-slate-800 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20 placeholder:text-slate-300'
  const labelClass =
    'mb-1 block text-pms-tiny font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400'
  const cardClass =
    'rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700/50 dark:bg-slate-800/50'

  // Handle generic input changes with hierarchical resets
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      const updated = { ...prev, [name]: value }

      // Hierarchical resets:
      if (name === 'buildingId') {
        updated.floorId = ''
        updated.roomTypeId = ''
        updated.roomMasterId = ''
      } else if (name === 'floorId') {
        updated.roomTypeId = ''
        updated.roomMasterId = ''
      } else if (name === 'roomTypeId') {
        updated.roomMasterId = ''
      }

      return updated
    })
  }

  // Handle image removal
  const handleImageClear = (type) => {
    if (localPreviews[type]) URL.revokeObjectURL(localPreviews[type])
    setLocalPreviews((prev) => ({ ...prev, [type]: null }))
    setFormData((prev) => ({ ...prev, [type]: '' }))
  }

  // Handle real image uploads
  const handleImageSelect = async (file, type) => {
    if (!file) return

    const url = URL.createObjectURL(file)
    setLocalPreviews((prev) => {
      if (prev[type]) URL.revokeObjectURL(prev[type])
      return { ...prev, [type]: url }
    })

    setUploadingType(type)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await propertyService.uploadImage(uploadFormData)
      const responseData = response.data?.fileName || response.data

      let fileName = responseData
      if (typeof responseData === 'string' && responseData.includes(':')) {
        // Robust splitting: Take everything after the last colon
        fileName = responseData.substring(responseData.lastIndexOf(':') + 1).trim()
      }

      setFormData((prev) => ({ ...prev, [type]: fileName }))
    } catch (err) {
      console.error('Image upload failed:', err)
      alert('Photo upload failed. Please try again.')
    } finally {
      setUploadingType(null)
    }
  }

  const toggleDocForm = (index = -1) => {
    setEditingDocIndex(index)
    setShowDocForm(true)
  }

  const saveDocument = (docData) => {
    const targetProfileId = profile?.id || room?.personalDetailId

    if (targetProfileId) {
      // API call was already handled by DocumentModal
      fetchDocumentDetailsByPersonalDetailId(targetProfileId)
    } else {
      // Local state only for new profiles not yet saved
      const updatedDocs = [...(formData.documents || [])]
      if (editingDocIndex >= 0) {
        updatedDocs[editingDocIndex] = docData
      } else {
        updatedDocs.push(docData)
      }
      setFormData((prev) => ({ ...prev, documents: updatedDocs }))
    }
    setShowDocForm(false)
  }

  const handleDeleteDocument = async (doc, index) => {
    if (doc.id) {
      try {
        await deleteDocumentDetail(doc.id)
        const targetProfileId = profile?.id || room?.personalDetailId
        if (targetProfileId) fetchDocumentDetailsByPersonalDetailId(targetProfileId)
      } catch (err) {
        console.error('Failed to delete document:', err)
      }
    } else {
      const updatedDocs = (formData.documents || []).filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, documents: updatedDocs }))
    }
  }

  const handleSubmit = async (e, forcedStatusName = null) => {
    if (e) e.preventDefault()

    const requiredFields = ['firstName', 'lastName', 'phone', 'email']
    const missing = requiredFields.filter((f) => !formData[f])
    if (missing.length > 0) {
      alert(`Missing required fields: ${missing.join(', ')}`)
      return
    }

    setIsSubmitting(true)
    try {
      const targetProfileId = profile?.id || room?.personalDetailId || room?.profileId

      // Handle the case where forcedStatusName might be an event or null
      let targetStatusName =
        (typeof forcedStatusName === 'string' ? forcedStatusName : null) ||
        formData.guestDetailsStatus ||
        'Reservation'

      // 0. Find Target Status ID and Color early for consistent mapping
      const targetStatus = roomStatuses.find((s) => {
        const name = (s.roomStatusName || '').toLowerCase()
        const short = (s.shortName || '').toLowerCase()
        const matchStr = targetStatusName.toLowerCase()
        if (matchStr.includes('reserv')) return name.includes('reserv') || short.includes('res')
        if (matchStr.includes('check in') || matchStr.includes('occup'))
          return name.includes('occup') || short.includes('occ')
        return name.includes(matchStr) || short.includes(matchStr)
      })

      const finalStatusId = targetStatus?.id

      // Extremely defensive color resolution to prevent "null or empty" backend errors
      let finalStatusColor = '#2F8B2C' // Default PMS Green
      if (targetStatus) {
        finalStatusColor = (
          targetStatus.roomStatusColor ||
          targetStatus.bgColor ||
          targetStatus.color ||
          ''
        ).trim()
      }

      // Fallback if targetStatus didn't have a color or wasn't found
      if (!finalStatusColor) {
        finalStatusColor = targetStatusName.toLowerCase().includes('reserv') ? '#2F8B2C' : '#2798e8'
      }

      // 1. Personal Detail
      const personalPayload = {
        ...formData,
        contactInformationTypeEnum: formData.contactInformationTypeEnum || 'HOME',
        phone: formData.phone,
        mobileNumber: formData.phone,
        folioNo: formData.folioNo,
        crsFolioNo: formData.crsFolioNo,
        id: targetProfileId || 0,
      }
      console.log('1. [Home] Personal Payload:', personalPayload)

      const res =
        isExisting && targetProfileId
          ? await updatePersonalDetail(targetProfileId, personalPayload)
          : await addPersonalDetail(personalPayload)

      const finalProfileId = res?.data?.id || res?.data || targetProfileId
      console.log('--------------------Final Profile ID-----------------', finalProfileId)

      // 2. Documents Logic (Sequential Linking)
      let finalDocId = null

      // If there are documents in the list (new or newly added)
      if (formData.documents?.length > 0 && finalProfileId) {
        const docPromises = formData.documents.map(async (doc) => {
          // Use nested object for personal detail linkage as per Admin side success
          const docPayload = {
            ...doc,
            personalDetails: { id: finalProfileId },
            personalDetailsId: finalProfileId, // Adding flat ID too for safety
          }
          console.log('2. [Home] Document Payload:', docPayload)
          const dRes = await addDocumentDetail(docPayload)
          return dRes?.data?.id || dRes?.data
        })
        const docIds = await Promise.all(docPromises)
        finalDocId = docIds[0] // Taking first doc ID for guest linkage
      } else if (isExisting && documentDetails?.length > 0) {
        // Use existing document ID if already available
        finalDocId = documentDetails[0]?.id
      }

      // 3. Rent Detail
      const rentPayload = {
        rent: Number(formData.rent) || 0,
        basic: Number(formData.basic) || 0,
        taxId: formData.taxId ? Number(formData.taxId) : undefined,
        totalRental: Number(formData.totalRental) || 0,
        otherCharges: Number(formData.otherCharges) || 0,
        discount: Number(formData.discount) || 0,
        totalCharges: Number(formData.totalCharges) || 0,
        payments: Number(formData.payments) || 0,
        ccAuthorized: Number(formData.ccAuthorized) || 0,
        deposite: Number(formData.deposite) || 0,
        balance: Number(formData.balance) || 0,
        deleted: false,
      }
      console.log('3. [Home] Rent Payload:', rentPayload)
      const rentRes = formData.rentId
        ? await updateRentDetail(formData.rentId, rentPayload)
        : await addRentDetail(rentPayload)
      const finalRentId = rentRes?.data?.id || rentRes?.data || formData.rentId

      // 4. Stay Detail
      const stayPayload = {
        floorId: Number(formData.floorId) || undefined,
        buildingId: Number(formData.buildingId) || undefined,
        roomTypeId: Number(formData.roomTypeId) || undefined,
        roomMasterId: Number(formData.roomMasterId || room.id),
        comment: formData.comment || '',
        rateTypeEnum: formData.rateTypeEnum || 'RACK',
        noOfGuest: Number(formData.noOfGuest) || 1,
        stayStatusEnum: targetStatusName?.toLowerCase().includes('reserv')
          ? 'UnConfirmed'
          : formData.stayStatusEnum === 'UnConfirmed'
            ? 'UnConfirmed'
            : 'Confirmed',
        color: finalStatusColor,
        personalDetailId: finalProfileId,
        personalDetailsId: finalProfileId, // Backup flat ID
        roomStatusId: finalStatusId,
      }
      console.log('4. [Home] Stay Payload:', stayPayload)
      const stayRes = await addStayDetail(stayPayload)
      const finalStayId = stayRes?.data?.id || stayRes?.data

      // 5. Guest Detail Integration (LINKING EVERYTHING)
      const guestPayload = {
        roomMasterId: Number(formData.roomMasterId || room.id),
        personalDetailsId: finalProfileId,
        documentDetailsId: finalDocId, // CRITICAL: This was missing!
        rentDetailsId: finalRentId,
        stayDetailsId: finalStayId,
        checkInDate: formData.checkInDate
          ? formData.checkInDate.includes('T')
            ? formData.checkInDate
            : `${formData.checkInDate}T00:00:00.000`
          : null,
        checkOutDate: formData.checkOutDate
          ? formData.checkOutDate.includes('T')
            ? formData.checkOutDate
            : `${formData.checkOutDate}T00:00:00.000`
          : null,
        checkInTime: formData.checkInTime || '00:00:00',
        checkOutTime: formData.checkOutTime || '00:00:00',
        noOfDays: Number(formData.noOfDays) || 1,
        guestDetailsStatus: targetStatusName,
      }
      console.log('5. [Home] Guest Payload:', guestPayload)

      if (formData.guestDetailId) {
        await updateGuestDetail(formData.guestDetailId, guestPayload)
      } else {
        await addGuestDetail(guestPayload)
      }

      // 6. Final Room Status Update (Triggers Home Screen Color Change)
      if (finalStatusId) {
        const originalRoom =
          rawRooms.find((r) => String(r.id) === String(room.id)) || (room.roomName ? room : null)
        if (originalRoom) {
          await updateRoom(room.id, {
            ...originalRoom,
            roomStatusTableId: finalStatusId,
            roomStatusId: finalStatusId,
            personalDetailId: finalProfileId,
          })
        }
      }

      if (onRefresh) onRefresh()
      onClose()
    } catch (err) {
      console.error('Submission failed:', err)
      alert(err.response?.data?.message || 'Update failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-[0_48px_100px_-12px_rgba(0,0,0,0.3)] backdrop-blur-xl dark:bg-slate-900/95"
        >
          <form
            id="guestProfileForm"
            onSubmit={handleSubmit}
            className="flex h-full flex-col overflow-hidden"
          >
            {/* Header */}
            <div
              className={`flex shrink-0 items-center justify-between border-b p-4 shadow-sm sm:px-8 ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-white/40'} backdrop-blur-xl`}
            >
              <div className="flex items-center gap-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/20">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
                    {/* {isExisting ? 'Update' : 'Create'}{' '} */}
                    <span className="text-blue-500">Guest Profile</span>
                  </h2>
                  <div className="mt-0.5 flex items-center gap-2 text-left">
                    <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                    <p className="text-pms-tiny font-bold tracking-widest text-slate-400 uppercase">
                      Comprehensive Check-in & Allotment • RM {room.roomName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-6 rounded-lg px-4 py-2 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                >
                  <div className="flex flex-col items-end">
                    <span className="text-pms-micro font-bold tracking-widest text-slate-400 uppercase">
                      Folio No.
                    </span>
                    <input
                      type="text"
                      value={formData.folioNo || ''}
                      readOnly
                      className="bg-transparent text-right text-xs font-black text-blue-600 outline-none dark:text-blue-400"
                      placeholder="—"
                    />
                  </div>
                  <div className={`h-8 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className="flex flex-col items-end">
                    <span className="text-pms-micro font-bold tracking-widest text-slate-400 uppercase">
                      CRS Folio No.
                    </span>
                    <input
                      type="text"
                      value={formData.crsFolioNo || ''}
                      onChange={(e) => setFormData({ ...formData, crsFolioNo: e.target.value })}
                      className={`w-24 bg-transparent text-right text-xs font-black outline-none focus:text-blue-600 dark:text-white dark:focus:text-blue-400 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}
                      placeholder="Enter No."
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 active:scale-95 dark:bg-slate-800 dark:hover:bg-red-900/20"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="flex h-full flex-col overflow-hidden lg:flex-row">
                {/* Column 1: Identity & Documentation */}
                <div className="flex w-full flex-col border-b border-slate-100 bg-white transition-all lg:w-[32%] lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 px-3 py-1.5 text-left">
                    <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <ShieldCheck size={10} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-pms-micro font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                      Personal Information
                    </h3>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* Integrated Asset Capture */}
                    <div className={cardClass}>
                      <div className="flex items-start gap-3">
                        <div className="group relative">
                          <div className="h-24 w-24 overflow-hidden rounded-[20px] border-4 border-white bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-900">
                            {formData.profilePhoto ? (
                              <AuthImage
                                src={`/user/${cleanImageUrl(formData.profilePhoto)}`}
                                alt="Preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                                <User size={32} />
                                <span className="text-pms-micro mt-1 font-bold tracking-wider uppercase">
                                  Photo
                                </span>
                              </div>
                            )}
                            {uploadingType === 'profilePhoto' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                              </div>
                            )}
                          </div>
                          <label className="absolute -right-2 -bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg ring-2 ring-white transition-transform hover:scale-110 dark:ring-slate-900">
                            <Camera size={14} />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageSelect(e.target.files[0], 'profilePhoto')}
                            />
                          </label>
                        </div>

                        <div className="flex h-24 flex-1 flex-col justify-end space-y-2">
                          <div className="relative flex-1 rounded-[18px] border-2 border-dashed border-slate-200 bg-white p-1.5 text-center transition-colors hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800">
                            {formData.signature ? (
                              <div className="relative flex h-full items-center justify-center">
                                <AuthImage
                                  src={`/user/${cleanImageUrl(formData.signature)}`}
                                  alt="Signature"
                                  className="max-h-full object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleImageClear('signature')}
                                  className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1.5 text-red-500 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center">
                                <Save size={20} className="mb-1 text-slate-300" />
                                <p className="text-pms-micro font-bold tracking-widest text-slate-400 uppercase">
                                  Digital Signature
                                </p>
                              </div>
                            )}
                            <label className="absolute inset-0 cursor-pointer opacity-0">
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageSelect(e.target.files[0], 'signature')}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-pms-tiny font-black tracking-widest text-blue-500 uppercase">
                          Background Info
                        </span>
                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                          <label className={labelClass}>
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <div className={inputContainerClass}>
                            <User size={14} className={iconClass} />
                            <input
                              required
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className={inputClass}
                              placeholder="John"
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <div className={inputContainerClass}>
                            <User size={14} className={iconClass} />
                            <input
                              required
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className={inputClass}
                              placeholder="Doe"
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>Company Name</label>
                          <div className={inputContainerClass}>
                            <Building size={14} className={iconClass} />
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleChange}
                              className={inputClass}
                              placeholder="Inc. Pvt Ltd"
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-pms-micro font-bold text-slate-400 uppercase">
                            Contact Info Type
                          </label>
                          <select
                            name="contactInformationTypeEnum"
                            value={formData.contactInformationTypeEnum}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          >
                            <option value="HOME">HOME</option>
                            <option value="OFFICE">OFFICE</option>
                            <option value="OTHER">OTHER</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>
                            {formData.contactInformationTypeEnum} Phone{' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className={inputContainerClass}>
                            <Phone size={14} className={iconClass} />
                            <input
                              required
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className={inputClass}
                              placeholder="Phone No."
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>
                            {formData.contactInformationTypeEnum} Email{' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className={inputContainerClass}>
                            <Mail size={14} className={iconClass} />
                            <input
                              required
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className={inputClass}
                              placeholder="Email address"
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-pms-micro font-bold text-slate-400 uppercase">
                            {formData.contactInformationTypeEnum} Full Address{' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            required
                            rows="2"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 w-full resize-none rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-all outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            placeholder="Address details..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Documentation Table */}
                    <div className="rounded-lg border border-blue-100/50 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-pms-tiny font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
                          ID Documents
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleDocForm()}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="overflow-hidden rounded-lg border border-blue-100/50 bg-white dark:border-blue-900/20 dark:bg-slate-900">
                        <table className="w-full text-left font-bold">
                          <thead className="bg-blue-50/50 dark:bg-blue-900/20">
                            <tr className="text-pms-micro font-black tracking-wider text-slate-400 uppercase">
                              <th className="px-3 py-2">Action</th>
                              <th className="px-3 py-2">Details</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {(profile?.id || room?.personalDetailId
                              ? documentDetails
                              : formData.documents || []
                            ).length > 0 ? (
                              (profile?.id || room?.personalDetailId
                                ? documentDetails
                                : formData.documents || []
                              ).map((doc, idx) => {
                                const docType = documentTypes.find(
                                  (t) => String(t.id) === String(doc.documentTypeId),
                                )
                                return (
                                  <tr key={doc.id || idx} className="text-pms-tiny">
                                    <td className="px-3 py-2">
                                      <div className="flex gap-2 text-slate-400">
                                        <button
                                          type="button"
                                          onClick={() => toggleDocForm(idx)}
                                          className="hover:text-blue-500"
                                        >
                                          <Edit size={12} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDocument(doc, idx)}
                                          className="hover:text-red-500"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </td>
                                    <td className="px-3 py-2">
                                      <div className="font-bold text-slate-700 dark:text-slate-300">
                                        {docType?.documentTypeName}
                                      </div>
                                      <div className="text-pms-micro text-slate-400">
                                        {doc.documentNumber}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })
                            ) : (
                              <tr>
                                <td
                                  colSpan="2"
                                  className="text-pms-micro px-3 py-4 text-center font-bold text-slate-400"
                                >
                                  No Documents
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Guest Info & Stay Selection */}
                <div className="flex w-full flex-col border-b border-slate-100 bg-slate-50/50 transition-all lg:w-[46%] lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-800/10">
                  <div
                    className={`flex items-center gap-2 border-b px-4 py-3 text-left ${isDark ? 'border-slate-800' : 'border-slate-100'}`}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 shadow-lg shadow-amber-500/20">
                      <CalendarCheck size={12} className="text-white" />
                    </div>
                    <h3 className="text-pms-tiny font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                      Accomodation Information
                    </h3>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-pms-tiny font-black tracking-widest text-amber-500 uppercase">
                          Guest Details
                        </span>
                        <div className="h-px flex-1 bg-amber-50 dark:bg-amber-900/20"></div>
                      </div>
                      <GuestInformation
                        formData={formData}
                        handleChange={(e) => {
                          const { name, value } = e.target
                          let updated = { ...formData, [name]: value }
                          if (name === 'noOfDays' || name === 'checkInDate') {
                            const days =
                              parseInt(name === 'noOfDays' ? value : formData.noOfDays || 1) || 1
                            const start = name === 'checkInDate' ? value : formData.checkInDate
                            if (start) {
                              const [y, m, d] = start.split('-').map(Number)
                              const date = new Date(y, m - 1, d)
                              date.setDate(date.getDate() + days)
                              updated.checkOutDate = [
                                date.getFullYear(),
                                String(date.getMonth() + 1).padStart(2, '0'),
                                String(date.getDate()).padStart(2, '0'),
                              ].join('-')
                              updated.noOfDays = days
                            }
                          } else if (name === 'checkOutDate') {
                            if (formData.checkInDate && value) {
                              const [y1, m1, d1] = formData.checkInDate.split('-').map(Number)
                              const [y2, m2, d2] = value.split('-').map(Number)
                              const start = new Date(y1, m1 - 1, d1)
                              const end = new Date(y2, m2 - 1, d2)
                              const diff = Math.round((end - start) / (1000 * 60 * 60 * 24))
                              updated.noOfDays = diff >= 0 ? diff : 0
                            }
                          }
                          setFormData(updated)
                        }}
                        isDark={isDark}
                      />
                    </div>

                    <div className="rounded-lg border border-amber-100/50 bg-amber-50/50 p-2 dark:border-amber-900/20 dark:bg-amber-900/5">
                      <div className="mb-1.5 flex items-center gap-3">
                        <span className="text-pms-micro font-black tracking-widest text-amber-600 uppercase dark:text-amber-400">
                          Booking & Unit Allocation
                        </span>
                        <div className="h-px flex-1 bg-amber-200/50 dark:bg-amber-800/30"></div>
                      </div>
                      <StaySpecifications
                        formData={formData}
                        handleChange={handleChange}
                        buildings={buildings}
                        floors={floors}
                        roomTypes={roomTypes}
                        rooms={rawRooms}
                        roomStatuses={roomStatuses}
                        isDark={isDark}
                        showStatus={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Column 3: Rent Details */}
                <div className="flex w-full flex-col bg-slate-50 transition-all lg:w-[22%] dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 px-3 py-1.5 text-left">
                    <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <Receipt size={10} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-pms-micro font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                      Rent Information
                    </h3>
                  </div>
                  <div className="flex flex-1 flex-col overflow-y-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-emerald-100 bg-white p-4 shadow-xl shadow-emerald-500/5 transition-all hover:shadow-emerald-500/10 dark:border-emerald-900/20 dark:bg-slate-900">
                      <RentDetails
                        formData={formData}
                        handleChange={(e) =>
                          setFormData({ ...formData, [e.target.name]: e.target.value })
                        }
                        taxes={taxes}
                        isDark={isDark}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t bg-slate-50/80 px-8 py-5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'Reservation')}
                disabled={isSubmitting || uploadingType || isReserved}
                className={`text-pms-tiny flex items-center gap-2 rounded-lg px-5 py-2.5 font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${
                  isSubmitting || uploadingType || isReserved
                    ? 'cursor-not-allowed bg-slate-400 shadow-none'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor:
                    isSubmitting || uploadingType || isReserved ? undefined : reservationColor,
                  boxShadow:
                    isSubmitting || uploadingType || isReserved
                      ? undefined
                      : `0 20px 25px -5px ${reservationColor}4d, 0 8px 10px -6px ${reservationColor}4d`,
                }}
              >
                <CalendarCheck size={14} />
                <span>Reservation</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'Occupied')}
                disabled={isSubmitting || uploadingType}
                className={`text-pms-tiny flex items-center gap-2 rounded-lg px-5 py-2.5 font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${
                  isSubmitting || uploadingType
                    ? 'cursor-not-allowed bg-slate-400 shadow-none'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: isSubmitting || uploadingType ? undefined : occupiedColor,
                  boxShadow:
                    isSubmitting || uploadingType
                      ? undefined
                      : `0 20px 25px -5px ${occupiedColor}4d, 0 8px 10px -6px ${occupiedColor}4d`,
                }}
              >
                <CheckCircle size={14} />
                <span>Check In</span>
              </button>

              <button
                type="submit"
                form="guestProfileForm"
                disabled={isSubmitting || uploadingType}
                className={`text-pms-tiny flex items-center gap-2 rounded-lg px-5 py-2.5 font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${isSubmitting || uploadingType ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-indigo-600 shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40'}`}
              >
                <RefreshCw size={14} className={isSubmitting ? 'animate-spin' : ''} />
                <span>Update Profile</span>
              </button>

              <div className="mx-2 h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <ArrowLeftRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <Printer size={16} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-red-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <X size={16} />
              </button>
            </div>
          </form>

          <DocumentModal
            isOpen={showDocForm}
            onClose={() => setShowDocForm(false)}
            onSave={saveDocument}
            isDark={isDark}
            documentTypes={documentTypes}
            initialData={
              editingDocIndex >= 0
                ? profile?.id || room?.personalDetailId
                  ? documentDetails[editingDocIndex]
                  : formData.documents[editingDocIndex]
                : null
            }
            personalDetailsId={profile?.id || room?.personalDetailId}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default GuestProfileModal
