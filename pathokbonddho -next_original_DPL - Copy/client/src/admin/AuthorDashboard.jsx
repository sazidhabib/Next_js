// components/AuthorDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../store/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthorDashboard = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecial, setFilterSpecial] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNext: false,
        hasPrev: false
    });

    const { token, isLoggedIn } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        websiteLink: '',
        isSpecialAuthor: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // API base URL from environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Axios instance with auth header
    const axiosWithAuth = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    // Fetch authors
    const fetchAuthors = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: 10,
                ...(searchTerm && { search: searchTerm }),
                ...(filterSpecial && { isSpecialAuthor: filterSpecial })
            });

            const response = await axios.get(`${API_BASE_URL}/api/authors?${params}`);
            console.log('API Response:', response.data); // Debug log

            // Safely handle the response data with multiple fallbacks
            const responseData = response.data || {};
            const authorsData = responseData.authors || responseData.data || responseData || [];

            setAuthors(Array.isArray(authorsData) ? authorsData : []);

            // Safely handle pagination data
            setPagination({
                currentPage: responseData.currentPage || responseData.page || 1,
                totalPages: responseData.totalPages || 1,
                totalCount: responseData.totalCount || responseData.count || authorsData.length || 0,
                hasNext: responseData.hasNext || false,
                hasPrev: responseData.hasPrev || false
            });
        } catch (error) {
            console.error('Error fetching authors:', error);
            toast.error('Failed to fetch authors');
            setAuthors([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, [searchTerm, filterSpecial]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            websiteLink: '',
            isSpecialAuthor: false
        });
        setImageFile(null);
        setImagePreview('');
        setEditingAuthor(null);
    };

    // Open modal for creating new author
    const handleCreate = () => {
        resetForm();
        setShowModal(true);
    };

    // Open modal for editing author
    const handleEdit = (author) => {
        setFormData({
            name: author.name || '',
            description: author.description || '',
            websiteLink: author.websiteLink || '',
            isSpecialAuthor: author.isSpecialAuthor || false
        });
        setImagePreview(author.image ? `${API_BASE_URL}/uploads/${author.image}` : '');
        setEditingAuthor(author);
        setShowModal(true);
    };

    // Submit form (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if user is logged in
        if (!isLoggedIn || !token) {
            toast.error('Please login to perform this action');
            return;
        }

        setLoading(true);

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('websiteLink', formData.websiteLink);
        submitData.append('isSpecialAuthor', formData.isSpecialAuthor);

        if (imageFile) {
            submitData.append('image', imageFile);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };

            if (editingAuthor) {
                await axios.patch(`${API_BASE_URL}/api/authors/${editingAuthor.id}`, submitData, config);
                toast.success('Author updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/api/authors`, submitData, config);
                toast.success('Author created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchAuthors(pagination.currentPage);
        } catch (error) {
            console.error('Error saving author:', error);
            if (error.response?.status === 401) {
                toast.error('Unauthorized: Please login again');
            } else {
                const errorMessage = error.response?.data?.message || 'Failed to save author';
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete author
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this author?')) {
            return;
        }

        // Check if user is logged in
        if (!isLoggedIn || !token) {
            toast.error('Please login to perform this action');
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/api/authors/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Author deleted successfully');
            fetchAuthors(pagination.currentPage);
        } catch (error) {
            console.error('Error deleting author:', error);
            if (error.response?.status === 401) {
                toast.error('Unauthorized: Please login again');
            } else {
                toast.error('Failed to delete author');
            }
        }
    };

    // Bulk delete
    const handleBulkDelete = async () => {
        if (selectedAuthors.length === 0) {
            toast.warning('Please select authors to delete');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedAuthors.length} author(s)?`)) {
            return;
        }

        // Check if user is logged in
        if (!isLoggedIn || !token) {
            toast.error('Please login to perform this action');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/authors/bulk-delete`,
                { authorIds: selectedAuthors },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            toast.success(`${selectedAuthors.length} author(s) deleted successfully`);
            setSelectedAuthors([]);
            fetchAuthors(pagination.currentPage);
        } catch (error) {
            console.error('Error bulk deleting authors:', error);
            if (error.response?.status === 401) {
                toast.error('Unauthorized: Please login again');
            } else {
                toast.error('Failed to delete authors');
            }
        }
    };

    // Toggle author selection
    const toggleAuthorSelection = (id) => {
        setSelectedAuthors(prev =>
            prev.includes(id)
                ? prev.filter(authorId => authorId !== id)
                : [...prev, id]
        );
    };

    // Select all authors on current page
    const toggleSelectAll = () => {
        if (selectedAuthors.length === authors.length && authors.length > 0) {
            setSelectedAuthors([]);
        } else {
            setSelectedAuthors(authors.map(author => author.id));
        }
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (pagination.hasNext) {
            fetchAuthors(pagination.currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (pagination.hasPrev) {
            fetchAuthors(pagination.currentPage - 1);
        }
    };

    // Safe author data access
    const safeAuthors = Array.isArray(authors) ? authors : [];

    return (
        <div className="container-fluid py-4 custom-font-initial">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
            <div className="row mb-4">
                <div className="col">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="h3 mb-0">Authors Management</h1>
                        <button
                            className="btn btn-primary"
                            onClick={handleCreate}
                            disabled={loading || !isLoggedIn}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Add New Author
                        </button>
                    </div>
                    {!isLoggedIn && (
                        <div className="alert alert-warning mt-2" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            You need to be logged in to create, edit, or delete authors.
                        </div>
                    )}
                </div>
            </div>

            {/* Filters and Search */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search authors by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" type="button">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={filterSpecial}
                        onChange={(e) => setFilterSpecial(e.target.value)}
                    >
                        <option value="">All Authors</option>
                        <option value="true">Special Authors</option>
                        <option value="false">Regular Authors</option>
                    </select>
                </div>
                <div className="col-md-3">
                    {selectedAuthors.length > 0 && (
                        <button
                            className="btn btn-danger w-100"
                            onClick={handleBulkDelete}
                            disabled={loading || !isLoggedIn}
                        >
                            <i className="bi bi-trash me-2"></i>
                            Delete Selected ({selectedAuthors.length})
                        </button>
                    )}
                </div>
            </div>

            {/* Authors Table */}
            <div className="card">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={safeAuthors.length > 0 && selectedAuthors.length === safeAuthors.length}
                                                    onChange={toggleSelectAll}
                                                    disabled={safeAuthors.length === 0 || !isLoggedIn}
                                                />
                                            </th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Website</th>
                                            <th>Special Author</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {safeAuthors.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-4">
                                                    No authors found
                                                </td>
                                            </tr>
                                        ) : (
                                            safeAuthors.map(author => (
                                                <tr key={author.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={selectedAuthors.includes(author.id)}
                                                            onChange={() => toggleAuthorSelection(author.id)}
                                                            disabled={!isLoggedIn}
                                                        />
                                                    </td>
                                                    <td>
                                                        {author.image ? (
                                                            <img
                                                                src={`${API_BASE_URL}/uploads/${author.image}`}
                                                                alt={author.name}
                                                                className="author-image"
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="no-image-placeholder">
                                                                <i className="bi bi-person" style={{ fontSize: '24px' }}></i>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <strong>{author.name}</strong>
                                                    </td>
                                                    <td>
                                                        <div className="author-description">
                                                            {author.description && author.description.length > 100
                                                                ? `${author.description.substring(0, 100)}...`
                                                                : author.description || 'No description'
                                                            }
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {author.websiteLink ? (
                                                            <a
                                                                href={author.websiteLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-decoration-none"
                                                            >
                                                                <i className="bi bi-link-45deg me-1"></i>
                                                                Visit
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted">No website</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {author.isSpecialAuthor ? (
                                                            <span className="badge bg-success">
                                                                <i className="bi bi-check-circle me-1"></i>
                                                                Special
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-secondary">Regular</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {author.createdAt ? new Date(author.createdAt).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => handleEdit(author)}
                                                                title="Edit"
                                                                disabled={!isLoggedIn}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => handleDelete(author.id)}
                                                                title="Delete"
                                                                disabled={!isLoggedIn}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <div>
                                        Showing {((pagination.currentPage - 1) * 10) + 1} to{' '}
                                        {Math.min(pagination.currentPage * 10, pagination.totalCount)} of{' '}
                                        {pagination.totalCount} authors
                                    </div>
                                    <nav>
                                        <ul className="pagination mb-0">
                                            <li className={`page-item ${!pagination.hasPrev && 'disabled'}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={handlePrevPage}
                                                    disabled={!pagination.hasPrev}
                                                >
                                                    Previous
                                                </button>
                                            </li>
                                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                                <li
                                                    key={page}
                                                    className={`page-item ${page === pagination.currentPage && 'active'}`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() => fetchAuthors(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${!pagination.hasNext && 'disabled'}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={handleNextPage}
                                                    disabled={!pagination.hasNext}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingAuthor ? 'Edit Author' : 'Create New Author'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="name" className="form-label">
                                                    Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="websiteLink" className="form-label">
                                                    Website Link
                                                </label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    id="websiteLink"
                                                    name="websiteLink"
                                                    value={formData.websiteLink}
                                                    onChange={handleInputChange}
                                                    disabled={loading}
                                                    placeholder="https://example.com"
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="isSpecialAuthor"
                                                        name="isSpecialAuthor"
                                                        checked={formData.isSpecialAuthor}
                                                        onChange={handleInputChange}
                                                        disabled={loading}
                                                    />
                                                    <label htmlFor="isSpecialAuthor" className="form-check-label">
                                                        Mark as Special Author
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="image" className="form-label">
                                                    Author Image
                                                </label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="image"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    disabled={loading}
                                                />
                                                <div className="form-text">
                                                    Upload author profile picture (will be converted to WebP)
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="description" className="form-label">
                                                    Description
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    rows="8"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    disabled={loading}
                                                    placeholder="Enter author description..."
                                                />
                                            </div>

                                            {imagePreview && (
                                                <div className="text-center">
                                                    <p className="small mb-2">Image Preview:</p>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="img-thumbnail"
                                                        style={{ maxHeight: '150px' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || !formData.name || !isLoggedIn}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                {editingAuthor ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            editingAuthor ? 'Update Author' : 'Create Author'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthorDashboard;