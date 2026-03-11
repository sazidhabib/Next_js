const BASE_URL = "https://demo.nextideasolution.com/api";
export const IMAGE_BASE_URL = "https://demo.nextideasolution.com/uploads/demos/";

/**
 * Fetches demos from the API with optional filters.
 * @param {Object} params - Fetch parameters.
 * @param {number} [params.page=1] - Page number.
 * @param {number} [params.limit=10] - Items per page.
 * @param {number|string} [params.category_id] - Filter by category ID.
 * @param {string} [params.search] - Search query.
 * @param {string} [params.lang='en'] - Language ('en' or 'bn').
 */
export async function getDemos({ page = 1, limit = 10, category_id, search, lang = 'en' } = {}) {
    const url = new URL(`${BASE_URL}/get-demos.php`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (category_id) url.searchParams.append("category_id", category_id);
    if (search) url.searchParams.append("search", search);
    if (lang) url.searchParams.append("lang", lang);

    try {
        const response = await fetch(url.toString(), {
            cache: 'no-store' // Ensure fresh data
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching demos:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches all categories from the API.
 */
export async function getCategories() {
    try {
        const response = await fetch(`${BASE_URL}/get-categories.php`, {
            cache: 'force-cache', // Categories don't change often
            next: { revalidate: 3600 } // Revalidate every hour
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches a single demo by ID.
 * @param {number|string} id - Demo ID.
 */
export async function getDemoById(id) {
    try {
        const response = await fetch(`${BASE_URL}/get-demo-by-id.php?id=${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching demo with ID ${id}:`, error);
        return { success: false, error: error.message };
    }
}
