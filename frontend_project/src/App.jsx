/**
 * App.jsx - Root Application Component
 * 
 * Purpose:
 * This is the entry point of the React application. It handles global routing,
 * authentication protection, and wraps the app in the necessary state providers.
 * 
 * Key Functions:
 * 1. Routing: Uses react-router-dom to define paths like /login, /home, and /dashboard.
 * 2. Auth Protection: Includes AdminRoute and UserRoute to prevent unauthorized access.
 * 3. Theme & Sidebar: Wraps everything in ThemeProvider and SidebarProvider for global state.
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingProcess from './components/common/LoadingProcess';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import { NotificationProvider } from './context/NotificationContext';

// Components are lazy-loaded to optimize the initial bundle size
const PmsDashboard = lazy(() => import('./admin/pages/PropertyMaster/PmsDashboard'));
const HomeScreen = lazy(() => import('./user/pages/HomeScreen/HomeScreen'));
const Login = lazy(() => import('./user/pages/Auth/Login'));
const Register = lazy(() => import('./user/pages/Auth/Register'));

/**
 * getRoleFromToken()
 * Extracts the user's role from the JWT (Json Web Token) stored in localStorage.
 * This is used to decide where to redirect the user after login.
 */
const getRoleFromToken = () => {
  let token = localStorage.getItem('access_token');
  if (!token) return null;

  token = token.trim().replace(/^"|"$/g, '');

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role) return payload.role;
    if (payload.roles) return Array.isArray(payload.roles) ? payload.roles[0] : payload.roles;
    if (payload.authorities) return Array.isArray(payload.authorities) ? payload.authorities[0]?.authority || payload.authorities[0] : payload.authorities;

    const localRole = localStorage.getItem('user_role');
    if (localRole) return localRole;

    return 'ROLE_USER';
  } catch {
    const localRole = localStorage.getItem('user_role');
    if (localRole) return localRole;
    return 'ROLE_ADMIN';
  }
};

/**
 * AdminRoute Component
 * A wrapper that only allows users with ADMIN or MANAGER roles.
 * Non-admins are redirected back to the /home page.
 */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;

  const role = getRoleFromToken() || '';
  const isAdminOrManager = ['ROLE_ADMIN', 'ADMIN', 'ROLE_MANAGER', 'MANAGER'].includes(role.toUpperCase());

  if (isAdminOrManager) {
    return children;
  }
  return <Navigate to="/home" replace />;
};

/**
 * UserRoute Component
 * A wrapper that ensures the user is logged in (has a token).
 * Unauthenticated users are sent to the /login page.
 */
const UserRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

/**
 * RootRoute Component
 * Decides whether the "/" path should show the Admin Dashboard or User Home 
 * based on the user's permissions level.
 */
const RootRoute = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;

  const role = getRoleFromToken() || '';
  const isAdminOrManager = ['ROLE_ADMIN', 'ADMIN', 'ROLE_MANAGER', 'MANAGER'].includes(role.toUpperCase());

  if (isAdminOrManager) {
    return <PmsDashboard />;
  }

  return <Navigate to="/home" replace />;
};

function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <SidebarProvider>
          <BrowserRouter>
            {/* Suspense handles the "Loading..." state while lazy-loaded components are being fetched */}
            <Suspense fallback={<LoadingProcess isLoading={true} spinnerOnly={true} fullScreen={true} />}>
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* SMART ROOT ROUTE */}
                <Route path="/" element={<RootRoute />} />

                {/* PROTECTED ADMIN ROUTES */}
                <Route path="/dashboard" element={
                  <AdminRoute>
                    <PmsDashboard />
                  </AdminRoute>
                } />

                {/* PROTECTED USER ROUTES */}
                <Route path="/home" element={
                  <UserRoute>
                    <HomeScreen />
                  </UserRoute>
                } />



                {/* 404 FALLBACK */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SidebarProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;


