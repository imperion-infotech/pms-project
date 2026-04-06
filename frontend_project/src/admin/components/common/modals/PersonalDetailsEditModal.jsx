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
import StaySpecifications from '../../../../components/common/StaySpecifications'

export const PersonalDetailsEditModal = ({
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
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="animate-in zoom-in-95 relative z-10 flex max-h-[98vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase dark:text-white">
                Modify Guest Data
              </h2>
              <p className="text-[9px] font-bold tracking-widest text-blue-500 uppercase">
                Manage Profile & Stay Specifications
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            {/* Left Side: Personal & Documents */}
            <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto border-r border-slate-100 p-6 dark:border-slate-800">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-[9px] font-black tracking-widest text-blue-500 uppercase">
                  Personal Details
                </span>
                <div className="h-px flex-1 bg-blue-50/50 dark:bg-blue-500/10"></div>
              </div>

              {/* Asset Capture */}
              <div className="flex items-start gap-6">
                <div className="group relative">
                  <div className="h-24 w-24 overflow-hidden rounded-[24px] border-4 border-slate-100 bg-white shadow-lg dark:border-blue-500/20 dark:bg-slate-800">
                    {photoSrc ? (
                      <AuthImage src={photoSrc} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300 dark:bg-slate-900/50">
                        <User size={30} />
                      </div>
                    )}
                    {uploadingType === 'photo' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg transition-all hover:scale-110">
                    <Camera size={14} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handlePreviewUpload(e, 'photo')}
                    />
                  </label>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="relative h-24 rounded-[24px] border-2 border-dashed border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-900/30">
                    {signatureSrc ? (
                      <div className="relative flex h-full items-center justify-center">
                        <AuthImage src={signatureSrc} alt="Signature" className="max-h-full" />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, signature: '' })
                            if (localPreviews.signature) URL.revokeObjectURL(localPreviews.signature)
                            setLocalPreviews((prev) => ({ ...prev, signature: null }))
                          }}
                          className="absolute -top-1 -right-1 rounded-full bg-red-100 p-1 text-red-500 shadow-sm transition-colors hover:bg-red-200"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center">
                        <SignatureIcon size={20} className="mb-0.5 text-slate-300" />
                        <p className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                          No Sig
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
                  <button type="button" className="w-full rounded-xl bg-slate-100 py-1.5 text-[8px] font-black text-slate-500 uppercase dark:bg-slate-800">
                    Update Sig
                  </button>
                </div>
              </div>

              {/* Personal Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[9px] font-black text-slate-400 uppercase">First Name</label>
                  <input
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[9px] font-black text-slate-400 uppercase">Last Name</label>
                  <input
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-[9px] font-black text-slate-400 uppercase">Company Name</label>
                  <div className="relative">
                    <Building size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 py-2 pr-3 pl-9 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[9px] font-black text-slate-400 uppercase">Phone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-300" />
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value, mobileNumber: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 py-2 pr-3 pl-9 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[9px] font-black text-slate-400 uppercase">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-300" />
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 py-2 pr-3 pl-9 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-[9px] font-black text-slate-400 uppercase">Address</label>
                  <textarea
                    required
                    rows="1"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full resize-none rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700"
                  ></textarea>
                </div>
              </div>

              {/* Document Section */}
              <div className="pt-2">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Verification
                  </span>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[9px] font-black text-slate-400 uppercase">Doc Type</label>
                    <select
                      value={formData.documentTypeId}
                      onChange={(e) => setFormData({ ...formData, documentTypeId: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700"
                    >
                      <option value="">Type</option>
                      {documentTypes?.map((type) => (
                        <option key={type.id} value={type.id}>{type.documentTypeName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[9px] font-black text-slate-400 uppercase">Number</label>
                    <input
                      type="text"
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[9px] font-black text-slate-400 uppercase">Valid Till</label>
                    <input
                      type="date"
                      value={formData.validTill}
                      onChange={(e) => setFormData({ ...formData, validTill: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[9px] font-black text-slate-400 uppercase">Remark</label>
                    <input
                      type="text"
                      value={formData.remark}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-3">
                    <div className="relative rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/50 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/30">
                      {formData.frontImagePath ? (
                        <AuthImage src={`/user/${cleanImageUrl(formData.frontImagePath)}`} alt="Front" className="mx-auto h-16 rounded-lg" />
                      ) : (
                        <div className="py-1">
                          <Camera size={16} className="mx-auto mb-0.5 text-slate-300" />
                          <p className="text-[7px] font-bold text-slate-400 uppercase">Front</p>
                        </div>
                      )}
                      <label className="mt-1.5 block w-full cursor-pointer rounded-lg bg-white py-1 text-[8px] font-black text-slate-500 uppercase shadow-sm dark:bg-slate-800">
                        Update
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'front')} />
                      </label>
                    </div>
                    <div className="relative rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/50 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/30">
                      {formData.backImagePath ? (
                        <AuthImage src={`/user/${cleanImageUrl(formData.backImagePath)}`} alt="Back" className="mx-auto h-16 rounded-lg" />
                      ) : (
                        <div className="py-1">
                          <Camera size={16} className="mx-auto mb-0.5 text-slate-300" />
                          <p className="text-[7px] font-bold text-slate-400 uppercase">Back</p>
                        </div>
                      )}
                      <label className="mt-1.5 block w-full cursor-pointer rounded-lg bg-white py-1 text-[8px] font-black text-slate-500 uppercase shadow-sm dark:bg-slate-800">
                        Update
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'back')} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Stay Specifications */}
            <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-6 dark:bg-slate-800/20">
              <StaySpecifications
                formData={formData}
                handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
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
          {/* Footer */}
          <div className="flex gap-4 border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-600"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-2 items-center justify-center gap-3 rounded-xl bg-blue-600 py-3 text-[10px] font-black tracking-widest text-white uppercase shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Update Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
