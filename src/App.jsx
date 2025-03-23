import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import VolunteerDashboard from './Components/VolunteerDashboard';
import NgoDashboard from './Components/NgoDashboard';
import GovernmentDashboard from './Components/GovernmentDashboard';
import Profile from './Components/Profile';
import { jwtDecode } from 'jwt-decode';


// Protected route component with user ID extraction
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        // Decode the JWT token to get user information
        const decoded = jwtDecode(token);

        setUserId(decoded.id);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Invalid token:", error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    }
    setLoading(false);
  }, [token]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!token || !userId) {
    // Not logged in or invalid token, redirect to home
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User doesn't have the required role, redirect to their dashboard
    switch(userRole) {
      case 'volunteer':
        return <Navigate to={`/volunteer/${userId}/dashboard`} replace />;
      case 'ngo':
        return <Navigate to={`/ngo/${userId}/dashboard`} replace />;
      case 'government':
        return <Navigate to={`/government/${userId}/dashboard`} replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has the required role
  // Clone children with userId prop
  return React.cloneElement(children, { userId });
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        
        {/* Generic dashboard (redirects to role-specific dashboard) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Role-specific dashboards with dynamic user ID */}
        <Route 
          path="/volunteer/:userId/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/ngo/:userId/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ngo']}>
              <NgoDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/government/:userId/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['government']}>
              <GovernmentDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Profile route with dynamic user ID */}
        <Route 
          path="/profile/:userId" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
