/**
 * Converts an HTTP URL to HTTPS if the current environment is running over HTTPS.
 * This prevents Mixed Content errors in production.
 * 
 * @param {string} url - The URL to check and possibly upgrade
 * @returns {string} - The upgraded URL or the original if no change needed
 */
export const toHttps = (url) => {
    if (!url) return '';
    if (typeof window === 'undefined') return url;

    // If the current page is loaded over HTTPS
    if (window.location.protocol === 'https:') {
        // And the resource URL starts with HTTP
        if (url.startsWith('http:')) {
            return url.replace('http:', 'https:');
        }
    }

    return url;
};
