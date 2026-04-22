import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Plus,
  ArrowRight,
  Home,
  LogOut,
  X,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Globe,
  UploadCloud,
  Pencil,
  Trash2,
} from 'lucide-react'
import api from '../../../services/api'
import { propertyService } from '../../../services/propertyService'
import PropertyEditModal from './PropertyEditModal'
import { AuthImage } from '../../components/common/AuthImage'

// Helper to determine if user is a Super Admin
const checkIsSuperAdmin = () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return false

    const cleanToken = String(token).trim().replace(/^"|"$/g, '')
    const base64Url = cleanToken.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))

    console.log('--- JWT ROLE CHECK ---', payload.roles)

    const roles = payload.roles || []
    const isSuper = roles.some((r) => {
      const roleName = (typeof r === 'object' ? r.name || r.authority : r) || ''
      return String(roleName).toUpperCase().includes('SUPER_ADMIN')
    })

    // Auto-fix localStorage if it shows wrong role but token has Super Admin
    if (isSuper && localStorage.getItem('user_role') !== 'ROLE_SUPER_ADMIN') {
      localStorage.setItem('user_role', 'ROLE_SUPER_ADMIN')
    }

    return isSuper
  } catch (err) {
    console.error('Role decoding failed:', err)
    const storedRole = localStorage.getItem('user_role') || ''
    return storedRole.toUpperCase().includes('SUPER_ADMIN')
  }
}

const PropertySelection = () => {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingHotel, setEditingHotel] = useState(null)
  const [localPreviews, setLocalPreviews] = useState({ hotelLogo: null, hotelImage: null })

  // Clean Image URL logic from GuestPersonalDetailsModal
  const cleanImageUrl = (path) => {
    if (!path || path === 'string' || path.length < 3) return null
    let cleanPath = String(path)
    if (cleanPath.includes(': ')) cleanPath = cleanPath.split(': ')[1].trim()
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1)
    const parts = cleanPath.split('/')
    return parts[parts.length - 1] // Only the filename
  }

  // Cleanup effect
  React.useEffect(() => {
    if (!showCreateModal && (localPreviews.hotelLogo || localPreviews.hotelImage)) {
      if (localPreviews.hotelLogo) URL.revokeObjectURL(localPreviews.hotelLogo)
      if (localPreviews.hotelImage) URL.revokeObjectURL(localPreviews.hotelImage)
      setLocalPreviews({ hotelLogo: null, hotelImage: null })
    }
  }, [showCreateModal, localPreviews.hotelLogo, localPreviews.hotelImage])

  // Hotel Form State
  const [newHotel, setNewHotel] = useState({
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
    createdOn: new Date().toISOString(),
    updatedOn: new Date().toISOString(),
    // Admin Credentials (For Super Admin flow)
    adminUsername: '',
    adminPassword: '',
    adminEmail: '',
  })

  const isSuperAdmin = checkIsSuperAdmin()

  const [hotels, setHotels] = useState([])

  React.useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await propertyService.getHotels()
        if (response.data) {
          setHotels(response.data)
          localStorage.setItem('adminHotels', JSON.stringify(response.data))
        }
      } catch (error) {
        console.error('Error fetching hotels:', error)
        // Fallback to local storage if API fails
        const stored = localStorage.getItem('adminHotels')
        if (stored) setHotels(JSON.parse(stored))
      }
    }
    fetchHotels()
  }, [])

  const handleSelectHotel = async (hotelId, hotelName) => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      // 1. Double check username (Industrial fix for missing session data)
      let username = localStorage.getItem('username')
      if (!username) {
        // Fallback: try to decode it from the existing token if possible
        const currentToken = localStorage.getItem('access_token')
        if (currentToken) {
          try {
            const decoded = JSON.parse(atob(currentToken.split('.')[1]))
            username = decoded.sub || decoded.username
          } catch (e) {
            console.error('Failed to decode username from token', e)
          }
        }
      }

      if (!username) {
        alert('Session expired. Please login again.')
        navigate('/login')
        return
      }

      console.log(`--- SELECTING HOTEL: ${hotelName} (${hotelId}) FOR USER: ${username} ---`)

      const params = new URLSearchParams()
      params.append('hotelId', hotelId)
      params.append('username', username)

      const response = await api.post('/auth/select-hotel', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      let newToken = null
      const data = response.data

      // Log full response for debugging
      console.log('--- SELECT HOTEL RESPONSE ---', data)

      if (typeof data === 'string') {
        newToken = data.trim()
      } else if (data) {
        newToken = data.token || data.access_token || data.jwt || data.accessToken
      }

      if (newToken) {
        const cleanToken = String(newToken).replace(/^"|"$/g, '').trim()

        // Log for the USER to see the token change
        console.log('--- TOKEN UPDATE CHECK ---')
        console.log('Old Token:', localStorage.getItem('access_token'))
        console.log('New Token Received:', cleanToken)

        localStorage.setItem('access_token', cleanToken)
        localStorage.setItem('activeHotelId', hotelId)
        localStorage.setItem('activeHotelName', hotelName)

        // Industrial Logging for Debugging
        console.log('--- HOTEL SELECTION SUCCESSFUL ---', {
          hotelId: hotelId,
          username: username,
          newToken: cleanToken,
        })

        navigate('/home')
      } else {
        throw new Error('New token not found in response')
      }
    } catch (error) {
      console.error('Hotel selection error:', error)
      const message = error.response?.data?.message || error.message
      alert(`Failed to select hotel. Error: ${message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateHotel = () => {
    setShowCreateModal(true)
  }

  const handleSaveNewHotel = async (e) => {
    e.preventDefault()

    // --- PREPARING JSON PAYLOAD (As per user requirement: id 0 for auto-increment) ---
    const hotelPayload = {
      id: 0,
      hotelName: newHotel.hotelName || 'string',
      url: newHotel.url || 'string',
      address: newHotel.address || 'string',
      city: newHotel.city || 'string',
      state1: newHotel.state1 || 'string',
      country: newHotel.country || 'string',
      zipCode: String(newHotel.zipCode || 'string'),
      email: newHotel.email || 'string',
      contactNumber: String(newHotel.contactNumber || 'string'),
      status: newHotel.status || 'ACTIVE',
      timezone: newHotel.timezone || 'IST',
      hotelLogo: newHotel.hotelLogo || 'string',
      hotelImage: newHotel.hotelImage || 'string',
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    }

    console.log('--- [STEP 1] SENDING POST PAYLOAD ---')
    console.log(JSON.stringify(hotelPayload, null, 2))

    setIsCreating(true)
    try {
      const response = await propertyService.createHotel(hotelPayload)

      console.log('--- [STEP 2] API RESPONSE RECEIVED ---')
      console.log(response.data)

      if (response.data) {
        const hotel = response.data

        /* 
        // If Super Admin, also "create" the admin credentials if provided
        if (isSuperAdmin && newHotel.adminUsername) {
          try {
            await api.post('/auth/register', {
              username: newHotel.adminUsername,
              password: newHotel.adminPassword,
              emailId: newHotel.adminEmail,
              role: 'ROLE_ADMIN',
              hotelId: hotel.id, // Linking admin to the newly created hotel
            })
            alert(`Hotel created and Admin credentials assigned to ${newHotel.adminUsername}`)
          } catch (e) {
            console.error('Failed to create admin user', e)
          }
        }
        */

        const updatedHotels = [...hotels, hotel]
        setHotels(updatedHotels)
        localStorage.setItem('adminHotels', JSON.stringify(updatedHotels))
        setShowCreateModal(false)

        // Industrial Flow: Auto-select newly created hotel
        alert('Hotel created successfully! Accessing your dashboard now...')
        handleSelectHotel(hotel.id, hotel.hotelName || hotel.name)
      }
    } catch (error) {
      console.error('--- [ERROR] PROPERTY CREATION FAILED ---')
      console.error(error.response?.data || error.message)
      alert('Failed to create hotel. Please check console for details.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteHotel = async (e, id, name) => {
    e.stopPropagation() // Prevent card click
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`))
      return

    setIsProcessing(true)
    try {
      await propertyService.deleteHotel(id)
      const updatedHotels = hotels.filter((h) => h.id !== id)
      setHotels(updatedHotels)
      localStorage.setItem('adminHotels', JSON.stringify(updatedHotels))
      alert('Hotel deleted successfully.')
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Failed to delete hotel.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdateHotel = (updatedHotel) => {
    const updatedHotels = hotels.map((h) => (h.id === updatedHotel.id ? updatedHotel : h))
    setHotels(updatedHotels)
    localStorage.setItem('adminHotels', JSON.stringify(updatedHotels))
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleImageSelect = async (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Show local preview immediately (using temporary URL)
    const url = URL.createObjectURL(file)
    setLocalPreviews((prev) => {
      if (prev[type]) URL.revokeObjectURL(prev[type])
      return { ...prev, [type]: url }
    })

    setIsProcessing(true)
    try {
      // 2. Prepare for upload
      const formData = new FormData()
      formData.append('file', file) // Backend usually expects 'file'

      console.log(`--- [UPLOAD START] Picked: ${file.name} ---`)
      const response = await propertyService.uploadImage(formData)

      // 3. CLEANING LOGIC: Extract ONLY the filename from the noisy response
      const rawData = response.data.filename || response.data
      let cleanFileName = String(rawData).split(/[/\\]/).pop().split(':').pop().trim()

      setNewHotel((prev) => ({
        ...prev,
        [type]: cleanFileName, // Saving the server-returned name so it can be fetched
      }))

      console.log(`--- [UPLOAD SUCCESS] ---`)
      console.log(`Original Name: ${file.name}`)
      console.log(`Server Saved As: ${cleanFileName}`)
    } catch (err) {
      console.error('Upload error:', err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Imperion PMS</h1>
            <p className="text-pms-tiny font-black tracking-[0.2em] text-emerald-500 uppercase opacity-90">
              Property Management
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 text-sm font-bold text-slate-600 transition-all hover:text-emerald-600"
        >
          <LogOut size={16} className="transition-transform group-hover:-translate-x-1" /> Logout
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-extrabold text-slate-900">Select a Property</h2>
            <p className="text-slate-500">Choose a hotel to access its management dashboard</p>
          </div>
          {isSuperAdmin && (
            <button
              onClick={handleCreateHotel}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              <Plus size={18} /> Add New Hotel
            </button>
          )}
        </div>

        {/* Create Hotel Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="animate-in zoom-in-95 relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white p-10 shadow-2xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 rounded-full p-2 transition-colors hover:bg-slate-100"
              >
                <X size={20} className="text-slate-400" />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                  Register New Property
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Please enter the details for your new hotel establishment
                </p>
              </div>

              <form
                onSubmit={handleSaveNewHotel}
                className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3"
              >
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                    Hotel Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={newHotel.hotelName}
                    onChange={(e) => setNewHotel({ ...newHotel, hotelName: e.target.value })}
                    placeholder="e.g. Grand Royal Hotel"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={newHotel.url}
                    onChange={(e) => setNewHotel({ ...newHotel, url: e.target.value })}
                    placeholder="https://www.hotel.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                    Full Address
                  </label>
                  <textarea
                    rows="1"
                    value={newHotel.address}
                    onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                    placeholder="123 Luxury Avenue, Downtown"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500"
                  ></textarea>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                    City
                  </label>
                  <input
                    type="text"
                    value={newHotel.city}
                    onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}
                    placeholder="Los Angeles"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                    State
                  </label>
                  <input
                    type="text"
                    value={newHotel.state1}
                    onChange={(e) => setNewHotel({ ...newHotel, state1: e.target.value })}
                    placeholder="California"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={newHotel.zipCode}
                    onChange={(e) => setNewHotel({ ...newHotel, zipCode: e.target.value })}
                    placeholder="90001"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                    Country
                  </label>
                  <input
                    type="text"
                    value={newHotel.country}
                    onChange={(e) => setNewHotel({ ...newHotel, country: e.target.value })}
                    placeholder="United States"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={newHotel.timezone}
                    onChange={(e) => setNewHotel({ ...newHotel, timezone: e.target.value })}
                    placeholder="e.g. UTC+5:30 (IST)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={newHotel.contactNumber}
                    onChange={(e) => setNewHotel({ ...newHotel, contactNumber: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="mb-2 block text-xs font-black tracking-widest text-slate-400 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newHotel.email}
                    onChange={(e) => setNewHotel({ ...newHotel, email: e.target.value })}
                    placeholder="contact@hotel.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                {/* SUPER ADMIN: Admin Credential Section (Commented out) */}
                {/* 
                {isSuperAdmin && (
                  <div className="md:col-span-3">
                    <div className="mt-2 mb-4 border-t border-slate-100 pt-6">
                      <h4 className="flex items-center gap-2 text-sm font-black tracking-widest text-blue-600 uppercase">
                        Assign Admin Credentials
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        Create credentials for the specific property manager
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                          Admin Username
                        </label>
                        <input
                          type="text"
                          value={newHotel.adminUsername}
                          onChange={(e) =>
                            setNewHotel({ ...newHotel, adminUsername: e.target.value })
                          }
                          placeholder="admin_id"
                          className="w-full rounded-xl border border-slate-200 bg-blue-50/30 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                          Admin Password
                        </label>
                        <input
                          type="password"
                          value={newHotel.adminPassword}
                          onChange={(e) =>
                            setNewHotel({ ...newHotel, adminPassword: e.target.value })
                          }
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-slate-200 bg-blue-50/30 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          value={newHotel.adminEmail}
                          onChange={(e) => setNewHotel({ ...newHotel, adminEmail: e.target.value })}
                          placeholder="admin@hotel.com"
                          className="w-full rounded-xl border border-slate-200 bg-blue-50/30 px-4 py-3 text-sm font-bold transition-all outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
                */}

                <div className="grid grid-cols-1 gap-5 pt-2 md:col-span-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="mb-1 block text-xs font-black tracking-widest text-slate-400 uppercase">
                      Property Logo
                    </label>
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, 'hotelLogo')}
                    />
                    <div
                      onClick={() => document.getElementById('logo-upload').click()}
                      className="group relative flex h-32 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-emerald-400 hover:bg-emerald-50/30"
                    >
                      {localPreviews.hotelLogo ||
                      (cleanImageUrl(newHotel.hotelLogo)
                        ? propertyService.getImageUrl(newHotel.hotelLogo)
                        : null) ? (
                        <AuthImage
                          src={
                            localPreviews.hotelLogo ||
                            propertyService.getImageUrl(newHotel.hotelLogo)
                          }
                          alt="Logo"
                          className="h-full w-full object-contain p-4"
                          fallback={
                            <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                              <Building2 size={24} />
                            </div>
                          }
                        />
                      ) : (
                        <>
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                            <UploadCloud size={20} />
                          </div>
                          <span className="text-pms-tiny font-black tracking-widest text-slate-500 uppercase">
                            Upload Logo
                          </span>
                        </>
                      )}
                      {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
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
                      id="cover-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, 'hotelImage')}
                    />
                    <div
                      onClick={() => document.getElementById('cover-upload').click()}
                      className="group relative flex h-32 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-blue-400 hover:bg-blue-50/30"
                    >
                      {localPreviews.hotelImage ||
                      (cleanImageUrl(newHotel.hotelImage)
                        ? propertyService.getImageUrl(newHotel.hotelImage)
                        : null) ? (
                        <AuthImage
                          src={
                            localPreviews.hotelImage ||
                            propertyService.getImageUrl(newHotel.hotelImage)
                          }
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
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-500 shadow-sm">
                            <UploadCloud size={20} />
                          </div>
                          <span className="text-pms-tiny font-black tracking-widest text-slate-500 uppercase">
                            Upload Cover
                          </span>
                        </>
                      )}
                      {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 rounded-2xl bg-slate-100 px-6 py-4 text-xs font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex flex-3 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
                  >
                    {isCreating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    {isCreating ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {hotels.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-4 py-20 text-center shadow-sm">
            <Building2 size={48} className="mb-4 text-slate-300" />
            <h3 className="mb-2 text-xl font-bold text-slate-900">Oops! No properties found.</h3>
            <p className="mb-6 max-w-md text-slate-500">
              You haven't been assigned any properties yet. Create your first property to get
              started.
            </p>
            <button
              onClick={handleCreateHotel}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-base font-bold text-white shadow-lg transition-all hover:bg-blue-700"
            >
              <Plus size={18} /> Create Property
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hotels.map((hotel, index) => (
              <div
                key={hotel.id || index}
                onClick={() => handleSelectHotel(hotel.id, hotel.hotelName || hotel.name)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400 hover:shadow-[0_20px_50px_-12px_rgba(16,185,129,0.15)]"
              >
                {/* 1. PREMIUM HEADER SECTION - (overflow-hidden removed to allow logo overlap) */}
                <div className="relative h-32 w-full">
                  {hotel.hotelImage && hotel.hotelImage !== 'string' ? (
                    <AuthImage
                      src={propertyService.getImageUrl(hotel.hotelImage)}
                      alt="Cover"
                      className="h-full w-full rounded-t-[31px] object-cover transition-transform duration-700 group-hover:scale-110"
                      fallback={
                        <div className="flex h-full w-full items-center justify-center rounded-t-[31px] bg-slate-100 text-slate-300">
                          <Building2 size={32} />
                        </div>
                      }
                    />
                  ) : (
                    <div className="h-full w-full rounded-t-[31px] bg-linear-to-br from-emerald-400/80 to-emerald-600"></div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 rounded-t-[31px] bg-linear-to-t from-black/60 to-transparent"></div>

                  {/* Super Admin Actions - Floating Top Right */}
                  {isSuperAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingHotel(hotel)
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-md transition-all hover:bg-emerald-500 hover:text-white"
                        title="Edit Property"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteHotel(e, hotel.id, hotel.hotelName)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-md transition-all hover:bg-rose-500 hover:text-white"
                        title="Delete Property"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  {/* Floating Logo Badge - Smaller & More Left Aligned */}
                  <div className="absolute -bottom-8 left-6 z-20 flex h-16 w-16 items-center justify-center overflow-hidden rounded-[24px] border-4 border-white bg-white shadow-[0_12px_30px_-8px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-emerald-500/30">
                    {hotel.hotelLogo && hotel.hotelLogo !== 'string' ? (
                      <AuthImage
                        src={propertyService.getImageUrl(hotel.hotelLogo)}
                        alt={hotel.hotelName}
                        className="h-full w-full object-contain p-2.5 transition-transform duration-500"
                        fallback={
                          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                            <Building2 size={24} />
                          </div>
                        }
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-50 to-emerald-100 text-emerald-600">
                        <Home size={24} />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. CARD CONTENT SECTION */}
                <div className="flex flex-1 flex-col p-6 pt-8">
                  <div className="mb-4">
                    <h3 className="mb-1.5 text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-emerald-700">
                      {hotel.hotelName || hotel.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-black tracking-widest text-emerald-700 uppercase">
                        ID: {hotel.id}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-black tracking-widest uppercase ${
                          hotel.status?.toUpperCase() === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {hotel.status || 'ACTIVE'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={14} className="text-emerald-500" />
                      <span className="text-xs leading-tight font-bold">
                        {hotel.city}, {hotel.state1}
                      </span>
                    </div>
                    {hotel.contactNumber && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone size={14} />
                        <span className="text-xs font-medium">{hotel.contactNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. INTERACTIVE FOOTER - Final "Proper" Polish */}
                  <div className="mt-auto pt-6">
                    <div className="flex w-full items-center justify-between rounded-2xl bg-emerald-50/50 p-4 transition-all duration-500 group-hover:bg-emerald-600 group-hover:shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm transition-transform duration-500 group-hover:scale-90">
                          <Building2 size={18} className="text-emerald-600" />
                        </div>
                        <span className="text-xs font-black tracking-widest text-emerald-800 uppercase transition-colors duration-500 group-hover:text-white">
                          Manage Dashboard
                        </span>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-emerald-600 backdrop-blur-sm transition-all duration-500 group-hover:translate-x-1 group-hover:bg-emerald-400 group-hover:text-white">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Edit Hotel Modal */}
        <PropertyEditModal
          isOpen={!!editingHotel}
          onClose={() => setEditingHotel(null)}
          hotel={editingHotel}
          onUpdate={handleUpdateHotel}
        />
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  )
}

export default PropertySelection
