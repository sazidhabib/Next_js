// app/lib/api.js using fetch
export const getApiBaseUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    if (typeof window !== 'undefined') {
        try {
            if (envUrl.startsWith('http')) {
                const targetUrl = new URL(envUrl);
                const targetHost = targetUrl.hostname.replace(/^www\./, '');
                const currentHost = window.location.hostname.replace(/^www\./, '');
                const targetPort = targetUrl.port || (targetUrl.protocol === 'https:' ? '443' : '80');
                const currentPort = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');

                // If accessing from the same root domain AND port, use relative '/api'
                // This guarantees browser requests are always SAME-ORIGIN in production.
                if (targetHost === currentHost && targetPort === currentPort) {
                    return '/api';
                }
            }
        } catch (e) {}
    }
    return envUrl;
};

export const getStaticBaseUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        }
        return window.location.origin;
    }
    return (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.FRONTEND_URL ||
        (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api$/, '') ||
        (process.env.NODE_ENV === 'production' ? 'https://pathakbondhu.com' : 'http://localhost:5000')
    );
};

export const STATIC_URL = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000')
        : window.location.origin)
    : (process.env.NEXT_PUBLIC_API_BASE_URL ||
       process.env.FRONTEND_URL ||
       (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api$/, '') ||
       (process.env.NODE_ENV === 'production' ? 'https://pathakbondhu.com' : 'http://localhost:5000'));

export const sanitizeImageUrl = (imagePath) => {
    if (!imagePath) return null;
    let url = String(imagePath).trim();
    if (!url) return null;

    const base = getStaticBaseUrl();

    // If already absolute URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
        // If pointing to localhost/127.0.0.1 but we are on production / non-localhost
        const isClientNonLocal = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const isServerProd = typeof window === 'undefined' && process.env.NODE_ENV === 'production';
        if (isClientNonLocal || isServerProd) {
            url = url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, base);
        }

        // Force HTTPS if not on localhost
        const isLocal = url.includes('127.0.0.1') || url.includes('localhost');
        if (!isLocal && url.startsWith('http://')) {
            url = url.replace(/^http:\/\//, 'https://');
        }
        return url;
    }

    return `${base}/${url.replace(/^\//, '')}`;
};

async function fetchWrapper(url, options = {}) {
    const isServer = typeof window === 'undefined';
    let token = null;
    if (!isServer) {
        token = localStorage.getItem('token');
        if (!token && typeof document !== 'undefined') {
            token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        }
    }

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

    const baseUrl = getApiBaseUrl();
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;

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
            const error = new Error(data?.message || data?.msg || `Request failed with status ${response.status}`);
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
        console.error(`API Fetch Error [${options.method || 'GET'}]:`, fullUrl, error.message);
        // On client, also check if it's a network error
        if (typeof window !== 'undefined' && error.name === 'TypeError' && error.message === 'Failed to fetch') {
            console.warn('Network error detected. Is the backend server running at', baseUrl, '?');
        }
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
