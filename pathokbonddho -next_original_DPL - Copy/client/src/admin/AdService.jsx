// services/adService.js
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/ads`; // Update with your actual API URL

// Create axios instance without interceptors initially
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Function to get token for requests
const getAuthToken = () => {
    return localStorage.getItem("token");
};

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);

        // Auto-logout if token is invalid
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("isAdmin");
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export const getAds = async (params = {}) => {
    try {
        console.log('Making GET request to:', API_BASE_URL, 'with params:', params);
        const response = await api.get('/', { params });
        console.log('GET Ads Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching ads:', error);
        throw error;
    }
};

export const getAd = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ad:', error);
        throw error;
    }
};

export const createAd = async (formData) => {
    try {
        console.log('Creating ad with data:', formData);
        const response = await api.post('/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Create Ad Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating ad:', error);
        throw error;
    }
};

export const updateAd = async (id, formData) => {
    try {
        const response = await api.patch(`/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating ad:', error);
        throw error;
    }
};

export const deleteAd = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting ad:', error);
        throw error;
    }
};

export const bulkDeleteAds = async (adIds) => {
    try {
        const response = await api.post('/bulk-delete', { adIds });
        return response.data;
    } catch (error) {
        console.error('Error bulk deleting ads:', error);
        throw error;
    }
};
export const recordImpression = async (id) => {
    try {
        const response = await makeAuthenticatedRequest({
            method: 'POST',
            url: `/${id}/impression`
        });
        return response.data;
    } catch (error) {
        console.error('Error recording impression:', error);
        throw error;
    }
};

export const recordClick = async (id) => {
    try {
        const response = await makeAuthenticatedRequest({
            method: 'POST',
            url: `/${id}/click`
        });
        return response.data;
    } catch (error) {
        console.error('Error recording click:', error);
        throw error;
    }
};

export const getAdsByPosition = async (position, page = null) => {
    try {
        const params = { position };
        if (page) params.page = page;

        const response = await makeAuthenticatedRequest({
            method: 'GET',
            url: '/position',
            params
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching ads by position:', error);
        throw error;
    }
};