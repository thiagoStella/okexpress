import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import Login from './pages/Login';
import Atendente from './pages/Atendente';
import Motoboy from './pages/Motoboy';
import Admin from './pages/Admin';
import Lojista from './pages/Lojista';
import LogisticsTest from './pages/LogisticsTest';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they try to access unauthorized page
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'atendente') return <Navigate to="/atendente" />;
    if (user.role === 'motoboy') return <Navigate to="/motoboy" />;
    if (user.role === 'lojista') return <Navigate to="/lojista" />;
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/atendente" element={
              <ProtectedRoute allowedRoles={['atendente', 'admin']}>
                <Atendente />
              </ProtectedRoute>
            } />
            <Route path="/motoboy" element={
              <ProtectedRoute allowedRoles={['motoboy', 'admin']}>
                <Motoboy />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/lojista" element={
              <ProtectedRoute allowedRoles={['lojista', 'admin']}>
                <Lojista />
              </ProtectedRoute>
            } />
            <Route path="/logistics-test" element={<LogisticsTest />} />
          </Routes>
        </Router>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
