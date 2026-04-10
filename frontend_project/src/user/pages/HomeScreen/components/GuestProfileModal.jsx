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
    addStayDetail, // Added stay detail creation
    documentDetails,
    setDocumentDetails,
    buildings,
    floors,
    roomTypes,
    taxes,
    addRentDetail,
    updateRentDetail,
    addGuestDetail,
    updateGuestDetail,
    fetchFolioNo,
  } = usePmsData()
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
    stayStatusEnum: 'CONFIRMED',
    // Temporal
    checkInId: null,
    guestDetailId: null,
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '',
    checkOutTime: '',
    guestDetailsStatus: 'Reservation',
    noOfDays: 1,
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
        floorId: room.floorId || '',
        buildingId: room.buildingId || '',
        roomTypeId: room.roomTypeId || '',
        roomMasterId: room.id || '',
        comment: '',
        rateTypeEnum: 'RACK',
        noOfGuest: 1,
        stayStatusEnum: 'CONFIRMED',
        checkInId: room.checkInId || null,
        guestDetailId: room.guestDetailId || null,
        checkInDate: room.checkInDate ? room.checkInDate.split('T')[0] : '',
        checkOutDate: room.checkOutDate ? room.checkOutDate.split('T')[0] : '',
        checkInTime: room.checkInTime || '',
        checkOutTime: room.checkOutTime || '',
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
      }

      // 2. Fetch Fresh Data if ID exists
      if (targetId) {
        try {
          const [profileRes] = await Promise.all([
            fetchPersonalDetailById(targetId),
            fetchDocumentDetailsByPersonalDetailId(targetId),
          ])

          if (profileRes?.data) {
            const p = profileRes.data
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
            })
            return
          }
        } catch (err) {
          console.error('Core Data Load Error:', err)
        }
      } else {
        // Only fetch folio if we don't have one and we're in creation mode
        setDocumentDetails([])
        if (!formData.folioNo) {
          try {
            const newFolio = await fetchFolioNo()
            setFormData((prev) => ({ ...prev, ...initialForm, folioNo: newFolio || '' }))
            return
          } catch (err) {
            console.warn('Folio fetch failed', err)
          }
        }
      }

      setFormData((prev) => ({ ...prev, ...initialForm }))
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, isOpen])

  // Cleanup previews on modal close
  useEffect(() => {
    if (!isOpen) {
      Object.values(localPreviews).forEach((p) => p && URL.revokeObjectURL(p))
      setLocalPreviews({ profilePhoto: null, signature: null })
    }
  }, [isOpen, localPreviews])

  if (!isOpen || !room) return null

  const profile = room.profile || (room.firstName ? room : {})
  const isExisting = !!(profile.id || room.profile || room.firstName)

  const currentStatusName = (room.statusDetails?.roomStatusName || '').toLowerCase()
  const isReserved =
    currentStatusName.includes('reserved') || currentStatusName.includes('reservation')

  // Shared classes for integrated form (Exactly like Admin Modal)
  const inputContainerClass = 'group relative'
  const iconClass =
    'absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500'
  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white py-1.5 pr-4 pl-10 text-xs font-semibold text-slate-800 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20 placeholder:text-slate-300'
  const labelClass =
    'mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400'
  const cardClass =
    'rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700/50 dark:bg-slate-800/50'

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

      const res =
        isExisting && targetProfileId
          ? await updatePersonalDetail(targetProfileId, personalPayload)
          : await addPersonalDetail(personalPayload)

      const finalProfileId = res?.data?.id || res?.data || targetProfileId

      // 2. Documents (only for new profiles)
      if (!isExisting && formData.documents?.length > 0 && finalProfileId) {
        await Promise.all(
          formData.documents.map((doc) =>
            addDocumentDetail({ ...doc, personalDetailsId: finalProfileId }),
          ),
        )
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
        stayStatusEnum: forcedStatusName?.toLowerCase().includes('reserv')
          ? 'RESERVED'
          : formData.stayStatusEnum || 'CONFIRMED',
        personalDetailId: finalProfileId,
      }
      const stayRes = await addStayDetail(stayPayload)
      const finalStayId = stayRes?.data?.id || stayRes?.data

      // 5. Guest Detail Integration
      const guestStatusValue = forcedStatusName || formData.guestDetailsStatus || 'Reservation'
      const guestPayload = {
        roomMasterId: Number(formData.roomMasterId || room.id),
        personalDetailsId: finalProfileId,
        rentDetailsId: finalRentId,
        stayDetailsId: finalStayId,
        checkInDate: formData.checkInDate
          ? formData.checkInDate.includes('T')
            ? formData.checkInDate
            : `${formData.checkInDate}T00:00:00.000Z`
          : null,
        checkOutDate: formData.checkOutDate
          ? formData.checkOutDate.includes('T')
            ? formData.checkOutDate
            : `${formData.checkOutDate}T00:00:00.000Z`
          : null,
        checkInTime: formData.checkInTime || '00:00:00',
        checkOutTime: formData.checkOutTime || '00:00:00',
        noOfDays: Number(formData.noOfDays) || 1,
        guestDetailsStatus: guestStatusValue,
      }

      if (formData.guestDetailId) {
        await updateGuestDetail(formData.guestDetailId, guestPayload)
      } else {
        await addGuestDetail(guestPayload)
      }

      // 6. Final Room Status Update
      if (forcedStatusName) {
        const targetStatus = roomStatuses.find((s) => {
          const name = (s.roomStatusName || '').toLowerCase()
          const short = (s.shortName || '').toLowerCase()
          const target = forcedStatusName.toLowerCase()
          return target === 'reservation'
            ? name.includes('reserv') || short.includes('res')
            : name.includes(target) || short.includes(target)
        })

        if (targetStatus) {
          const originalRoom = rawRooms.find((r) => String(r.id) === String(room.id))
          if (originalRoom) {
            await updateRoom(room.id, {
              ...originalRoom,
              roomStatusTableId: targetStatus.id,
              roomStatusId: targetStatus.id,
              personalDetailId: finalProfileId,
            })
          }
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
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative z-10 flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/20 bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] dark:bg-slate-900"
        >
          <form
            id="guestProfileForm"
            onSubmit={handleSubmit}
            className="flex h-full flex-col overflow-hidden"
          >
            {/* Header */}
            <div
              className={`flex shrink-0 items-center justify-between border-b p-4 sm:px-8 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-white/80'} backdrop-blur-md`}
            >
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/20">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
                    {isExisting ? 'Update' : 'Create'}{' '}
                    <span className="text-blue-500">Guest Profile</span>
                  </h2>
                  <div className="mt-0.5 flex items-center gap-2 text-left">
                    <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Comprehensive Check-in & Allotment • RM {room.roomName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-6 rounded-2xl px-6 py-3 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                >
                  <div
                    className="flex cursor-pointer flex-col items-end transition-opacity hover:opacity-80 active:scale-95"
                    onClick={() => {
                      const randomFolio =
                        Math.floor(Math.random() * 900000000000000) + 100000000000000
                      setFormData((prev) => ({ ...prev, folioNo: String(randomFolio) }))
                    }}
                    title="Click to generate random folio"
                  >
                    <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                      Folio No.
                    </span>
                    <input
                      type="text"
                      value={formData.folioNo || ''}
                      readOnly
                      className="cursor-pointer bg-transparent text-right text-xs font-black text-blue-600 outline-none dark:text-blue-400"
                      placeholder="—"
                    />
                  </div>
                  <div className={`h-8 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
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
                  <div className="flex items-center gap-3 px-8 py-5 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                      <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-[11px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                      Part 1: Identity & Docs
                    </h3>
                  </div>
                  <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-8 pb-8">
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
                                <span className="mt-1 text-[8px] font-bold tracking-wider uppercase">
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
                                <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
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
                        <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">
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
                          <label className="text-[9px] font-bold text-slate-400 uppercase">
                            Contact Info Type
                          </label>
                          <select
                            name="contactInformationTypeEnum"
                            value={formData.contactInformationTypeEnum}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                          <label className="text-[9px] font-bold text-slate-400 uppercase">
                            {formData.contactInformationTypeEnum} Full Address{' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            required
                            rows="2"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-all outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            placeholder="Address details..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Documentation Table */}
                    <div className="rounded-2xl border border-blue-100/50 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
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
                      <div className="overflow-hidden rounded-xl border border-blue-100/50 bg-white dark:border-blue-900/20 dark:bg-slate-900">
                        <table className="w-full text-left font-bold">
                          <thead className="bg-blue-50/50 dark:bg-blue-900/20">
                            <tr className="text-[9px] font-black tracking-wider text-slate-400 uppercase">
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
                                  <tr key={doc.id || idx} className="text-[10px]">
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
                                      <div className="text-[9px] text-slate-400">
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
                                  className="px-3 py-4 text-center text-[9px] font-bold text-slate-400"
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
                  <div className="flex items-center gap-3 px-8 py-5 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                      <CalendarCheck size={16} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-[11px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                      Part 2: Guest Info & Stay Selection
                    </h3>
                  </div>
                  <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto px-8 pb-8">
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase">
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
                              const d = new Date(start)
                              d.setDate(d.getDate() + days)
                              updated.checkOutDate = d.toISOString().split('T')[0]
                              updated.noOfDays = days
                            }
                          } else if (name === 'checkOutDate') {
                            if (formData.checkInDate && value) {
                              const start = new Date(formData.checkInDate)
                              const end = new Date(value)
                              const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
                              updated.noOfDays = diff >= 0 ? diff : 0
                            }
                          }
                          setFormData(updated)
                        }}
                        isDark={isDark}
                      />
                    </div>

                    <div className="rounded-2xl border border-amber-100/50 bg-amber-50/50 p-5 dark:border-amber-900/20 dark:bg-amber-900/5">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase dark:text-amber-400">
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
                        isDark={isDark}
                        showStatus={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Column 3: Rent Details */}
                <div className="flex w-full flex-col bg-slate-50 transition-all lg:w-[22%] dark:bg-slate-900/50">
                  <div className="flex items-center gap-3 px-6 py-5 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                      <Receipt size={16} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-[11px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                      Part 3: Rent Details
                    </h3>
                  </div>
                  <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto px-6 pb-8">
                    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-500/5 dark:border-emerald-900/20 dark:bg-slate-900">
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
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[10px] font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${isSubmitting || uploadingType || isReserved ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-orange-600 shadow-orange-500/30 hover:bg-orange-700 hover:shadow-orange-500/40'}`}
              >
                <CalendarCheck size={14} />
                <span>Reservation</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'Occupied')}
                disabled={isSubmitting || uploadingType}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[10px] font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${isSubmitting || uploadingType ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40'}`}
              >
                <CheckCircle size={14} />
                <span>Check In</span>
              </button>

              <button
                type="submit"
                form="guestProfileForm"
                disabled={isSubmitting || uploadingType}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[10px] font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${isSubmitting || uploadingType ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-indigo-600 shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40'}`}
              >
                <RefreshCw size={14} className={isSubmitting ? 'animate-spin' : ''} />
                <span>Update Profile</span>
              </button>

              <div className="mx-2 h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <ArrowLeftRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <Printer size={16} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-red-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
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
