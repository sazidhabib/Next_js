// Use relative path for local development to hit Next.js API routes
const BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

export const IMAGE_BASE_URL = "/uploads/demos/"; // Local uploads path

/**
 * Fetches demos from the API with optional filters.
 */
export async function getDemos({ page = 1, limit = 10, category_id, search, lang = 'en' } = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (category_id) params.append("category_id", category_id);
    if (search) params.append("search", search);
    if (lang) params.append("lang", lang);

    try {
        // Updated to use local Next.js API route
        const response = await fetch(`${BASE_URL}/api/portfolio?${params.toString()}`);
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
        const response = await fetch(`${BASE_URL}/api/categories`, {
            cache: 'no-store', // Categories should reflect local DB
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
 */
export async function getDemoById(id) {
    try {
        const response = await fetch(`${BASE_URL}/api/portfolio/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching demo with ID ${id}:`, error);
        return { success: false, error: error.message };
    }
}
