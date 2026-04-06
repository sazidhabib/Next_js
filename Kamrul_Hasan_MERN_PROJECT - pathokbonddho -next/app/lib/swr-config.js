import api from './api';

/**
 * Standard SWR fetcher that uses the existing Axios instance
 * to benefit from interceptors (Auth tokens, 401 handling, etc.)
 */
export const fetcher = async (url) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (err) {
        const error = new Error(err.response?.data?.message || 'Data fetching failed');
        error.status = err.response?.status;
        throw error;
    }
};

/**
 * Common configuration for SWR
 */
export const swrConfig = {
    fetcher,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    dedupingInterval: 2000,
};
