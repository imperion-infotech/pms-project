import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, ArrowRight, Home, LogOut } from 'lucide-react'
import api from '../../../services/api'

const PropertySelection = () => {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const [hotels] = useState(() => {
    const storedHotels = localStorage.getItem('adminHotels')
    if (storedHotels) {
      try {
        return JSON.parse(storedHotels)
      } catch (e) {
        console.error('Error parsing hotels from storage', e)
        return []
      }
    }
    return []
  })

  const handleSelectHotel = async (hotelId, hotelName) => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      const username = localStorage.getItem('username')

      const response = await api.post('/auth/select-hotel', null, {
        params: {
          hotelId: String(hotelId),
          username: username,
        },
      })

      let newToken = null
      const data = response.data

      if (typeof data === 'string') {
        newToken = data.trim()
      } else if (data) {
        newToken = data.token || data.access_token || data.jwt || JSON.stringify(data)
      }

      if (newToken) {
        const cleanToken = newToken.replace(/^"|"$/g, '').trim()
        localStorage.setItem('access_token', cleanToken)
        localStorage.setItem('activeHotelId', hotelId)
        localStorage.setItem('activeHotelName', hotelName)
        navigate('/dashboard')
      } else {
        throw new Error('New token not found in response')
      }
    } catch (error) {
      console.error('Hotel selection error:', error)
      const status = error.response ? error.response.status : 'Network Error'
      const message = error.response?.data?.message || error.message
      alert(`Failed to select hotel (Status: ${status}). Error: ${message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateHotel = () => {
    alert('This feature is coming soon! You will be able to create new hotels here.')
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 shadow-md">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Imperion PMS</h1>
            <p className="text-xs font-medium tracking-wide text-slate-500">Property Management</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
        >
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-extrabold text-slate-900">Select a Property</h2>
            <p className="text-slate-500">Choose a hotel to access its management dashboard</p>
          </div>
          <button
            onClick={handleCreateHotel}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            <Plus size={18} /> Add New Hotel
          </button>
        </div>

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
                onClick={() => handleSelectHotel(hotel.id, hotel.name)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-50/50 transition-all duration-500 group-hover:bg-blue-100/50"></div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-blue-600 shadow-inner transition-all group-hover:bg-blue-600 group-hover:text-white">
                    <Home size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                      {hotel.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        ID: {hotel.id}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase transition-colors group-hover:text-blue-600">
                      Dashboard
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default PropertySelection
