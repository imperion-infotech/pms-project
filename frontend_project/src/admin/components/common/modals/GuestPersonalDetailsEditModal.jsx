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
} from 'lucide-react'
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

  if (!isOpen) return null

  // Determine source: Local preview takes precedence during upload/session
  const photoSrc =
    localPreviews.photo ||
    (cleanImageUrl(formData.profilePhoto) ? `/user/${cleanImageUrl(formData.profilePhoto)}` : null)
  const signatureSrc =
    localPreviews.signature ||
    (cleanImageUrl(formData.signature) ? `/user/${cleanImageUrl(formData.signature)}` : null)

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="animate-in zoom-in-95 relative z-10 flex h-[98vh] w-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-slate-200/50 bg-white shadow-2xl dark:border-slate-700/50 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white/80 px-8 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase dark:text-white">
                  Modify Guest Data
                </h2>
                <p className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">
                  Manage Profile & Stay Specifications
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all hover:rotate-90 hover:bg-red-50 hover:text-red-500 dark:bg-slate-800 dark:hover:bg-red-900/30"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden bg-slate-50/50 lg:flex-row dark:bg-slate-900">
            {/* Column 1: Identity & Documentation */}
            <div className="scrollbar-hide flex w-full flex-col border-b border-slate-200 bg-white transition-all lg:w-[32%] lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 p-4 pb-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <User size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-[11px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                  Part 1: Identity & Docs
                </h3>
              </div>
              <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4">
                {/* Asset Capture */}
                <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700/50 dark:bg-slate-800/50">
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
                    <div className="relative flex-1 rounded-[18px] border-2 border-dashed border-slate-200 bg-white p-1.5 text-center transition-colors group-hover:border-blue-400 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800">
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

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      First Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Last Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Company Name
                    </label>
                    <div className="relative group">
                      <Building
                        size={14}
                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20"
                        placeholder="Company"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone
                        size={14}
                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-500"
                      />
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
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20"
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail
                        size={14}
                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-500"
                      />
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Full Address
                    </label>
                    <textarea
                      required
                      rows="1"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="scrollbar-hide w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:ring-blue-900/20"
                      placeholder="Address"
                    ></textarea>
                  </div>
                </div>

                {/* Verification Documents */}
                <div className="rounded-2xl border border-blue-100/50 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
                      ID Documents
                    </span>
                    <div className="h-px flex-1 bg-blue-200/50 dark:bg-blue-800/50"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Doc Type
                      </label>
                      <select
                        value={formData.documentTypeId}
                        onChange={(e) =>
                          setFormData({ ...formData, documentTypeId: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/20"
                      >
                        <option value="">Type</option>
                        {documentTypes?.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.documentTypeName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Number
                      </label>
                      <input
                        type="text"
                        value={formData.documentNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, documentNumber: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/20"
                        placeholder="ID number"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Valid Till
                      </label>
                      <input
                        type="date"
                        value={formData.validTill}
                        onChange={(e) => setFormData({ ...formData, validTill: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Remark
                      </label>
                      <input
                        type="text"
                        value={formData.remark}
                        onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/20"
                        placeholder="Remarks"
                      />
                    </div>
                    <div className="col-span-2 grid grid-cols-2 gap-3">
                      <div className="relative rounded-xl border-2 border-dashed border-slate-200 bg-white p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/30">
                        {formData.frontImagePath ? (
                          <AuthImage
                            src={`/user/${cleanImageUrl(formData.frontImagePath)}`}
                            alt="Front"
                            className="mx-auto h-16 rounded-lg object-contain"
                          />
                        ) : (
                          <div className="py-1">
                            <Camera size={16} className="mx-auto mb-0.5 text-slate-300" />
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                              Front
                            </p>
                          </div>
                        )}
                        <label className="mt-1.5 block w-full cursor-pointer rounded-lg bg-slate-50 py-1 text-[8px] font-black text-slate-500 uppercase shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-500 dark:bg-slate-800">
                          Update
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'front')}
                          />
                        </label>
                      </div>
                      <div className="relative rounded-xl border-2 border-dashed border-slate-200 bg-white p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/30">
                        {formData.backImagePath ? (
                          <AuthImage
                            src={`/user/${cleanImageUrl(formData.backImagePath)}`}
                            alt="Back"
                            className="mx-auto h-16 rounded-lg object-contain"
                          />
                        ) : (
                          <div className="py-1">
                            <Camera size={16} className="mx-auto mb-0.5 text-slate-300" />
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                              Back
                            </p>
                          </div>
                        )}
                        <label className="mt-1.5 block w-full cursor-pointer rounded-lg bg-slate-50 py-1 text-[8px] font-black text-slate-500 uppercase shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-500 dark:bg-slate-800">
                          Update
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
            </div>

            {/* Column 2: Stay & Room Allocation */}
            <div className="scrollbar-hide flex w-full flex-col border-b border-slate-200 bg-slate-50/50 transition-all lg:w-[46%] lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-800/20">
              <div className="flex items-center gap-3 p-4 pb-0 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <BedDouble size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-[11px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                  Part 2: Guest Info & Stay Selection
                </h3>
              </div>

              <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4 text-left">
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                      } else if (name === 'guestDetailsStats') {
                        if (value === 'Reservation') updated.color = '#2F8B2C'
                        if (value === 'Check-In') updated.color = '#ffa500'
                      }
                      setFormData(updated)
                    }}
                    isDark={false}
                  />
                </div>

                <div className="rounded-2xl border border-amber-100/50 bg-amber-50/50 p-4 dark:border-amber-900/20 dark:bg-amber-900/10">
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

            {/* Column 3: Ledger */}
            <div className="scrollbar-hide relative flex w-full flex-col bg-emerald-50/30 transition-all lg:w-[22%] dark:bg-emerald-900/5">
              <div className="absolute inset-y-0 left-0 hidden w-px bg-linear-to-b from-transparent via-emerald-200 to-transparent lg:block dark:via-emerald-500/20"></div>

              <div className="flex items-center gap-3 p-4 pb-0 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <Receipt size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-[11px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                  Part 3: Rent Details
                </h3>
              </div>

              <div className="scrollbar-hide flex-1 overflow-y-auto p-4 text-left">
                <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg shadow-emerald-500/5 dark:border-emerald-900/30 dark:bg-slate-900">
                  <RentDetails
                    formData={formData}
                    handleChange={(e) =>
                      setFormData({ ...formData, [e.target.name]: e.target.value })
                    }
                    isDark={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex w-full shrink-0 items-center justify-between border-t border-slate-200 bg-white px-8 py-4 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-6 py-3 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 px-8 py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/40 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Commit Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
