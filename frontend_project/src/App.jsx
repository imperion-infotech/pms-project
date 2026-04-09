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

// Components ko lazy-load kiya gaya hai taaki app fast load ho
const PmsDashboard = lazy(() => import('./admin/pages/PropertyMaster/PmsDashboard'))
const HomeScreen = lazy(() => import('./user/pages/HomeScreen/HomeScreen'))
const Login = lazy(() => import('./user/pages/Auth/Login'))
const Register = lazy(() => import('./user/pages/Auth/Register'))
const ForgotPassword = lazy(() => import('./user/pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./user/pages/Auth/ResetPassword'))

/**
 * getRoleFromToken()
 * Token se user ka role (ADMIN/USER) nikalta hai.
 */
const getRoleFromToken = () => {
  let token = localStorage.getItem('access_token')
  if (!token) return null

  token = token.trim().replace(/^"|"$/g, '')

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.role) return payload.role
    if (payload.roles) return Array.isArray(payload.roles) ? payload.roles[0] : payload.roles
    if (payload.authorities)
      return Array.isArray(payload.authorities)
        ? payload.authorities[0]?.authority || payload.authorities[0]
        : payload.authorities

    const localRole = localStorage.getItem('user_role')
    if (localRole) return localRole

    return 'ROLE_USER'
  } catch {
    const localRole = localStorage.getItem('user_role')
    if (localRole) return localRole
    return 'ROLE_ADMIN'
  }
}

/**
 * AdminRoute: Sirf ADMIN aur MANAGER ko entry deta hai.
 */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />

  const role = getRoleFromToken() || ''
  const isAdminOrManager = ['ROLE_ADMIN', 'ADMIN', 'ROLE_MANAGER', 'MANAGER'].includes(
    role.toUpperCase(),
  )

  if (isAdminOrManager) {
    return children
  }
  return <Navigate to="/home" replace />
}

/**
 * UserRoute: Sirf logged-in users ko entry deta hai.
 */
const UserRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

/**
 * RootRoute: Decide karta hai ki "/" path par Admin Dashboard dikhega ya User Home.
 */
const RootRoute = () => {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />

  const role = getRoleFromToken() || ''
  const isAdminOrManager = ['ROLE_ADMIN', 'ADMIN', 'ROLE_MANAGER', 'MANAGER'].includes(
    role.toUpperCase(),
  )

  if (isAdminOrManager) {
    return <PmsDashboard />
  }

  return <Navigate to="/home" replace />
}

function App() {
  return (
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
                  path="/dashboard"
                  element={
                    <AdminRoute>
                      <PmsDashboard />
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
  )
}

export default App
