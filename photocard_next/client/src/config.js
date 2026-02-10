const getApiUrl = () => {
    const configuredUrl = process.env.NEXT_PUBLIC_API_URL || 'https://photoframe.nextideasolution.com/api';

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
            return 'https://photoframe.nextideasolution.com/api';
        }
    } else {
        // SERVER SIDE (Next.js Server Components / Actions)
        // If the URL is localhost but set as https, force http to avoid ERR_SSL_WRONG_VERSION_NUMBER
        if (configuredUrl.includes('localhost') && configuredUrl.startsWith('https://')) {
            return configuredUrl.replace('https://', 'http://');
        }
    }

    return configuredUrl;
};

export const API_URL = getApiUrl();
