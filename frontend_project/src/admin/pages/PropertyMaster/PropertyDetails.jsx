import React, { useState, useEffect } from 'react'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit3,
  Save,
  UploadCloud,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  Search,
} from 'lucide-react'
import { propertyService } from '../../../services/propertyService'
import { AuthImage } from '../../components/common/AuthImage'

const PropertyDetails = () => {
  const [hotelData, setHotelData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  // Fetch current hotel details based on activeHotelId
  const fetchHotelDetails = async () => {
    setIsLoading(true)
    setError(null)
    const activeHotelId = localStorage.getItem('activeHotelId')

    if (!activeHotelId) {
      setError('No active hotel selected.')
      setIsLoading(false)
      return
    }

    try {
      const response = await propertyService.getHotelById(activeHotelId)
      if (response.data) {
        setHotelData(response.data)
      }
    } catch (err) {
      console.error('Error fetching hotel details:', err)
      setError('Failed to load property details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHotelDetails()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await propertyService.updateHotel(hotelData.id, hotelData)
      setIsEditing(false)
      // Update local name if changed
      localStorage.setItem('activeHotelName', hotelData.hotelName)
      alert('Property details updated successfully!')
    } catch (err) {
      console.error('Error updating hotel:', err)
      alert('Failed to update property details.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 size={40} className="animate-spin text-emerald-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <Building2 size={64} className="mb-4 text-slate-200" />
        <h3 className="text-xl font-bold text-slate-900">{error}</h3>
        <button
          onClick={fetchHotelDetails}
          className="mt-4 rounded-xl bg-emerald-600 px-6 py-2 font-bold text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in h-full w-full overflow-hidden p-4 duration-500">
      {/* Page Header - Compact */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-pms-tiny font-bold tracking-widest text-slate-400 uppercase">
              <span>Room Settings</span>
              <span>/</span>
              <span className="text-emerald-600">Property Details</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
              Property Details
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
            >
              <Edit3 size={16} /> Edit Property
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      {/* Main Form Area - Optimized for Height */}
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <form className="p-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-3.5 md:grid-cols-3">
            {/* Field: Client ID (ReadOnly usually) */}
            <div className="space-y-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Client ID
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-300"
                />
                <input
                  type="text"
                  readOnly
                  value={`CL-${hotelData.id || '98234'}`}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-12 py-4 text-sm font-bold text-slate-400 italic outline-none"
                />
              </div>
            </div>

            {/* Field: Region */}
            <div className="space-y-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Region
              </label>
              <div className="relative">
                <Globe
                  size={16}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={hotelData.timezone || 'North America'}
                  onChange={(e) => setHotelData({ ...hotelData, timezone: e.target.value })}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-12 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Field: Property Name */}
            <div className="space-y-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Property Name*
              </label>
              <div className="relative">
                <Building2
                  size={16}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={hotelData.hotelName}
                  onChange={(e) => setHotelData({ ...hotelData, hotelName: e.target.value })}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-12 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Field: Website URL */}
            <div className="space-y-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Website URL
              </label>
              <div className="relative">
                <Globe
                  size={16}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={hotelData.url || ''}
                  onChange={(e) => setHotelData({ ...hotelData, url: e.target.value })}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-12 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Field: Status */}
            <div className="space-y-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Property Status
              </label>
              <div className="relative">
                <CheckCircle2
                  size={16}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                />
                <select
                  disabled={!isEditing}
                  value={hotelData.status || 'ACTIVE'}
                  onChange={(e) => setHotelData({ ...hotelData, status: e.target.value })}
                  className="pointer-events-auto w-full appearance-none rounded-2xl border border-slate-100 bg-slate-50/50 px-12 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
            </div>

            {/* Field: Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Address*
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute top-5 left-4 text-slate-400" />
                <textarea
                  disabled={!isEditing}
                  rows="1"
                  value={hotelData.address}
                  onChange={(e) => setHotelData({ ...hotelData, address: e.target.value })}
                  className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50/50 px-12 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
                ></textarea>
              </div>
            </div>

            {/* Field: City */}
            <div className="space-y-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                City*
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={hotelData.city}
                onChange={(e) => setHotelData({ ...hotelData, city: e.target.value })}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
              />
            </div>

            {/* Field: State */}
            <div className="space-y-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                State*
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={hotelData.state1}
                onChange={(e) => setHotelData({ ...hotelData, state1: e.target.value })}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
              />
            </div>

            {/* Field: Zip */}
            <div className="space-y-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Zip*
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={hotelData.zipCode}
                onChange={(e) => setHotelData({ ...hotelData, zipCode: e.target.value })}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
              />
            </div>

            {/* Field: Country */}
            <div className="space-y-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Country*
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={hotelData.country}
                onChange={(e) => setHotelData({ ...hotelData, country: e.target.value })}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
              />
            </div>

            {/* Field: Phone */}
            <div className="space-y-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Phone*
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={hotelData.contactNumber}
                  onChange={(e) => setHotelData({ ...hotelData, contactNumber: e.target.value })}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-12 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Field: Email */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Email*
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  disabled={!isEditing}
                  value={hotelData.email}
                  onChange={(e) => setHotelData({ ...hotelData, email: e.target.value })}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-12 py-4 text-sm font-bold text-slate-900 transition-all outline-none focus:border-emerald-500 disabled:opacity-70"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Image Section: Cover */}
            <div className="space-y-3">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Property Cover Image
              </label>
              <div className="group flex h-40 flex-col items-center justify-center gap-4 overflow-hidden rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-emerald-400 hover:bg-emerald-50/30">
                {hotelData.hotelImage && hotelData.hotelImage !== 'string' ? (
                  <AuthImage
                    src={propertyService.getImageUrl(hotelData.hotelImage)}
                    alt="Cover"
                    className="h-full w-full object-cover"
                    fallback={
                      <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                        <Building2 size={32} />
                      </div>
                    }
                  />
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm">
                      <UploadCloud size={24} />
                    </div>
                    <span className="text-pms-tiny font-black tracking-widest text-slate-500 uppercase">
                      Upload Cover
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Image Section: Logo */}
            <div className="space-y-3">
              <label className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                Property Logo
              </label>
              <div className="group flex h-40 flex-col items-center justify-center gap-4 overflow-hidden rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-emerald-400 hover:bg-emerald-50/30">
                {hotelData.hotelLogo && hotelData.hotelLogo !== 'string' ? (
                  <AuthImage
                    src={propertyService.getImageUrl(hotelData.hotelLogo)}
                    alt="Logo"
                    className="h-24 w-24 object-contain"
                    fallback={
                      <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                        <CheckCircle2 size={32} />
                      </div>
                    }
                  />
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="text-pms-tiny font-black tracking-widest text-slate-500 uppercase">
                      Upload Logo
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyDetails
