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
  Plus,
  Trash2,
  Edit,
  Camera,
  Paperclip,
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
            fetchDocumentDetailsByPersonalDetailId(targetId)
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
            })
            return // Successfully loaded fresh data
          }
        } catch (err) {
          console.error('Core Data Load Error:', err)
        }
      } else {
        setDocumentDetails([])
      }

      setFormData(initialForm)
    }

    loadData()
  }, [room, isOpen, fetchPersonalDetailById, fetchDocumentDetailsByPersonalDetailId, setDocumentDetails])

  // Cleanup previews on modal close
  useEffect(() => {
    if (!isOpen) {
      Object.values(localPreviews).forEach(p => p && URL.revokeObjectURL(p))
      setLocalPreviews({ profilePhoto: null, signature: null })
    }
  }, [isOpen, localPreviews])

  if (!isOpen || !room) return null

  const profile = room.profile || (room.firstName ? room : {})
  const isExisting = !!(profile.id || room.profile || room.firstName)

  const currentStatusName = (room.statusDetails?.roomStatusName || '').toLowerCase()
  const isReserved =
    currentStatusName.includes('reserved') || currentStatusName.includes('reservation')

  // Shared classes for integrated form
  const inputContainerClass = `flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50'
      : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
  }`
  const labelClass =
    'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1'
  const inputClass =
    'bg-transparent border-none outline-none w-full text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-300'

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
    const missing = requiredFields.filter(f => !formData[f])
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
        id: targetProfileId || 0
      }

      const res = isExisting && targetProfileId 
        ? await updatePersonalDetail(targetProfileId, personalPayload)
        : await addPersonalDetail(personalPayload)
      
      const finalProfileId = res?.data?.id || res?.data || targetProfileId

      // 2. Documents (only for new profiles)
      if (!isExisting && formData.documents?.length > 0 && finalProfileId) {
        await Promise.all(formData.documents.map(doc => 
          addDocumentDetail({ ...doc, personalDetailsId: finalProfileId })
        ))
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
        stayStatusEnum: forcedStatusName?.toLowerCase().includes('reserv') ? 'RESERVED' : (formData.stayStatusEnum || 'CONFIRMED'),
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
        checkInDate: formData.checkInDate ? (formData.checkInDate.includes('T') ? formData.checkInDate : `${formData.checkInDate}T00:00:00.000Z`) : null,
        checkOutDate: formData.checkOutDate ? (formData.checkOutDate.includes('T') ? formData.checkOutDate : `${formData.checkOutDate}T00:00:00.000Z`) : null,
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
        const targetStatus = roomStatuses.find(s => {
          const name = (s.roomStatusName || '').toLowerCase()
          const short = (s.shortName || '').toLowerCase()
          const target = forcedStatusName.toLowerCase()
          return target === 'reservation' ? (name.includes('reserv') || short.includes('res')) : (name.includes(target) || short.includes(target))
        })

        if (targetStatus) {
          const originalRoom = rawRooms.find(r => String(r.id) === String(room.id))
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
      <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          className={`relative my-auto flex w-full max-w-7xl flex-col overflow-hidden rounded-[40px] border shadow-2xl transition-all duration-300 ${isDark ? 'bg-surface-50 border-slate-800' : 'border-slate-200 bg-white'}`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between border-b p-4 sm:px-8 sm:py-5 ${isDark ? 'border-slate-800 bg-slate-800/10' : 'border-slate-50 bg-white'}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    className={`truncate text-lg font-black transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}
                  >
                    {isExisting ? 'UPDATE' : 'CREATE'}{' '}
                    <span className="text-emerald-500">PROFILE</span>
                  </h2>
                  <div
                    className={`shrink-0 rounded-full border px-3 py-1 text-[9px] font-black tracking-widest uppercase ${isDark ? 'border-slate-700 bg-slate-800/50 text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-500'}`}
                  >
                    RM {room.roomName}
                  </div>
                </div>
                <p
                  className={`mt-1 text-[8px] font-bold tracking-[0.2em] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
                >
                  PMS Guest Information Core
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`group flex items-center justify-center rounded-xl border p-3 transition-all active:scale-95 ${isDark ? 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-emerald-400/30 hover:text-emerald-400' : 'border-slate-100 bg-white text-slate-400 hover:text-emerald-500 hover:shadow-md'}`}
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:px-6 sm:pb-6">
            <form id="guestProfileForm" onSubmit={handleSubmit} className="flex h-full flex-col overflow-hidden">
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Column 1: Identity & Documentation */}
                <div className="scrollbar-hide flex w-full flex-col border-b border-slate-200 bg-white transition-all lg:w-[32%] lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-900">
                  <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4">
                    {/* Guest Assets */}
                    <div className="grid grid-cols-2 gap-3">
                      <ImageUpload
                        label="Photo"
                        value={formData.profilePhoto}
                        icon={User}
                        isDark={isDark}
                        aspect="aspect-[2.5/1]"
                        onUpload={(file) => handleImageSelect(file, 'profilePhoto')}
                        onClear={() => handleImageClear('profilePhoto')}
                        renderCustomPreview={(val) => (
                          <AuthImage
                            src={`/user/${cleanImageUrl(val)}`}
                            alt="Photo"
                            className="h-full w-full object-cover"
                          />
                        )}
                      />
                      <ImageUpload
                        label="Signature"
                        value={formData.signature}
                        icon={Save}
                        isDark={isDark}
                        aspect="aspect-[2.5/1]"
                        onUpload={(file) => handleImageSelect(file, 'signature')}
                        onClear={() => handleImageClear('signature')}
                        renderCustomPreview={(val) => (
                          <AuthImage
                            src={`/user/${cleanImageUrl(val)}`}
                            alt="Signature"
                            className="max-h-full"
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                        <h3 className={`text-[11px] font-black tracking-widest uppercase ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          Background Info
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>First Name</label>
                          <div className={inputContainerClass}>
                            <User size={16} className="text-slate-400" />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="First name"
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Last Name</label>
                          <div className={inputContainerClass}>
                            <User size={16} className="text-slate-400" />
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder="Last name"
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>Company Name</label>
                          <div className={inputContainerClass}>
                            <Building size={16} className="text-slate-400" />
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleChange}
                              placeholder="Company name"
                              className={inputClass}
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>Contact Information Type</label>
                          <div className={inputContainerClass}>
                            <ArrowLeftRight size={14} className="text-slate-400" />
                            <select
                              name="contactInformationTypeEnum"
                              value={formData.contactInformationTypeEnum}
                              onChange={handleChange}
                              className={inputClass + " cursor-pointer"}
                            >
                              <option value="HOME">HOME</option>
                              <option value="OFFICE">OFFICE</option>
                              <option value="OTHER">OTHER</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>{formData.contactInformationTypeEnum} Phone Number</label>
                          <div className={inputContainerClass}>
                            <Phone size={16} className="text-slate-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder={formData.contactInformationTypeEnum === 'HOME' ? "Personal Phone" : "Work Phone"}
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>{formData.contactInformationTypeEnum} Email Address</label>
                          <div className={inputContainerClass}>
                            <Mail size={16} className="text-slate-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder={formData.contactInformationTypeEnum === 'HOME' ? "Personal Email" : "Work Email"}
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>{formData.contactInformationTypeEnum} Full Address</label>
                          <div className={inputContainerClass}>
                            <MapPin size={14} className="text-slate-400" />
                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              placeholder={formData.contactInformationTypeEnum === 'HOME' ? "Residence Address" : "Office Address"}
                              className={`${inputClass} min-h-[40px] resize-none`}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Documentation Section */}
                      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-3 border-l-4 border-emerald-500 pl-3">
                          <h3 className={`text-[11px] font-black tracking-widest uppercase ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            ID Documents
                          </h3>
                          <button
                            type="button"
                            onClick={() => toggleDocForm()}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className={`overflow-hidden rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-white'}`}>
                          <table className="w-full text-left font-bold">
                            <thead>
                              <tr className={`text-[10px] font-black tracking-widest text-slate-400 uppercase ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Details</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {(profile?.id || room?.personalDetailId ? documentDetails : formData.documents || []).length > 0 ? (
                                (profile?.id || room?.personalDetailId ? documentDetails : formData.documents || []).map((doc, idx) => {
                                  const docType = documentTypes.find((t) => String(t.id) === String(doc.documentTypeId))
                                  return (
                                    <tr key={doc.id || idx} className="group transition-colors hover:bg-emerald-50/10">
                                      <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                          <button type="button" onClick={() => toggleDocForm(idx)} className="text-slate-400 hover:text-emerald-500">
                                            <Edit size={12} />
                                          </button>
                                          <button type="button" onClick={() => handleDeleteDocument(doc, idx)} className="text-slate-400 hover:text-red-500">
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-200">
                                          {docType?.documentTypeName || 'Unknown'}
                                        </div>
                                        <div className="font-mono text-[9px] font-bold text-slate-400">
                                          {doc.documentNumber}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })
                              ) : (
                                <tr>
                                  <td colSpan="2" className="px-4 py-6 text-center text-[9px] font-black tracking-widest text-slate-400 uppercase">
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
                </div>

                {/* Column 2: Guest Info & Stay Selection */}
                <div className="scrollbar-hide flex w-full flex-col border-b border-slate-200 bg-slate-50/50 transition-all lg:w-[46%] lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-800/20">
                  <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4">
                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                           <CalendarCheck size={16} className="text-amber-600 dark:text-amber-400" />
                         </div>
                         <h3 className="text-[11px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                           Guest Information
                         </h3>
                      </div>
                      <GuestInformation
                        formData={formData}
                        handleChange={(e) => {
                          const { name, value } = e.target
                          let updated = { ...formData, [name]: value }
                          if (name === 'noOfDays' || name === 'checkInDate') {
                            const days = parseInt(name === 'noOfDays' ? value : formData.noOfDays || 1) || 1
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

                    <div className="rounded-2xl border border-amber-100/50 bg-amber-50/50 p-4 dark:border-amber-900/20 dark:bg-amber-900/10">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                           <Building size={16} className="text-amber-600 dark:text-amber-400" />
                         </div>
                         <h3 className="text-[11px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                           Stay Details
                         </h3>
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

                {/* Column 3: Rent / Financial Details */}
                <div className="scrollbar-hide relative flex w-full flex-col bg-emerald-50/30 transition-all lg:w-[22%] dark:bg-emerald-900/5">
                  <div className="scrollbar-hide flex-1 overflow-y-auto p-4">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                         <FileText size={16} className="text-emerald-600 dark:text-emerald-400" />
                       </div>
                       <h3 className="text-[11px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                         Rent Details
                       </h3>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg shadow-emerald-500/5 dark:border-emerald-900/30 dark:bg-slate-900">
                      <RentDetails
                        formData={formData}
                        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        taxes={taxes}
                        isDark={isDark}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div
            className={`flex items-center justify-end gap-4 border-t p-5 sm:px-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-white'}`}
          >
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'Reservation')}
              disabled={isSubmitting || uploadingType || isReserved}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg transition-all active:scale-95 ${isSubmitting || uploadingType || isReserved ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-orange-600 shadow-orange-500/20 hover:bg-orange-700'}`}
            >
              <CalendarCheck size={12} />
              <span>Reservation</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'Occupied')}
              disabled={isSubmitting || uploadingType}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg transition-all active:scale-95 ${isSubmitting || uploadingType ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700'}`}
            >
              <CheckCircle size={12} />
              <span>Check In</span>
            </button>

            <button
              type="submit"
              form="guestProfileForm"
              disabled={isSubmitting || uploadingType}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg transition-all active:scale-95 ${isSubmitting || uploadingType ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700'}`}
            >
              <RefreshCw size={12} className={isSubmitting ? 'animate-spin' : ''} />
              <span>Update</span>
            </button>

            <button
              type="button"
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[9px] font-black tracking-widest uppercase transition-all active:scale-95 ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <ArrowLeftRight size={12} />
              <span>Chg. Room</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[9px] font-black tracking-widest uppercase transition-all active:scale-95 ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <Printer size={12} />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`ml-2 text-[9px] font-black tracking-widest uppercase transition-all ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Close
            </button>
          </div>
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
