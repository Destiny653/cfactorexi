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
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/Home';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import { CartIcon } from './lib/CartIcon';
import ProductPage from './pages/Product';
import ProductDetail from './pages/productDetail';
import VerificationSuccess from './components/auth/VerificationSuccess';
import VerificationFailed from './components/auth/VerificationFailed';
import EmailVerified from './components/auth/EmailVerified';

// Create a client
const queryClient = new QueryClient();
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'react-hot-toast',
          style: {
            fontFamily: 'inherit',
            fontSize: '0.875rem',
            maxWidth: '500px',
          },
          success: {
            className: '!bg-emerald-500 !text-white',
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
            style: {
              border: '1px solid #059669',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
            },
          },
          error: {
            className: '!bg-rose-500 !text-white',
            iconTheme: {
              primary: '#fff',
              secondary: '#f43f5e',
            },
            style: {
              border: '1px solid #e11d48',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)',
            },
          },
          loading: {
            className: '!bg-blue-500 !text-white',
            style: {
              border: '1px solid #3b82f6',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
            },
          },
          blank: {
            className: '!bg-gray-500 !text-white',
          },
          custom: {
            className: '!bg-indigo-500 !text-white',
          },
        }}
      />
      <AuthProvider>
        <CartProvider>
          <Router>
            <CartIcon />
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
                element={<HomePage />}
              />
              <Route path="/email-verified" element={<EmailVerified />} />
              <Route path="/verification-success" element={<VerificationSuccess />} />
              <Route path="/verification-failed" element={<VerificationFailed />} />

              <Route
                path="/cart"
                element={<CartPage />}
              />
              <Route
                path="/products/:id"
                element={<ProductDetail />}
              />
              <Route
                path="/products"
                element={<ProductPage />}
              />
              <Route
                path="/checkout"
                element={<CheckoutPage />}
              />
              <Route
                path="login"
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
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
