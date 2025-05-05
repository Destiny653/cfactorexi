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
              <Route
                path="/cart"
                element={<CartPage />}
              />
              <Route
                path="/products/:id"
                element={<ProductDetail/>}
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
