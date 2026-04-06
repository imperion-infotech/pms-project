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
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingType, setUploadingType] = useState(null)

  const [showDocForm, setShowDocForm] = useState(false)
  const [editingDocIndex, setEditingDocIndex] = useState(-1)

  // Synchronize component state with room data when modal opens
  useEffect(() => {
    if (room) {
      // Check for nested profile or flat fields on the room object
      const p = room.profile || room

      let fName = p.firstName || ''
      let lName = p.lastName || ''

      // Fallback: split personalDetailName if first/last name fields are empty
      if (!fName && p.personalDetailName) {
        const parts = p.personalDetailName.split(' ')
        fName = parts[0] || ''
        lName = parts.slice(1).join(' ') || ''
      }

      setFormData({
        firstName: fName,
        lastName: lName,
        companyName: p.companyName || '',
        phone: p.phone || '',
        email: p.email || '',
        address: p.address || '',
        profilePhoto: p.profilePhoto || '',
        signature: p.signature || '',
        // Initialize stay fields from the current room
        floorId: room.floorId || '',
        buildingId: room.buildingId || '',
        roomTypeId: room.roomTypeId || '',
        roomMasterId: room.id || '',
        comment: '',
        rateTypeEnum: 'RACK',
        noOfGuest: 1,
        stayStatusEnum: 'CONFIRMED',
      })
    } else {
      // Reset form for fresh entry
      setFormData({
        firstName: '',
        lastName: '',
        companyName: '',
        phone: '',
        email: '',
        address: '',
        profilePhoto: '',
        signature: '',
        documents: [],
      })
    }
  }, [room, isOpen])

  // Cleanup previews on modal close
  useEffect(() => {
    if (!isOpen) {
      if (localPreviews.profilePhoto) URL.revokeObjectURL(localPreviews.profilePhoto)
      if (localPreviews.signature) URL.revokeObjectURL(localPreviews.signature)
      setLocalPreviews({ profilePhoto: null, signature: null })
    }
  }, [isOpen, localPreviews.profilePhoto, localPreviews.signature])

  // FETCH FRESH DATA: Ensure we have the latest details from the API when opening
  useEffect(() => {
    const fetchLatestDetails = async () => {
      // Find the ID to fetch from multiple sources
      // FIXED: Removed room?.id fallback because room ID is not a personal detail ID
      const targetId = room?.profile?.id || room?.personalDetailId || room?.profileId

      if (isOpen && targetId) {
        try {
          const response = await fetchPersonalDetailById(targetId)
          const p = response.data

          if (p) {
            setFormData({
              firstName: p.firstName || '',
              lastName: p.lastName || '',
              companyName: p.companyName || '',
              phone: p.phone || '',
              email: p.email || '',
              address: p.address || '',
              profilePhoto: p.profilePhoto || '',
              signature: p.signature || '',
            })
          }
        } catch (err) {
          console.error('API Fetch Error:', err)
        }
      } else if (isOpen && room?.profile) {
        // Fallback to profile data from HomeScreen if API fetch target not found
        const p = room.profile
        setFormData({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          companyName: p.companyName || '',
          phone: p.phone || '',
          email: p.email || '',
          address: p.address || '',
          profilePhoto: p.profilePhoto || '',
          signature: p.signature || '',
        })
      }
    }

    fetchLatestDetails()
  }, [room, isOpen, fetchPersonalDetailById])

  // NEW: Synchronize document details when profile is loaded
  useEffect(() => {
    const targetId = room?.profile?.id || room?.personalDetailId || room?.profileId
    if (isOpen && targetId) {
      fetchDocumentDetailsByPersonalDetailId(targetId)
    } else if (isOpen) {
      setDocumentDetails([])
    }
  }, [room, isOpen, fetchDocumentDetailsByPersonalDetailId, setDocumentDetails])

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
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      alert('Missing required fields: Name, Phone, and Email are mandatory.')
      return
    }
    setIsSubmitting(true)
    try {
      const targetProfileId = profile?.id || room?.personalDetailId
      const payload = {
        ...formData,
        mobileNumber: formData.phone, // Map phone to mobileNumber for backend consistency
        id: isExisting ? targetProfileId : 0,
        roomId: room.id,
        roomName: room.roomName,
      }

      let finalProfileId = targetProfileId
      if (isExisting && targetProfileId) {
        await updatePersonalDetail(targetProfileId, payload)
      } else {
        const result = await addPersonalDetail(payload)
        // Link the newly created profile ID back to the room
        finalProfileId = result?.data?.id || result?.data
      }

      // 2. Save local documents if this was a new profile
      if (!isExisting && formData.documents?.length > 0 && finalProfileId) {
        for (const doc of formData.documents) {
          await addDocumentDetail({
            ...doc,
            personalDetailsId: finalProfileId,
          })
        }
      }

      // 3. Create Stay Detail
      const stayPayload = {
        floorId: formData.floorId ? Number(formData.floorId) : undefined,
        buildingId: formData.buildingId ? Number(formData.buildingId) : undefined,
        roomTypeId: formData.roomTypeId ? Number(formData.roomTypeId) : undefined,
        roomMasterId: formData.roomMasterId ? Number(formData.roomMasterId) : Number(room.id),
        comment: formData.comment,
        rateTypeEnum: formData.rateTypeEnum || 'RACK',
        noOfGuest: Number(formData.noOfGuest) || 1,
        stayStatusEnum: forcedStatusName
          ? forcedStatusName.toLowerCase().includes('reserv')
            ? 'RESERVED'
            : 'CONFIRMED'
          : formData.stayStatusEnum,
        personalDetailId: finalProfileId,
      }
      await addStayDetail(stayPayload)

      if (forcedStatusName) {
        const targetStatus = roomStatuses.find((s) => {
          const name = (s.roomStatusName || '').toLowerCase()
          const short = (s.shortName || '').toLowerCase()
          const target = forcedStatusName.toLowerCase()
          if (target === 'reservation') return name.includes('reserv') || short.includes('res')
          return name.includes(target) || short.includes(target)
        })

        if (targetStatus) {
          const originalRoom = rawRooms.find((r) => String(r.id) === String(room.id))
          if (originalRoom) {
            await updateRoom(room.id, {
              ...originalRoom,
              roomStatusTableId: targetStatus.id,
              roomStatusId: targetStatus.id,
              // ENHANCEMENT: Explicitly link guest to room for high-precision mapping
              personalDetailId: finalProfileId,
            })
          }
        }
      }
      if (onRefresh) onRefresh()
      onClose()
    } catch (err) {
      console.error('Operation failed:', err)
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
          className={`relative my-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[25px] border shadow-2xl transition-all duration-300 ${isDark ? 'bg-surface-50 border-slate-800' : 'border-slate-200 bg-white'}`}
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
            <form id="guestProfileForm" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5 md:flex-row">
                {/* Left Side: Guest Details & Documents */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-4">
                    {/* Guest Assets: Smaller and Horizontal */}
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

                    <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                      <div>
                        <h3
                          className={`text-[11px] font-black tracking-widest uppercase ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                        >
                          Guest Details
                        </h3>
                        <p className="mt-0.5 text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                          Please provide accurate information
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>First Name :</label>
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
                      </div>
                      <div>
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
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Phone Number</label>
                          <div className={inputContainerClass}>
                            <Phone size={16} className="text-slate-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Phone"
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Email Address</label>
                          <div className={inputContainerClass}>
                            <Mail size={16} className="text-slate-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Email"
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Permanent Address</label>
                        <div className={inputContainerClass}>
                          <MapPin size={14} className="text-slate-400" />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className={`${inputClass} min-h-[40px] resize-none`}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3 border-l-4 border-emerald-500 pl-3">
                        <div>
                          <h3
                            className={`text-[11px] font-black tracking-widest uppercase ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                          >
                            Documentation
                          </h3>
                          <p className="mt-0.5 text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                            Identification cards
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleDocForm()}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <div
                        className={`overflow-hidden rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-white'}`}
                      >
                        <table className="w-full text-left font-bold">
                          <thead>
                            <tr
                              className={`text-[10px] font-black tracking-widest text-slate-400 uppercase ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}
                            >
                              <th className="px-4 py-3">Action</th>
                              <th className="px-4 py-3">Doc & Images</th>
                              <th className="px-4 py-3">Number & Details</th>
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
                                  <tr
                                    key={doc.id || idx}
                                    className="group transition-colors hover:bg-emerald-50/10"
                                  >
                                    <td className="px-4 py-3">
                                      <div className="flex gap-3">
                                        <button
                                          type="button"
                                          onClick={() => toggleDocForm(idx)}
                                          className="text-slate-400 hover:text-emerald-500"
                                        >
                                          <Edit size={12} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDocument(doc, idx)}
                                          className="text-slate-400 hover:text-red-500"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                          <div className="h-7 w-10 overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                                            {doc.frontImagePath ? (
                                              <AuthImage
                                                src={`/user/${cleanImageUrl(doc.frontImagePath)}`}
                                                alt="Front"
                                                className="h-full w-full object-cover"
                                              />
                                            ) : (
                                              <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                <Camera size={10} />
                                              </div>
                                            )}
                                          </div>
                                          <div className="h-7 w-10 overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                                            {doc.backImagePath ? (
                                              <AuthImage
                                                src={`/user/${cleanImageUrl(doc.backImagePath)}`}
                                                alt="Back"
                                                className="h-full w-full object-cover"
                                              />
                                            ) : (
                                              <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                <Camera size={10} />
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-[10px] font-black uppercase">
                                            {docType?.documentTypeName || 'Unknown'}
                                          </div>
                                          {doc.validTill && (
                                            <div className="text-[7px] font-bold text-slate-400">
                                              Exp: {doc.validTill}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                        {doc.documentNumber}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })
                            ) : (
                              <tr>
                                <td
                                  colSpan="3"
                                  className="px-4 py-6 text-center text-[9px] font-black tracking-widest text-slate-400 uppercase"
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

                {/* Right Side: Stay Specifications */}
                <div className="w-full md:w-[300px]">
                  <StaySpecifications
                    formData={formData}
                    handleChange={handleChange}
                    buildings={buildings}
                    floors={floors}
                    roomTypes={roomTypes}
                    rooms={rawRooms}
                    isDark={isDark}
                  />
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
