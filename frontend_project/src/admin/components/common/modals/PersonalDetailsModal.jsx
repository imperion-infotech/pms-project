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

export const PersonalDetailsModal = ({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  handleSubmit,
  handleFileUpload,
  uploadingType,
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
      <div className="animate-in zoom-in-95 relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:flex-row dark:bg-slate-900">
        {/* Media Side */}
        <div className="flex w-full shrink-0 flex-col items-center border-r border-slate-100 bg-slate-50 p-8 md:w-1/3 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="mb-8 text-center">
            <h3 className="font-black tracking-tighter text-emerald-500 uppercase">New Profile</h3>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Capture guest assets
            </p>
          </div>
          <div className="group relative mb-8">
            <div className="h-32 w-32 overflow-hidden rounded-[32px] border-4 border-white bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
              {photoSrc ? (
                <AuthImage src={photoSrc} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300 dark:bg-slate-900/50">
                  <User size={40} />
                </div>
              )}
              {uploadingType === 'photo' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
                  <Loader2 className="animate-spin text-white" />
                </div>
              )}
            </div>
            <label className="absolute -right-2 -bottom-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg transition-all hover:scale-110">
              <Camera size={18} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handlePreviewUpload(e, 'photo')}
              />
            </label>
          </div>
          <div className="w-full space-y-4">
            <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-900/30">
              {signatureSrc ? (
                <div className="relative flex h-20 items-center justify-center">
                  <AuthImage src={signatureSrc} alt="Signature" className="max-h-full" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, signature: '' })
                      if (localPreviews.signature) URL.revokeObjectURL(localPreviews.signature)
                      setLocalPreviews((prev) => ({ ...prev, signature: null }))
                    }}
                    className="absolute top-1 right-1 rounded-md bg-red-100 p-1 text-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <SignatureIcon size={24} className="mx-auto mb-1 text-slate-300" />
                  <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                    Signature
                  </p>
                </div>
              )}
              <label className="mt-2 block w-full cursor-pointer rounded-xl bg-slate-100 py-2 text-[10px] font-black text-slate-500 uppercase transition-all hover:bg-slate-200 dark:bg-slate-800">
                {uploadingType === 'signature' ? (
                  <Loader2 className="mx-auto h-3 w-3 animate-spin" />
                ) : (
                  'Upload Signature'
                )}
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
        {/* Form Side */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
                Personal Details
              </h2>
              <p className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                Industrial Mapping
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="custom-scrollbar space-y-6 overflow-y-auto p-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[10px] font-black text-slate-400 uppercase">
                  First Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black text-slate-400 uppercase">
                  Last Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-slate-800"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-2 block text-[10px] font-black text-slate-400 uppercase">
                  Company Name
                </label>
                <div className="relative">
                  <Building
                    size={16}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full rounded-2xl bg-slate-50 py-3 pr-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black text-slate-400 uppercase">
                  Phone
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-2xl bg-slate-50 py-3 pr-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black text-slate-400 uppercase">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-2xl bg-slate-50 py-3 pr-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="mb-2 block text-[10px] font-black text-slate-400 uppercase">
                  Address
                </label>
                <textarea
                  required
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full resize-none rounded-2xl bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-slate-800"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-4 border-t border-slate-50 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-4 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex flex-2 items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Create Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
