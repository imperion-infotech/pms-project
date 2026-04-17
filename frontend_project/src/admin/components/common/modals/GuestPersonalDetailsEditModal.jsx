import React, { useState, useEffect } from 'react'
import {
  X,
  User,
  Building,
  Phone,
  Mail,
  Camera,
  Pen as SignatureIcon,
  Loader2,
  Save,
  ShieldCheck,
  BedDouble,
  Receipt,
  CalendarCheck,
  CheckCircle,
  RefreshCw,
  ArrowLeftRight,
  Printer,
  Plus,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthImage } from '../AuthImage'
import GuestInformation from '../../../../components/common/GuestInformation'
import StaySpecifications from '../../../../components/common/StaySpecifications'
import RentDetails from '../../../../components/common/RentDetails'

export const GuestPersonalDetailsEditModal = ({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  handleSubmit,
  handleFileUpload,
  uploadingType,
  documentTypes,
  buildings = [],
  floors = [],
  roomTypes = [],
  rooms = [],
  roomStatuses = [],
  rentDetails = [],
  taxes = [],
  loading,
}) => {
  const [localPreviews, setLocalPreviews] = useState({ photo: null, signature: null })

  // Sync / Reset local previews when modal opens
  useEffect(() => {
    if (!isOpen) {
      if (localPreviews.photo) URL.revokeObjectURL(localPreviews.photo)
      if (localPreviews.signature) URL.revokeObjectURL(localPreviews.signature)
      setTimeout(() => setLocalPreviews({ photo: null, signature: null }), 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const cleanImageUrl = (path) => {
    if (!path || path === 'photo' || path === 'sign') return null
    let cleanPath = String(path)
    if (cleanPath.includes(': ')) cleanPath = cleanPath.split(': ')[1].trim()
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1)
    const parts = cleanPath.split('/')
    return parts[parts.length - 1] // Only the filename
  }

  const handlePreviewUpload = (e, type) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create local preview immediately
      const url = URL.createObjectURL(file)
      setLocalPreviews((prev) => {
        if (prev[type]) URL.revokeObjectURL(prev[type])
        return { ...prev, [type]: url }
      })
    }
    handleFileUpload(e, type)
  }

  // Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Safety Net: Auto-fill Building, Floor, and Room Type if Room is selected but they are missing
  useEffect(() => {
    if (isOpen && formData.roomMasterId && rooms.length > 0) {
      const currentRoom = rooms.find((r) => String(r.id) === String(formData.roomMasterId))
      if (currentRoom) {
        setFormData((prev) => {
          const updates = {}
          // Check for buildingId, floorId, and roomTypeId in various casing formats
          const bId = currentRoom.buildingId || currentRoom.building?.id || currentRoom.building_id
          const fId = currentRoom.floorId || currentRoom.floor?.id || currentRoom.floor_id
          const rtId =
            currentRoom.roomTypeId || currentRoom.roomType?.id || currentRoom.room_type_id
          const rsId =
            currentRoom.roomStatusId || currentRoom.roomStatus?.id || currentRoom.room_status_id

          if (!prev.buildingId && bId) updates.buildingId = bId
          if (!prev.floorId && fId) updates.floorId = fId
          if (!prev.roomTypeId && rtId) updates.roomTypeId = rtId
          if (!prev.roomStatusId && rsId) updates.roomStatusId = rsId

          if (Object.keys(updates).length > 0) {
            return { ...prev, ...updates }
          }
          return prev
        })
      }
    }
  }, [isOpen, formData.roomMasterId, rooms, setFormData])

  if (!isOpen) return null

  // Determine source: Local preview takes precedence during upload/session
  const photoSrc =
    localPreviews.photo ||
    (cleanImageUrl(formData.profilePhoto) ? `/user/${cleanImageUrl(formData.profilePhoto)}` : null)
  const signatureSrc =
    localPreviews.signature ||
    (cleanImageUrl(formData.signature) ? `/user/${cleanImageUrl(formData.signature)}` : null)

  // Premium UI Classes (Matching GuestProfileModal)
  const inputContainerClass = 'group relative'
  const iconClass =
    'absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500'
  const inputClass =
    'w-full rounded-md border border-slate-200 bg-white py-1.5 pr-4 pl-10 text-xs font-semibold text-slate-800 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20 placeholder:text-slate-300'
  const labelClass =
    'mb-1 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400'
  const cardClass =
    'rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700/50 dark:bg-slate-800/50'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        ></motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-[0_48px_100px_-12px_rgba(0,0,0,0.3)] backdrop-blur-xl dark:bg-slate-900/95"
        >
          <form onSubmit={handleSubmit} className="flex h-full flex-col overflow-hidden">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white/40 p-4 shadow-sm sm:px-8 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-center gap-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/20">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
                    Update <span className="text-blue-500">Guest Profile</span>
                  </h2>
                  <div className="mt-0.5 flex items-center gap-2 text-left">
                    <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Comprehensive Check-in & Allotment
                      {rooms.find((r) => String(r.id) === String(formData.roomMasterId)) && (
                        <span>
                          {' '}
                          • RM{' '}
                          {
                            rooms.find((r) => String(r.id) === String(formData.roomMasterId))
                              .roomName
                          }
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-6 rounded-lg bg-slate-50 px-4 py-2 dark:bg-slate-800/50">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
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
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                      CRS Folio No.
                    </span>
                    <input
                      type="text"
                      value={formData.crsFolioNo || ''}
                      onChange={(e) => setFormData({ ...formData, crsFolioNo: e.target.value })}
                      className="w-24 bg-transparent text-right text-xs font-black text-slate-800 outline-none focus:text-blue-600 dark:text-white dark:focus:text-blue-400"
                      placeholder="Enter No."
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                    <h3 className="text-[9px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                      Part 1: Identity & Docs
                    </h3>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* Asset Capture */}
                    <div className={cardClass}>
                      <div className="flex items-start gap-3">
                        <div className="group relative">
                          <div className="h-24 w-24 overflow-hidden rounded-[20px] border-4 border-white bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-900">
                            {photoSrc ? (
                              <AuthImage
                                src={photoSrc}
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
                            {uploadingType === 'photo' && (
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
                              onChange={(e) => handlePreviewUpload(e, 'photo')}
                            />
                          </label>
                        </div>

                        <div className="flex h-24 flex-1 flex-col justify-end space-y-2">
                          <div className="group relative flex-1 rounded-[18px] border-2 border-dashed border-slate-200 bg-white p-1.5 text-center transition-colors hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800">
                            {signatureSrc ? (
                              <div className="relative flex h-full items-center justify-center">
                                <AuthImage
                                  src={signatureSrc}
                                  alt="Signature"
                                  className="max-h-full object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, signature: '' })
                                    if (localPreviews.signature)
                                      URL.revokeObjectURL(localPreviews.signature)
                                    setLocalPreviews((prev) => ({ ...prev, signature: null }))
                                  }}
                                  className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1.5 text-red-500 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center">
                                <SignatureIcon size={20} className="mb-1 text-slate-300" />
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
                                onChange={(e) => handlePreviewUpload(e, 'signature')}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                      <div className="mb-2 mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-black tracking-widest text-blue-500 uppercase">
                          Background Info
                        </span>
                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                        <div>
                          <label className={labelClass}>
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({ ...formData, firstName: e.target.value })
                            }
                            className={inputClass.replace('pl-10', 'px-3')}
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className={inputClass.replace('pl-10', 'px-3')}
                            placeholder="Doe"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>Company Name</label>
                          <div className={inputContainerClass}>
                            <Building size={14} className={iconClass} />
                            <input
                              type="text"
                              value={formData.companyName}
                              onChange={(e) =>
                                setFormData({ ...formData, companyName: e.target.value })
                              }
                              className={inputClass}
                              placeholder="Company Ltd."
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>Contact Info Type</label>
                          <select
                            value={formData.contactInformationTypeEnum}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contactInformationTypeEnum: e.target.value,
                              })
                            }
                            className={inputClass.replace('pl-10', 'px-3')}
                          >
                            <option value="HOME">HOME</option>
                            <option value="OFFICE">OFFICE</option>
                            <option value="OTHER">OTHER</option>
                          </select>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <div className={inputContainerClass}>
                            <Phone size={14} className={iconClass} />
                            <input
                              required
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                  mobileNumber: e.target.value,
                                })
                              }
                              className={inputClass}
                              placeholder="Phone"
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>
                            Email <span className="text-red-500">*</span>
                          </label>
                          <div className={inputContainerClass}>
                            <Mail size={14} className={iconClass} />
                            <input
                              required
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className={inputClass}
                              placeholder="Email"
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>
                            Full Address <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            required
                            rows="2"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            placeholder="Address"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Verification Documents */}
                    <div className="rounded-lg border border-blue-100/50 bg-blue-50/20 p-3 dark:border-blue-900/30 dark:bg-blue-900/10">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[9px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
                          ID Documents
                        </span>
                        <div className="h-px flex-1 bg-blue-200/50 dark:bg-blue-800/50"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                        <div>
                          <label className={labelClass}>
                            Doc Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={formData.documentTypeId}
                            onChange={(e) =>
                              setFormData({ ...formData, documentTypeId: e.target.value })
                            }
                            className={inputClass.replace('pl-10', 'px-3')}
                          >
                            <option value="">Select</option>
                            {documentTypes?.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.documentTypeName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>
                            Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={formData.documentNumber}
                            onChange={(e) =>
                              setFormData({ ...formData, documentNumber: e.target.value })
                            }
                            className={inputClass.replace('pl-10', 'px-3')}
                            placeholder="ID No."
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Valid Until</label>
                          <input
                            type="date"
                            value={formData.validTill}
                            onChange={(e) => setFormData({ ...formData, validTill: e.target.value })}
                            className={inputClass.replace('pl-10', 'px-3')}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Remarks</label>
                          <input
                            type="text"
                            value={formData.remark}
                            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                            className={inputClass.replace('pl-10', 'px-3')}
                            placeholder="Optional"
                          />
                        </div>
                        <div className="col-span-2 mt-1 grid grid-cols-2 gap-2">
                          <label className="relative flex min-h-[70px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-white p-2 text-center transition-colors hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800/50">
                            {formData.frontImagePath ? (
                              <div className="absolute inset-1">
                                <AuthImage
                                  src={`/user/${cleanImageUrl(formData.frontImagePath)}`}
                                  alt="Front"
                                  className="h-full w-full rounded object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Plus size={16} className="mb-0.5 text-slate-300" />
                                <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                                  Front
                                </span>
                              </div>
                            )}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'front')}
                            />
                          </label>

                          <label className="relative flex min-h-[70px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-white p-2 text-center transition-colors hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800/50">
                            {formData.backImagePath ? (
                              <div className="absolute inset-1">
                                <AuthImage
                                  src={`/user/${cleanImageUrl(formData.backImagePath)}`}
                                  alt="Back"
                                  className="h-full w-full rounded object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Plus size={16} className="mb-0.5 text-slate-300" />
                                <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                                  Back
                                </span>
                              </div>
                            )}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'back')}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Guest Details & Stay */}
                <div className="flex w-full flex-col border-b border-slate-100 bg-slate-50/30 transition-all lg:w-[46%] lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-800/20">
                  <div className="flex items-center gap-2 px-3 py-1.5 text-left">
                    <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <BedDouble size={10} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-[9px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                      Part 2: Guest Info & Stay
                    </h3>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                          } else if (name === 'guestDetailsStatus') {
                            if (value === 'Reservation') updated.color = '#2F8B2C'
                            if (value === 'Check-In') updated.color = '#ffa500'
                          }
                          setFormData(updated)
                        }}
                        isDark={false}
                      />
                    </div>

                    <div className="rounded-xl border border-amber-100/50 bg-amber-50/20 p-3 dark:border-amber-900/20 dark:bg-amber-900/10">
                      <StaySpecifications
                        formData={formData}
                        handleChange={(e) => {
                          const { name, value } = e.target
                          const val = name === 'noOfGuest' ? parseInt(value) || 1 : value
                          setFormData({ ...formData, [name]: val })
                        }}
                        buildings={buildings}
                        floors={floors}
                        roomTypes={roomTypes}
                        rooms={rooms}
                        roomStatuses={roomStatuses}
                        rentDetails={rentDetails}
                        isDark={false}
                        showStatus={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Column 3: Rent Details */}
                <div className="relative flex w-full flex-col bg-emerald-50/20 transition-all lg:w-[22%] dark:bg-emerald-900/5">
                  <div className="absolute inset-y-0 left-0 hidden w-px bg-linear-to-b from-transparent via-emerald-200 to-transparent lg:block dark:via-emerald-500/10"></div>

                  <div className="flex items-center gap-2 px-3 py-1.5 text-left">
                    <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <Receipt size={10} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-[9px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                      Part 3: Rent Details
                    </h3>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white p-3 shadow-sm dark:border-emerald-900/30 dark:bg-slate-900">
                      <RentDetails
                        formData={formData}
                        handleChange={(e) =>
                          setFormData({ ...formData, [e.target.name]: e.target.value })
                        }
                        taxes={taxes}
                        isDark={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t bg-slate-50/40 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={(e) => {
                  const rs = roomStatuses?.find(
                    (s) =>
                      s.roomStatusName?.toLowerCase() === 'reservation' ||
                      s.roomStatusName?.toLowerCase() === 'reserved' ||
                      s.shortName?.toLowerCase() === 'res',
                  )
                  setFormData({
                    ...formData,
                    guestDetailsStatus: 'Reservation',
                    color: '#2F8B2C',
                    ...(rs ? { roomStatusId: rs.id } : {}),
                  })
                  setTimeout(() => {
                    if (!loading) handleSubmit(e)
                  }, 0)
                }}
                disabled={loading}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[10px] font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${loading ? 'cursor-not-allowed bg-slate-400' : 'hover:opacity-90'}`}
                style={{
                  backgroundColor: loading ? undefined : '#059669',
                  boxShadow: loading
                    ? undefined
                    : `0 12px 16px -4px #0596694d, 0 4px 6px -2px #0596694d`,
                }}
              >
                <CalendarCheck size={14} />
                <span>RESERVATION</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  const rs = roomStatuses?.find(
                    (s) =>
                      s.roomStatusName?.toLowerCase() === 'occupied' ||
                      s.shortName?.toLowerCase() === 'occ',
                  )
                  setFormData({
                    ...formData,
                    guestDetailsStatus: 'Check-In',
                    color: '#ffa500',
                    ...(rs ? { roomStatusId: rs.id } : {}),
                  })
                  setTimeout(() => {
                    if (!loading) handleSubmit(e)
                  }, 0)
                }}
                disabled={loading}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[10px] font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${loading ? 'cursor-not-allowed bg-slate-400' : 'hover:opacity-90'}`}
                style={{
                  backgroundColor: loading ? undefined : '#f59e0b',
                  boxShadow: loading
                    ? undefined
                    : `0 12px 16px -4px #f59e0b4d, 0 4px 6px -2px #f59e0b4d`,
                }}
              >
                <CheckCircle size={14} />
                <span>CHECK IN</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[10px] font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${loading ? 'cursor-not-allowed bg-slate-400' : 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40'}`}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>UPDATE PROFILE</span>
              </button>

              <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  window.print()
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800"
              >
                <Printer size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-red-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
