import axios from 'axios';

// const API_BASE_URL = 'https://cfactorexiii.onrender.com'
const API_BASE_URL='http://localhost:3000';
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
