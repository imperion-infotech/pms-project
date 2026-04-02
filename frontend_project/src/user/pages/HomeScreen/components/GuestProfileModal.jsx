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
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import usePmsData from '../../../../hooks/usePmsData'
import { propertyService } from '../../../../services/propertyService'

// Sub-components
import ImageUpload from './roomAction/ImageUpload'

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
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingType, setUploadingType] = useState(null)

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
      const targetId = room?.profile?.id || room?.personalDetailId || room?.profileId || room?.id

      if (isOpen && targetId) {
        try {
          const response = await propertyService.getPersonalDetailById(targetId)
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
  }, [room, isOpen])

  if (!isOpen || !room) return null

  const profile = room.profile || (room.firstName ? room : {})
  const isExisting = !!(profile.id || room.profile || room.firstName)

  const currentStatusName = (room.statusDetails?.roomStatusName || '').toLowerCase()
  const isReserved =
    currentStatusName.includes('reserved') || currentStatusName.includes('reservation')

  // Shared classes for integrated form
  const inputContainerClass = `flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50'
      : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
  }`
  const labelClass =
    'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1'
  const inputClass =
    'bg-transparent border-none outline-none w-full text-sm font-bold text-slate-600 dark:text-slate-200'

  // Handle generic input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      const responseData = response.data.fileName || response.data

      let fileName = responseData
      if (typeof responseData === 'string' && responseData.includes(': ')) {
        fileName = responseData.split(': ')[1].trim()
      }

      setFormData((prev) => ({ ...prev, [type]: fileName }))
    } catch (err) {
      console.error('Image upload failed:', err)
      alert('Photo upload failed. Please try again.')
    } finally {
      setUploadingType(null)
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
      // Use profile.id if available, otherwise fallback to check if we can find it
      const targetProfileId = profile?.id || room?.personalDetailId

      const payload = {
        ...formData,
        id: isExisting ? targetProfileId : 0,
        roomId: room.id,
        roomName: room.roomName,
      }

      if (isExisting && targetProfileId) {
        await updatePersonalDetail(targetProfileId, payload)
      } else {
        await addPersonalDetail(payload)
      }

      // Automatically transition room status if triggered from "Check In" or "Reservation"
      if (forcedStatusName) {
        const targetStatus = roomStatuses.find((s) => {
          const name = (s.roomStatusName || '').toLowerCase()
          const short = (s.shortName || '').toLowerCase()
          const target = forcedStatusName.toLowerCase()

          // Special case: Reservation -> Reserved
          if (target === 'reservation') {
            return name.includes('reserv') || short.includes('res')
          }

          return name.includes(target) || short.includes(target)
        })

        if (targetStatus) {
          const originalRoom = rawRooms.find((r) => String(r.id) === String(room.id))
          if (originalRoom) {
            await updateRoom(room.id, {
              ...originalRoom,
              roomStatusTableId: targetStatus.id,
              roomStatusId: targetStatus.id,
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
          className={`relative my-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[40px] border shadow-2xl transition-all duration-300 md:flex-row ${isDark ? 'bg-surface-50 border-slate-800' : 'border-slate-200 bg-white'}`}
        >
          {/* LEFT SIDE: Media Sidebar (Verification & Identification) */}
          <div
            className={`flex w-full shrink-0 flex-col border-r p-6 md:w-[280px] ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}
          >
            {/* Sidebar Header */}
            <div className="mb-6 pl-2">
              <h3 className="text-xs font-black tracking-[0.2em] text-emerald-500 uppercase">
                Guest Assets
              </h3>
              <p
                className={`mt-1 text-[9px] font-bold tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
              >
                Verification Documents
              </p>
            </div>

            {/* Asset Collection - Vertically Scalable */}
            <div className="flex w-full flex-col gap-4">
              <ImageUpload
                label="Photo"
                value={localPreviews.profilePhoto || formData.profilePhoto}
                icon={User}
                isDark={isDark}
                aspect="aspect-square"
                onUpload={(file) => handleImageSelect(file, 'profilePhoto')}
                onClear={() => handleImageClear('profilePhoto')}
              />

              <ImageUpload
                label="Signature"
                value={localPreviews.signature || formData.signature}
                icon={Save}
                isDark={isDark}
                aspect="aspect-square"
                onUpload={(file) => handleImageSelect(file, 'signature')}
                onClear={() => handleImageClear('signature')}
              />
            </div>
          </div>

          {/* RIGHT SIDE: Guest Form Section */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Industrial Header Section */}
            <div
              className={`flex items-center justify-between border-b p-8 sm:px-12 sm:py-9 ${isDark ? 'border-slate-800 bg-slate-800/10' : 'border-slate-50 bg-white'}`}
            >
              <div className="flex items-center gap-6">
                {/* Brand/Status Icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                  <User className="h-7 w-7 text-white" />
                </div>

                {/* Title & Context */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2
                      className={`truncate text-xl font-black transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}
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
                    className={`mt-1.5 text-[9px] font-bold tracking-[0.2em] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
                  >
                    PMS Guest Information Core
                  </p>
                </div>
              </div>

              {/* Close Action */}
              <button
                onClick={onClose}
                className={`group flex items-center justify-center rounded-2xl border p-3.5 transition-all active:scale-95 ${isDark ? 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-emerald-400/30 hover:text-emerald-400' : 'border-slate-100 bg-white text-slate-400 hover:text-emerald-500 hover:shadow-md'}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-8 sm:px-12 sm:pb-12">
              <form id="guestProfileForm" onSubmit={handleSubmit} className="space-y-10">
                {/* Header for Guest Info */}
                <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
                  <div>
                    <h3
                      className={`text-xs font-black tracking-[0.2em] uppercase ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                    >
                      Guest Details
                    </h3>
                    <p className="mt-0.5 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                      Please provide accurate information
                    </p>
                  </div>
                </div>

                {/* Integrated Form Fields */}
                <div className="space-y-6">
                  {/* Name Group */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>First Name :</label>
                      <div className={inputContainerClass}>
                        <User size={18} className="text-slate-400" />
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
                        <User size={18} className="text-slate-400" />
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

                  {/* Company */}
                  <div>
                    <label className={labelClass}>Company Name</label>
                    <div className={inputContainerClass}>
                      <Building size={18} className="text-slate-400" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Company or Business name"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Contact Group */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <div className={inputContainerClass}>
                        <Phone size={18} className="text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Contact number"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <div className={inputContainerClass}>
                        <Mail size={18} className="text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email for communications"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelClass}>Permanent Address</label>
                    <div
                      className={`flex items-start gap-4 rounded-2xl border px-5 py-4 transition-all ${
                        isDark
                          ? 'border-slate-700 bg-slate-800/30 focus-within:border-emerald-500/50'
                          : 'border-slate-200 bg-slate-50 focus-within:border-emerald-500'
                      }`}
                    >
                      <MapPin size={18} className="mt-1 text-slate-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Full residential or business address"
                        rows="3"
                        className={`${inputClass} min-h-[90px] resize-none`}
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Buttons - Industrial Action Bar (Ordered Sequence) */}
            <div
              className={`flex items-center justify-end gap-4 border-t p-5 sm:px-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-white'}`}
            >
              {/* 1. Reservation Action */}
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'Reservation')}
                disabled={isSubmitting || uploadingType || isReserved}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg transition-all active:scale-95 ${isSubmitting || uploadingType || isReserved ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-orange-600 shadow-orange-500/20 hover:bg-orange-700'}`}
              >
                <CalendarCheck size={12} />
                <span>Reservation</span>
              </button>

              {/* 2. Check In Action */}
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'Occupied')}
                disabled={isSubmitting || uploadingType}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg transition-all active:scale-95 ${isSubmitting || uploadingType ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700'}`}
              >
                <CheckCircle size={12} />
                <span>Check In</span>
              </button>

              {/* 3. Update Action */}
              <button
                type="submit"
                form="guestProfileForm"
                disabled={isSubmitting || uploadingType}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg transition-all active:scale-95 ${isSubmitting || uploadingType ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700'}`}
              >
                <RefreshCw size={12} className={isSubmitting ? 'animate-spin' : ''} />
                <span>Update</span>
              </button>

              {/* 4. Change Room Action */}
              <button
                type="button"
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[9px] font-black tracking-widest uppercase transition-all active:scale-95 ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                <ArrowLeftRight size={12} />
                <span>Chg. Room</span>
              </button>

              {/* 5. Print Action */}
              <button
                type="button"
                onClick={() => window.print()}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[9px] font-black tracking-widest uppercase transition-all active:scale-95 ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                <Printer size={12} />
                <span>Print</span>
              </button>

              {/* 6. Close Action */}
              <button
                type="button"
                onClick={onClose}
                className={`ml-2 text-[9px] font-black tracking-widest uppercase transition-all ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default GuestProfileModal
