import axios from 'axios';
import { API_URL } from '../helper/url'; 
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

export const login = async (username: string, password: string): Promise<User | any> => {
  try {
    const response = await axios.post(API_URL+'/auth/login', {
      username: username,
      password: password,
      expiresInMins: 60, // optional, defaults to 60
    });

    console.log("service res: ",response) 
    if(response.data.error) {
      toast.error(response.data.message)
      return null
    }
     
    // The response includes user details and a token
    return {
      id: response.data.id,
      username: response.data.username,
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      token: response.data.token
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error('Error setting up login request');
      }
    }
    throw new Error('An unexpected error occurred');
  }
};

export const logout = () => {
  // Clear any stored authentication tokens or user data
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Optional: Function to save user data after successful login
export const saveUserData = (userData: User) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', userData.token);
};

// Optional: Function to get current user
export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};
