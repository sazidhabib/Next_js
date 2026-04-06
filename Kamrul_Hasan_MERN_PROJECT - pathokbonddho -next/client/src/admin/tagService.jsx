// services/tagService.js
const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/tags`;

// This will be set by the component using the service
let getAuthToken = () => null;

export const setAuthTokenGetter = (getter) => {
    getAuthToken = getter;
};

export const getTags = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}?${queryString}`, {
        headers: headers
    });
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
};

export const getTag = async (id) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/${id}`, {
        headers: headers
    });
    if (!response.ok) throw new Error('Failed to fetch tag');
    return response.json();
};

export const createTag = async (formData) => {
    console.log('Sending create tag request with FormData');

    const token = getAuthToken();
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData - browser will set it automatically with boundary
    // IMPORTANT: Do NOT create a new FormData here - use the one passed from component

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: headers,
            body: formData, // Use the FormData directly from component
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Create tag error response:', errorText);
            throw new Error(`Failed to create tag: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Create tag success:', result);
        return result;
    } catch (error) {
        console.error('Create tag fetch error:', error);
        throw error;
    }
};

export const updateTag = async (id, formData) => {
    console.log('Sending update tag request with FormData for ID:', id);

    const token = getAuthToken();
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PATCH',
            headers: headers,
            body: formData, // Use the FormData directly from component
        });

        console.log('Update response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update tag error response:', errorText);
            throw new Error('Failed to update tag');
        }

        const result = await response.json();
        console.log('Update tag success:', result);
        return result;
    } catch (error) {
        console.error('Update tag fetch error:', error);
        throw error;
    }
};

export const deleteTag = async (id) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: headers,
    });

    if (!response.ok) throw new Error('Failed to delete tag');
    return response.json();
};

export const bulkDeleteTags = async (tagIds) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/bulk-delete`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ tagIds }),
    });

    if (!response.ok) throw new Error('Failed to delete tags');
    return response.json();
};