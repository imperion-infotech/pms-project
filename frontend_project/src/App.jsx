/**
 * App.jsx - Project ka Main Router
 *
 * Is file mein decide hota hai ki user ko login page dikhana hai,
 * admin dashboard, ya user home screen.
 * Role-based authentication (Admin/User) yahi se control hota hai.
 */
import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoadingProcess from './components/common/LoadingProcess'
import { ThemeProvider } from './context/ThemeContext'
import { SidebarProvider } from './context/SidebarContext'
import { NotificationProvider } from './context/NotificationContext'
import ErrorBoundary from './components/common/ErrorBoundary' // Added for Industrial Stability

// Components ko lazy-load kiya gaya hai taaki app fast load ho
const PmsDashboard = lazy(() => import('./admin/pages/PropertyMaster/PmsDashboard'))
const HomeScreen = lazy(() => import('./user/pages/HomeScreen/HomeScreen'))
const Login = lazy(() => import('./user/pages/Auth/Login'))
const Register = lazy(() => import('./user/pages/Auth/Register'))
const ForgotPassword = lazy(() => import('./user/pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./user/pages/Auth/ResetPassword'))
const PropertySelection = lazy(() => import('./admin/pages/PropertySelection/PropertySelection'))
const PropertyDetails = lazy(() => import('./admin/pages/PropertyMaster/PropertyDetails'))

/**
 * getRoleFromToken()
 * Token se user ka role (ADMIN/USER) nikalta hai safely.
 */
const getRoleFromToken = () => {
  const token = localStorage.getItem('access_token')
  if (!token) return null

  try {
    const cleanToken = token.trim().replace(/^"|"$/g, '')
    const payload = JSON.parse(atob(cleanToken.split('.')[1]))

    // Sabse pehle roles array check karein
    if (payload.roles && payload.roles.length > 0) {
      const role = payload.roles[0].name || payload.roles[0]
      return typeof role === 'object' ? role.name : role
    }

    // Fallback keys
    return payload.role || payload.authority || localStorage.getItem('user_role') || 'ROLE_USER'
  } catch {
    return localStorage.getItem('user_role') || 'ROLE_USER'
  }
}

/**
 * checkIsAdmin: Helper to determine if user has elevated privileges
 */
const checkIsAdmin = () => {
  const role = String(getRoleFromToken() || '').toUpperCase()
  return ['ROLE_ADMIN', 'ADMIN', 'ROLE_MANAGER', 'MANAGER', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN'].some(
    (r) => role.includes(r),
  )
}

/**
 * checkIsSuperAdmin: Helper to determine if user has Super Admin privileges
 */
const checkIsSuperAdmin = () => {
  const token = localStorage.getItem('access_token')
  if (!token) return false
  try {
    const cleanToken = token.trim().replace(/^"|"$/g, '')
    const payload = JSON.parse(atob(cleanToken.split('.')[1]))
    const roles = payload.roles || []
    return roles.some((r) => {
      const name = (typeof r === 'object' ? r.name || r.authority : r) || ''
      const roleStr = String(name).toUpperCase()
      return roleStr.includes('SUPER_ADMIN') || roleStr.includes('SUPERADMIN')
    })
  } catch {
    return String(localStorage.getItem('user_role') || '')
      .toUpperCase()
      .includes('SUPER_ADMIN')
  }
}

/**
 * AdminRoute: Sirf ADMIN aur MANAGER ko entry deta hai.
 */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />

  if (checkIsAdmin() || checkIsSuperAdmin()) {
    const activeHotelId = localStorage.getItem('activeHotelId')

    // If no hotel selected, try to auto-select if user has any hotel
    if (!activeHotelId || activeHotelId === 'undefined' || activeHotelId === 'null') {
      const storedHotels = localStorage.getItem('adminHotels')
      if (storedHotels) {
        try {
          const hotels = JSON.parse(storedHotels)
          if (hotels.length > 0) {
            localStorage.setItem('activeHotelId', hotels[0].id)
            localStorage.setItem('activeHotelName', hotels[0].hotelName || hotels[0].name)
            return children
          }
        } catch (e) {
          console.error('Auto-selection error', e)
        }
      }

      // If Super Admin has no hotel, redirect to property selection
      if (checkIsSuperAdmin()) {
        return <Navigate to="/property-selection" replace />
      }
      // For normal admin, avoid property-selection as per requirements
      return children
    }
    return children
  }
  return <Navigate to="/home" replace />
}

/**
 * PropertySelectionRoute: Selection page security check
 */
const PropertySelectionRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />

  // Only Super Admins should be here
  if (checkIsSuperAdmin()) return children
  return <Navigate to="/home" replace />
}

/**
 * UserRoute: Sirf logged-in users ko entry deta hai.
 */
const UserRoute = ({ children }) => {
  if (!localStorage.getItem('access_token')) return <Navigate to="/login" replace />
  return children
}

/**
 * RootRoute: Decide karta hai ki "/" path par kahan bhejna hai.
 */
const RootRoute = () => {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />

  const isAdmin = checkIsAdmin()
  const isSuper = checkIsSuperAdmin()

  // 1. Super Admin always needs selection to pick a node
  if (isSuper) {
    return <Navigate to="/property-selection" replace />
  }

  // 2. Regular Admin Logic
  if (isAdmin) {
    const storedHotels = localStorage.getItem('adminHotels')
    let hotelId = localStorage.getItem('activeHotelId')

    if (storedHotels) {
      try {
        const hotels = JSON.parse(storedHotels)

        // Auto-select first hotel if none is active
        if (hotels.length > 0 && (!hotelId || hotelId === 'undefined' || hotelId === 'null')) {
          localStorage.setItem('activeHotelId', hotels[0].id)
          localStorage.setItem('activeHotelName', hotels[0].hotelName || hotels[0].name)
        }
      } catch {
        // Fallback to home if JSON is corrupt
      }
    }

    return <Navigate to="/home" replace />
  }

  return <Navigate to="/home" replace />
}

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <ThemeProvider>
          <SidebarProvider>
            <BrowserRouter>
              {/* Suspense: Jab tak page load ho raha hai, tab tak loader dikhata hai */}
              <Suspense
                fallback={<LoadingProcess isLoading={true} spinnerOnly={true} fullScreen={true} />}
              >
                <Routes>
                  {/* PUBLIC ROUTES - Sab ke liye open hain */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* SMART ROOT ROUTE - Role check karke sahi jagah bhejta hai */}
                  <Route path="/" element={<RootRoute />} />

                  {/* PROTECTED ADMIN ROUTES - Sirf admin ke liye */}
                  <Route
                    path="/property-selection"
                    element={
                      <PropertySelectionRoute>
                        <PropertySelection />
                      </PropertySelectionRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <AdminRoute>
                        <PmsDashboard />
                      </AdminRoute>
                    }
                  />

                  <Route
                    path="/property-details"
                    element={
                      <AdminRoute>
                        <PropertyDetails />
                      </AdminRoute>
                    }
                  />

                  {/* PROTECTED USER ROUTES - Logged-in users ke liye */}
                  <Route
                    path="/home"
                    element={
                      <UserRoute>
                        <HomeScreen />
                      </UserRoute>
                    }
                  />

                  {/* 404 FALLBACK - Agar link galat hai toh home par bhej do */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </SidebarProvider>
        </ThemeProvider>
      </NotificationProvider>
    </ErrorBoundary>
  )
}

export default App
