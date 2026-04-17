import React, { useState } from 'react'
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Upload,
  Globe2,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Home,
} from 'lucide-react'

/**
 * PropertyDetails Component
 * Industrial-level UI for managing property-specific configuration.
 * Excludes: IP WhiteList, Fax, and Reg Details as per requirements.
 */
const PropertyDetails = () => {
  const [formData, setFormData] = useState({
    clientId: 'CL-98234',
    region: 'North America',
    propertyName: 'Grand Royal Hotel',
    address: '123 Luxury Avenue, Downtown',
    city: 'Los Angeles',
    state: 'California',
    zip: '90001',
    country: 'United States',
    phone: '+1 (555) 123-4567',
    email: 'contact@grandroyal.com',
    url: 'https://www.grandroyal.com',
    logo: null,
    propertyImage: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }))
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 scrollbar-none h-full max-h-screen space-y-4 overflow-hidden duration-500">
      {/* Ultra Compact Header */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shadow-sm transition-all hover:scale-110">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl leading-none font-black tracking-tight text-slate-800 dark:text-white">
              Property Details
            </h2>
            <p className="mt-1 text-[10px] font-medium text-slate-400">
              All settings synced and ready
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40 active:scale-95">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Edit Property</span>
        </button>
      </div>

      {/* Main Single-Page Container */}
      <div className="mx-auto w-full">
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. Client ID */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Client ID
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-300 transition-colors group-focus-within:text-emerald-500">
                  <Globe2 className="h-3.5 w-3.5" />
                </div>
                <input
                  type="text"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-9 text-xs font-semibold text-slate-600 transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 2. Property Region */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Region
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-300 transition-colors group-focus-within:text-emerald-500">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-9 text-xs font-semibold text-slate-600 transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 3. Property Name* */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Property Name*
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-300 transition-colors group-focus-within:text-emerald-500">
                  <Building className="h-3.5 w-3.5" />
                </div>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-9 text-xs font-semibold text-slate-600 transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 4. Address* */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Address*
              </label>
              <div className="group relative">
                <div className="absolute top-2 left-3 text-slate-300 transition-colors group-focus-within:text-emerald-500">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="1"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-9 text-xs font-semibold text-slate-600 transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 5. City* */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                City*
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-600 transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-emerald-500"
              />
            </div>

            {/* 6. State* */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                State*
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-600 transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-emerald-500"
              />
            </div>

            {/* 7. Zip* */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Zip*
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-600 transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-emerald-500"
              />
            </div>

            {/* 8. Country* */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Country*
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-600 transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-emerald-500"
              />
            </div>

            {/* 9. Phone* */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Phone*
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-300 transition-colors group-focus-within:text-emerald-500">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-9 text-xs font-semibold text-slate-600 transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 10. Email* */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Email*
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-300 transition-colors group-focus-within:text-emerald-500">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-9 text-xs font-semibold text-slate-600 transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Bottom Media Row - 11 & 12 Perfect Symmetry */}
            <div className="mt-2 grid grid-cols-2 gap-6 border-t border-slate-100 pt-5 md:col-span-2 lg:col-span-2 dark:border-slate-800">
              {/* 11. Property Cover Image */}
              <div className="space-y-1.5">
                <label className="p-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Property Cover Image
                </label>
                <div className="group relative flex h-50 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-emerald-500 hover:bg-white dark:border-slate-700 dark:bg-slate-800/30">
                  {formData.propertyImage ? (
                    <div className="relative h-full w-full">
                      <img
                        src={formData.propertyImage}
                        alt="Cover"
                        className="h-full w-full rounded-xl object-cover"
                      />
                      <button
                        onClick={() => setFormData((prev) => ({ ...prev, propertyImage: null }))}
                        className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white shadow-lg transition-transform hover:scale-110"
                      >
                        <Trash2 className="h-2 w-2" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="mb-1 rounded-full bg-emerald-50 p-2">
                        <Upload className="h-4 w-4 text-emerald-500" />
                      </div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">UPLOAD COVER</p>
                      <input
                        type="file"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={(e) => handleFileUpload(e, 'propertyImage')}
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 12. Property Logo */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Property Logo
                </label>
                <div className="group relative flex h-50 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-emerald-500 hover:bg-white dark:border-slate-700 dark:bg-slate-800/30">
                  {formData.logo ? (
                    <div className="relative h-full w-full p-2">
                      <img
                        src={formData.logo}
                        alt="Logo"
                        className="h-full w-full object-contain"
                      />
                      <button
                        onClick={() => setFormData((prev) => ({ ...prev, logo: null }))}
                        className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white shadow-lg transition-transform hover:scale-110"
                      >
                        <Trash2 className="h-2 w-2" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="mb-1 rounded-full bg-emerald-50 p-2">
                        <ImageIcon className="h-4 w-4 text-emerald-500" />
                      </div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">UPLOAD LOGO</p>
                      <input
                        type="file"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={(e) => handleFileUpload(e, 'logo')}
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
