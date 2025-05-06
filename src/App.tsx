import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/Home';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import ProductPage from './pages/Product';
import ProductDetail from './pages/productDetail';
import AuthRoutes from './routes/auth.route';

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
            <Routes>
              <Route path="/*" element={<AuthRoutes />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
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
