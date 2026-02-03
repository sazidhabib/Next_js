const getApiUrl = () => {
    const configuredUrl = process.env.NEXT_PUBLIC_API_URL || 'https://card.deshprobaho.com/api';

    // Check if running in browser
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

        // Force HTTP for localhost to avoid SSL errors
        if (isLocalhost) {
            return 'http://localhost:5000/api';
        }

        // If we are NOT on localhost, but the API URL IS localhost, force the production URL
        if (!isLocalhost && configuredUrl.includes('localhost')) {
            return 'https://card.deshprobaho.com/api';
        }
    }

    return configuredUrl;
};

export const API_URL = getApiUrl();
