const BASE_URL = 'https://demo.nextideasolution.com/api';
export const IMAGE_BASE_URL = "https://demo.nextideasolution.com/uploads/demos/";

/**
 * Fetches demos from the external PHP API with optional filters.
 */
export async function getDemos({ page = 1, limit = 10, category_id, search, lang = 'en' } = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (category_id) params.append("category_id", category_id);
    if (search) params.append("search", search);
    params.append("lang", lang);

    try {
        const response = await fetch(`${BASE_URL}/get-demos.php?${params.toString()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching demos:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches all categories from the external PHP API.
 */
export async function getCategories() {
    try {
        const response = await fetch(`${BASE_URL}/get-categories.php`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches a single demo by ID from the external PHP API.
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
