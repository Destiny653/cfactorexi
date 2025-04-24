// hooks/useAuthApi.ts
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../helper/url';

export const useAuthApi = () => {
  const login = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch( API_URL+'/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return response.json();
    },
  });

  const register = useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      username: string;
      password: string;
      age?: number;
      gender?: string;
      phone?: string;
      birthDate?: string;
    }) => {
      const response = await fetch( API_URL+'/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return response.json();
    },
  });

  const forgotPassword = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch( API_URL+'/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      return response.json();
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      const response = await fetch(`${API_URL}/auth/reset-password?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      return response.json();
    },
  });

  return {
    login,
    register,
    forgotPassword,
    resetPassword,
  };
};