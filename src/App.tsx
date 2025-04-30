import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './pages/Dashboard';
import './index.css';
import ForgotPasswordForm from './components/auth/forgotPasswordForm';
import ResetPasswordForm from './components/auth/resetPasswordForm';
import RegisterForm from './components/auth/registrationForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Create a client
const queryClient = new QueryClient();
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right" 
        toastOptions={{
          className: ' ',
          duration: 4000,
          style: { 
            backgroundColor: '#77e980e5',
            border: '1px solid #77e980e5',
            color: '#fff',
          },
        }}
      />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect to login or dashboard */}
            <Route
              path="/"
              element={<Navigate to="/login" replace />}
            />

            <Route
              path='/register'
              element={<RegisterForm />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPasswordForm />} // Placeholder for Forgot Password component
            />
            <Route
              path="/reset-password"
              element={<ResetPasswordForm />} // Placeholder for Reset Password component
            />

            {/* 404 Not Found */}
            <Route
              path="*"
              element={<Navigate to="/login" replace />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
