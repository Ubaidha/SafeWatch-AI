import axios from 'axios';
import { Platform } from 'react-native';

// Use your LAN IP for physical device testing
// Use your LAN IP for physical device testing
const BASE_URL = Platform.OS === 'web' ? 'http://localhost:8000/api' : 'http://10.93.126.77:8000/api';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add interceptors for debugging
api.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request.url, null, 2));
    console.log('Request Headers:', JSON.stringify(request.headers, null, 2));
    return request;
});

api.interceptors.response.use(response => {
    console.log('Response:', JSON.stringify(response.status, null, 2));
    return response;
}, error => {
    console.log('Response Error:', JSON.stringify(error.response?.data || error.message, null, 2));
    return Promise.reject(error);
});
