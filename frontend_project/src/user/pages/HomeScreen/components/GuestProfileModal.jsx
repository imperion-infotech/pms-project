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
import { AuthImage } from '../../../../admin/components/common/AuthImage'

// Modular Components
import PrintTemplate from './GuestProfileModal/PrintTemplate'
import ModalHeader from './GuestProfileModal/ModalHeader'
import ActionFooter from './GuestProfileModal/ActionFooter'
import IdentitySection from './GuestProfileModal/IdentitySection'
import AccommodationSection from './GuestProfileModal/AccommodationSection'
import RentInformationSection from './GuestProfileModal/RentInformationSection'

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
    // Rent
    rentId: null,
    rent: '',
    basic: '',
    taxId: '',
    taxAmount: '',
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
      const baseProfile = room?.profile || (room?.firstName ? room : {})
      let fName = baseProfile.firstName || ''
      let lName = baseProfile.lastName || ''

      if (!fName && baseProfile.personalDetailName) {
        const parts = baseProfile.personalDetailName.split(' ')
        fName = parts[0] || ''
        lName = parts.slice(1).join(' ') || ''
      }

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
        taxAmount:
          room.rentDetails?.totalRental && room.rentDetails?.basic
            ? (Number(room.rentDetails.totalRental) - Number(room.rentDetails.basic)).toFixed(2)
            : '',
        totalRental: room.rentDetails?.totalRental || '',
        otherCharges: room.rentDetails?.otherCharges || '',
        discount: room.rentDetails?.discount || '',
        totalCharges: room.rentDetails?.totalCharges || '',
        payments: room.rentDetails?.payments || '',
        ccAuthorized: room.rentDetails?.ccAuthorized || '',
        deposite: room.rentDetails?.deposite || '',
        balance: room.rentDetails?.balance || '',
        folioNo: '',
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
                rentId: matchedRent?.id || initialForm.rentId,
                rent: matchedRent?.rent || initialForm.rent,
                basic: matchedRent?.basic || initialForm.basic,
                taxId: matchedRent?.taxId || initialForm.taxId,
                taxAmount:
                  matchedRent?.totalRental && matchedRent?.basic
                    ? (Number(matchedRent.totalRental) - Number(matchedRent.basic)).toFixed(2)
                    : initialForm.taxAmount,
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
              companyName: p.companyName || p.companyName,
              phone: p.phone,
              email: p.email,
              address: p.address,
              profilePhoto: p.profilePhoto,
              signature: p.signature,
              contactInformationTypeEnum: p.contactInformationTypeEnum,
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
        setDocumentDetails([])
        try {
          const res = await fetchFolioNo()
          const folioValue = typeof res === 'object' && res?.folioNo ? res.folioNo : res
          setFormData((prev) => ({ ...prev, ...initialForm, folioNo: String(folioValue || '') }))
        } catch {
          const fallbackFolio = '4382' + Date.now() + Math.floor(Math.random() * 1000)
          setFormData((prev) => ({ ...prev, ...initialForm, folioNo: fallbackFolio }))
        }
        return
      }
      setFormData((prev) => ({ ...prev, ...initialForm }))
    }
    loadData()
  }, [
    room,
    isOpen,
    fetchDocumentDetailsByPersonalDetailId,
    fetchFolioNo,
    fetchPersonalDetailById,
    guestDetails,
    rentDetails,
    stayDetails,
  ])

  useEffect(() => {
    if (!isOpen) setLocalPreviews({ profilePhoto: null, signature: null })
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
  const occupiedColor = occupiedStatus?.roomStatusColor?.trim() || '#2563eb'
  const currentStatusName = (room.statusDetails?.roomStatusName || '').toLowerCase()
  const isReserved =
    currentStatusName.includes('reserved') || currentStatusName.includes('reservation')

  const labelClass =
    'mb-1 block text-pms-tiny font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400'
  const inputContainerClass = 'group relative'
  const iconClass =
    'absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500'
  const inputClass =
    'w-full rounded-md border border-slate-200 bg-white py-1.5 pr-4 pl-10 text-xs font-semibold text-slate-800 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20 placeholder:text-slate-300'
  const cardClass =
    'rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700/50 dark:bg-slate-800/50'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
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

  const handleImageClear = (type) => {
    if (localPreviews[type]) URL.revokeObjectURL(localPreviews[type])
    setLocalPreviews((prev) => ({ ...prev, [type]: null }))
    setFormData((prev) => ({ ...prev, [type]: '' }))
  }

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
      if (typeof responseData === 'string' && responseData.includes(':'))
        fileName = responseData.substring(responseData.lastIndexOf(':') + 1).trim()
      setFormData((prev) => ({ ...prev, [type]: fileName }))
    } catch {
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
    if (targetProfileId) fetchDocumentDetailsByPersonalDetailId(targetProfileId)
    else {
      const updatedDocs = [...(formData.documents || [])]
      if (editingDocIndex >= 0) updatedDocs[editingDocIndex] = docData
      else updatedDocs.push(docData)
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
    } else
      setFormData((prev) => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }))
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
      let targetStatusName =
        (typeof forcedStatusName === 'string' ? forcedStatusName : null) ||
        formData.guestDetailsStatus ||
        'Reservation'
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
      let finalStatusColor = '#2F8B2C'
      if (targetStatus)
        finalStatusColor = (
          targetStatus.roomStatusColor ||
          targetStatus.bgColor ||
          targetStatus.color ||
          ''
        ).trim()
      if (!finalStatusColor)
        finalStatusColor = targetStatusName.toLowerCase().includes('reserv') ? '#2F8B2C' : '#2798e8'

      const personalPayload = {
        ...formData,
        contactInformationTypeEnum: formData.contactInformationTypeEnum || 'HOME',
        phone: formData.phone,
        mobileNumber: formData.phone,
        folioNo: formData.folioNo,
        crsFolioNo: formData.crsFolioNo,
        id: targetProfileId || 0,
      }
      const res =
        isExisting && targetProfileId
          ? await updatePersonalDetail(targetProfileId, personalPayload)
          : await addPersonalDetail(personalPayload)
      const finalProfileId = res?.data?.id || res?.data || targetProfileId

      let finalDocId = null
      if (formData.documents?.length > 0 && finalProfileId) {
        const docPromises = formData.documents.map(async (doc) => {
          const docPayload = {
            ...doc,
            personalDetails: { id: finalProfileId },
            personalDetailsId: finalProfileId,
          }
          const dRes = await addDocumentDetail(docPayload)
          return dRes?.data?.id || dRes?.data
        })
        const docIds = await Promise.all(docPromises)
        finalDocId = docIds[0]
      } else if (isExisting && documentDetails?.length > 0) finalDocId = documentDetails[0]?.id

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
      const rentRes = formData.rentId
        ? await updateRentDetail(formData.rentId, rentPayload)
        : await addRentDetail(rentPayload)
      const finalRentId = rentRes?.data?.id || rentRes?.data || formData.rentId

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
        personalDetailsId: finalProfileId,
        roomStatusId: finalStatusId,
      }
      const stayRes = await addStayDetail(stayPayload)
      const finalStayId = stayRes?.data?.id || stayRes?.data

      const guestPayload = {
        roomMasterId: Number(formData.roomMasterId || room.id),
        personalDetailsId: finalProfileId,
        documentDetailsId: finalDocId,
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
      if (formData.guestDetailId) await updateGuestDetail(formData.guestDetailId, guestPayload)
      else await addGuestDetail(guestPayload)

      if (finalStatusId) {
        const originalRoom =
          rawRooms.find((r) => String(r.id) === String(room.id)) || (room.roomName ? room : null)
        let newRoomStatusDisplay = originalRoom?.roomStatus || 'AVAILABLE'
        if (targetStatusName.toLowerCase().includes('reserv')) newRoomStatusDisplay = 'RESERVED'
        else if (
          targetStatusName.toLowerCase().includes('check') ||
          targetStatusName.toLowerCase().includes('occup')
        )
          newRoomStatusDisplay = 'OCCUPIED'
        if (originalRoom)
          await updateRoom(room.id, {
            ...originalRoom,
            roomStatusTableId: finalStatusId,
            roomStatusId: finalStatusId,
            roomStatusTable: { id: finalStatusId },
            roomStatus: newRoomStatusDisplay,
            personalDetailId: finalProfileId,
          })
      }
      if (onRefresh) await onRefresh()
      onClose()
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 print:fixed print:inset-0 print:bg-white print:p-0">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media print {
            @page { size: A4; margin: 10mm; }
            html, body { height: auto !important; background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body * { visibility: hidden; }
            #print-root, #print-root * { visibility: visible; }
            #print-root { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; height: auto !important; margin: 0 !important; padding: 0 !important; }
            ::-webkit-scrollbar { display: none !important; }
          }
        `,
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity print:hidden"
          onClick={onClose}
        ></motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-[0_48px_100px_-12px_rgba(0,0,0,0.3)] backdrop-blur-xl dark:bg-slate-900/95 print:hidden"
        >
          <form
            id="guestProfileForm"
            onSubmit={handleSubmit}
            className="flex h-full flex-col overflow-hidden"
          >
            <ModalHeader
              isDark={isDark}
              room={room}
              formData={formData}
              setFormData={setFormData}
              onClose={onClose}
            />

            <div className="flex-1 overflow-hidden">
              <div className="flex h-full flex-col overflow-hidden lg:flex-row">
                <IdentitySection
                  formData={formData}
                  handleChange={handleChange}
                  handleImageSelect={handleImageSelect}
                  handleImageClear={handleImageClear}
                  uploadingType={uploadingType}
                  cleanImageUrl={cleanImageUrl}
                  labelClass={labelClass}
                  inputContainerClass={inputContainerClass}
                  iconClass={iconClass}
                  inputClass={inputClass}
                  cardClass={cardClass}
                  toggleDocForm={toggleDocForm}
                  handleDeleteDocument={handleDeleteDocument}
                  documentDetails={documentDetails}
                  documentTypes={documentTypes}
                  profile={profile}
                  room={room}
                />

                <AccommodationSection
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  buildings={buildings}
                  floors={floors}
                  roomTypes={roomTypes}
                  rooms={rawRooms}
                  roomStatuses={roomStatuses}
                  isDark={isDark}
                />

                <RentInformationSection
                  formData={formData}
                  setFormData={setFormData}
                  taxes={taxes}
                  isDark={isDark}
                />
              </div>
            </div>

            <ActionFooter
              isSubmitting={isSubmitting}
              uploadingType={uploadingType}
              isReserved={isReserved}
              handleSubmit={handleSubmit}
              reservationColor={reservationColor}
              occupiedColor={occupiedColor}
              onClose={onClose}
            />
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

        {/* Moved outside the print:hidden container to ensure it renders during print */}
        <PrintTemplate formData={formData} room={room} />
      </div>
    </AnimatePresence>
  )
}

export default GuestProfileModal
