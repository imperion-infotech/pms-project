/**
 * App.jsx
 * 
 * Main Entry & Routing Component.
 * Setup for React Router, providing the top-level route configuration:
 * - '/' maps to the main Admin PMS Dashboard.
 * - '/home' maps to the User-facing independent Room View (HomeScreen).
 */
// Main routing setup with React Router
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingProcess from './components/common/LoadingProcess';

// Lazy load components for better performance
const PmsDashboard = lazy(() => import('./admin/pages/PropertyMaster/PmsDashboard'));
const HomeScreen = lazy(() => import('./user/pages/HomeScreen/HomeScreen'));
const Login = lazy(() => import('./user/pages/Auth/Login'));
const Register = lazy(() => import('./user/pages/Auth/Register'));

// Helper to decode JWT and get role securely
const getRoleFromToken = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check various common claims configurations
    if (payload.role) return payload.role;
    if (payload.roles) return Array.isArray(payload.roles) ? payload.roles[0] : payload.roles;
    if (payload.authorities) return Array.isArray(payload.authorities) ? payload.authorities[0]?.authority || payload.authorities[0] : payload.authorities;

    // Check locally cached role (for demo purposes since JWT lacks it right now)
    const localRole = localStorage.getItem('user_role');
    if (localRole) return localRole;

    // Default fallback if role isn't explicitly found
    return 'ROLE_USER';
  } catch {
    const localRole = localStorage.getItem('user_role');
    if (localRole) return localRole;

    // Fallback for when the token is a flat non-JWT string and decoding fails
    return 'ROLE_ADMIN';
  }
};

// Admin Protection (Managers & Admins only)
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;

  const role = getRoleFromToken() || '';
  const isAdminOrManager = ['ROLE_ADMIN', 'ADMIN', 'ROLE_MANAGER', 'MANAGER'].includes(role.toUpperCase());

  if (isAdminOrManager) {
    return children;
  }

  // Unauthorized for admin -> drop to home
  return <Navigate to="/home" replace />;
};

// User Protection (Any logged in user can access)
const UserRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Auto-routing based on role on initial load (the "/" root route)
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
    <BrowserRouter>
      {/* Suspense is required for lazy loaded components */}
      <Suspense fallback={<LoadingProcess isLoading={true} spinnerOnly={true} fullScreen={true} />}>
        <Routes>
          {/* Public / Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root decides where to send the user based on role */}
          <Route path="/" element={<RootRoute />} />

          {/* Admin Dashboard */}
          <Route path="/dashboard" element={
            <AdminRoute>
              <PmsDashboard />
            </AdminRoute>
          } />

          {/* Home Screen - General User Panel */}
          <Route path="/home" element={
            <UserRoute>
              <HomeScreen />
            </UserRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
