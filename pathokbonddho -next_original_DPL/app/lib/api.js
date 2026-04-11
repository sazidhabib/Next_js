// app/lib/api.js using fetch
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const STATIC_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api$/, '');

async function fetchWrapper(url, options = {}) {
    const isServer = typeof window === 'undefined';
    const token = !isServer ? localStorage.getItem('token') : null;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Merge headers (let options.headers override if provided)
    const headers = { ...defaultHeaders, ...options.headers };

    // Remove Content-Type if we're sending FormData (fetch handles boundary)
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;

    try {
        const response = await fetch(fullUrl, {
            ...options,
            headers,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            // Handle 401 Unauthorized
            if (response.status === 401) {
                if (!isServer) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                    
                    if (window.location.pathname !== '/login') {
                        if (window.location.pathname.startsWith('/admin')) {
                            const currentPath = window.location.pathname + window.location.search;
                            const loginUrl = `/login?expired=true&redirectTo=${encodeURIComponent(currentPath)}`;
                            window.location.replace(loginUrl);
                        } else {
                            window.location.reload();
                        }
                    }
                }
            }
            
            // Create an error object similar to Axios error
            const error = new Error(data?.message || data?.msg || 'Request failed');
            error.response = {
                status: response.status,
                data: data
            };
            throw error;
        }

        // Return Axios-like response object
        return {
            data: data,
            status: response.status,
            ok: response.ok,
            headers: response.headers
        };
    } catch (error) {
        throw error;
    }
}

const api = {
    get: (url, config = {}) => {
        let fullUrl = url;
        if (config.params) {
            const searchParams = new URLSearchParams();
            Object.keys(config.params).forEach(key => searchParams.append(key, config.params[key]));
            fullUrl += (fullUrl.includes('?') ? '&' : '?') + searchParams.toString();
        }
        return fetchWrapper(fullUrl, { method: 'GET', ...config });
    },
    post: (url, data, config = {}) => fetchWrapper(url, { 
        method: 'POST', 
        body: data instanceof FormData ? data : JSON.stringify(data), 
        ...config 
    }),
    put: (url, data, config = {}) => fetchWrapper(url, { 
        method: 'PUT', 
        body: data instanceof FormData ? data : JSON.stringify(data), 
        ...config 
    }),
    patch: (url, data, config = {}) => fetchWrapper(url, { 
        method: 'PATCH', 
        body: data instanceof FormData ? data : JSON.stringify(data), 
        ...config 
    }),
    delete: (url, config = {}) => fetchWrapper(url, { method: 'DELETE', ...config }),
};

export default api;
