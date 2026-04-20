import React, { useState, useEffect } from 'react'
import { X, Loader2, UploadCloud, Building2, MapPin, Phone, Mail, Globe } from 'lucide-react'
import { propertyService } from '../../../services/propertyService'

const PropertyEditModal = ({ isOpen, onClose, hotel, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: 0,
    hotelName: '',
    url: '',
    address: '',
    city: '',
    state1: '',
    country: '',
    zipCode: '',
    email: '',
    contactNumber: '',
    status: 'ACTIVE',
    timezone: 'IST',
    hotelLogo: '',
    hotelImage: '',
    logoPreview: '',
    imagePreview: '',
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (hotel && isOpen) {
      setFormData({
        ...hotel,
        logoPreview: propertyService.getImageUrl(hotel.hotelLogo),
        imagePreview: propertyService.getImageUrl(hotel.hotelImage),
      })
    }
  }, [hotel, isOpen])

  const handleImageSelect = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    try {
      const localUrl = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        [type === 'hotelLogo' ? 'logoPreview' : 'imagePreview']: localUrl,
      }))

      const uploadData = new FormData()
      uploadData.append('file', file)
      const response = await propertyService.uploadImage(uploadData)

      const rawData = response.data.filename || response.data
      let cleanFileName = rawData
      if (typeof rawData === 'string' && rawData.includes('/')) {
        cleanFileName = rawData.split('/').pop()
      }

      setFormData((prev) => ({
        ...prev,
        [type]: cleanFileName,
      }))
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Image upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const { _logoPreview, _imagePreview, ...payload } = formData
      const response = await propertyService.updateHotel(hotel.id, payload)
      if (response.data) {
        onUpdate(response.data)
        onClose()
      }
    } catch (err) {
      console.error('Update failed:', err)
      alert('Failed to update property.')
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in-95 relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-8 py-6">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              Edit Property Details
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Update the profile and configuration for "{hotel?.hotelName}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-8 py-8">
          <form className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                Hotel Name*
              </label>
              <input
                type="text"
                required
                value={formData.hotelName}
                onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                Timezone
              </label>
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                Full Address
              </label>
              <textarea
                rows="1"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            {['city', 'state1', 'zipCode', 'country'].map((field) => (
              <div key={field}>
                <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                  {field.replace('1', '').replace(/([A-Z])/, ' $1')}
                </label>
                <input
                  type="text"
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition-all outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            ))}

            <div>
              <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                Contact Number
              </label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="md:col-span-1">
              <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                Website URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            {/* Images Section */}
            <div className="grid grid-cols-1 gap-5 pt-4 md:col-span-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="mb-1 block text-xs font-black tracking-widest text-slate-400 uppercase">
                  Property Logo
                </label>
                <input
                  type="file"
                  id="edit-logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, 'hotelLogo')}
                />
                <div
                  onClick={() => document.getElementById('edit-logo-upload').click()}
                  className="group relative flex h-36 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-emerald-400 hover:bg-emerald-50/30"
                >
                  {formData.logoPreview ? (
                    <img
                      src={formData.logoPreview}
                      alt="Logo"
                      className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                        <UploadCloud size={20} />
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        Change Logo
                      </span>
                    </>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-xs">
                      <Loader2 className="animate-spin text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="mb-1 block text-xs font-black tracking-widest text-slate-400 uppercase">
                  Cover Image
                </label>
                <input
                  type="file"
                  id="edit-cover-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, 'hotelImage')}
                />
                <div
                  onClick={() => document.getElementById('edit-cover-upload').click()}
                  className="group relative flex h-36 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-emerald-400 hover:bg-emerald-50/30"
                >
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Cover"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                        <UploadCloud size={20} />
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        Change Cover
                      </span>
                    </>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-xs">
                      <Loader2 className="animate-spin text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-4 border-t border-slate-100 bg-slate-50/80 px-8 py-6 backdrop-blur-md">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-xs font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUpdating || isUploading}
            className="flex flex-2 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : null}
            {isUpdating ? 'Saving Changes...' : 'Update Property'}
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  )
}

export default PropertyEditModal
