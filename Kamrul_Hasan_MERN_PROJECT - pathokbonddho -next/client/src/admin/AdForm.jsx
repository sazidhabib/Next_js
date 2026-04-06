// components/AdForm.js
import React, { useState, useEffect } from 'react';
import { createAd, updateAd } from './AdService';

const AdForm = ({ ad, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        type: 'image',
        position: 'sidebar',
        imageUrl: '',
        headCode: '',
        bodyCode: '',
        displayPages: '',
        startDate: '',
        endDate: '',
        isActive: true,
        maxImpressions: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const baseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        if (ad) {
            setFormData({
                name: ad.name || '',
                slug: ad.slug || '',
                type: ad.type || 'image',
                position: ad.position || 'sidebar',
                imageUrl: ad.imageUrl || '',
                headCode: ad.headCode || '',
                bodyCode: ad.bodyCode || '',
                displayPages: Array.isArray(ad.displayPages) ? ad.displayPages.join(', ') : (ad.displayPages || ''),
                startDate: ad.startDate ? ad.startDate.split('T')[0] : '',
                endDate: ad.endDate ? ad.endDate.split('T')[0] : '',
                isActive: ad.isActive !== undefined ? ad.isActive : true,
                maxImpressions: ad.maxImpressions || ''
            });
            if (ad.image) {
                setImagePreview(`${baseUrl}/uploads/ads/${ad.image}`);
            }
        }
    }, [ad]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required';
        }
        if (!formData.position) {
            newErrors.position = 'Position is required';
        }

        if (formData.type === 'image') {
            if (!ad && !imageFile) {
                newErrors.image = 'Image is required for image ads';
            }
        } else {
            if (!formData.headCode.trim()) {
                newErrors.headCode = 'Head code is required for Google Adsense';
            }
            if (!formData.bodyCode.trim()) {
                newErrors.bodyCode = 'Body code is required for Google Adsense';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // In AdForm.jsx - Update handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();

            // Append all form data with proper null handling
            Object.keys(formData).forEach(key => {
                let value = formData[key];

                // Handle empty values
                if (value === '') {
                    value = null;
                }

                // Handle specific fields
                if (key === 'displayPages') {
                    if (value && value !== 'none') {
                        submitData.append(key, JSON.stringify([value]));
                    } else if (value === 'none') {
                        submitData.append(key, JSON.stringify(['none']));
                    } else {
                        submitData.append(key, '[]');
                    }
                } else if (key === 'maxImpressions') {
                    // Convert empty string to null for maxImpressions
                    if (value === '' || value === null) {
                        submitData.append(key, 'null');
                    } else {
                        submitData.append(key, value);
                    }
                } else if (value !== null && value !== undefined) {
                    submitData.append(key, value);
                }
            });

            // Append image file if exists
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            console.log('Submitting update for ad ID:', ad?.id);

            let response;
            if (ad) {
                response = await updateAd(ad.id, submitData);
            } else {
                response = await createAd(submitData);
            }

            console.log('Ad creation/update response:', response);
            onSuccess();
        } catch (error) {
            console.error('Error saving ad:', error);
            console.error('Error response:', error.response?.data);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    submit: error.response?.data?.message ||
                        error.response?.data?.error ||
                        'Failed to save ad'
                });
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">
                    {ad ? 'Edit Ad' : 'Create New Ad'}
                </h5>
            </div>
            <div className="card-body">
                {errors.submit && (
                    <div className="alert alert-danger">{errors.submit}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    required
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">{errors.name}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="slug" className="form-label">
                                    Slug <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                                    id="slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.slug && (
                                    <div className="invalid-feedback">{errors.slug}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="type" className="form-label">
                                    Ad Type <span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-select"
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                >
                                    <option value="image">Image Ad</option>
                                    <option value="google_adsense">Google Adsense</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="position" className="form-label">
                                    Position <span className="text-danger">*</span>
                                </label>
                                <select
                                    className={`form-select ${errors.position ? 'is-invalid' : ''}`}
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                >
                                    <option value="header">Header</option>
                                    <option value="sidebar">Sidebar</option>
                                    <option value="footer">Footer</option>
                                    <option value="in_content">In Content</option>
                                    <option value="popup">Popup</option>
                                </select>
                                {errors.position && (
                                    <div className="invalid-feedback">{errors.position}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Image Ad Fields */}
                    {formData.type === 'image' && (
                        <>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">
                                            Image <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                            id="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {errors.image && (
                                            <div className="invalid-feedback">{errors.image}</div>
                                        )}
                                        <div className="form-text">
                                            Recommended size: 300x250px for sidebar, 728x90px for header
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    {imagePreview && (
                                        <div className="mb-3">
                                            <label className="form-label">Preview</label>
                                            <div>
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: '200px', maxHeight: '150px' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="imageUrl" className="form-label">
                                    Click-through URL
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </>
                    )}

                    {/* Google Adsense Fields */}
                    {formData.type === 'google_adsense' && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="headCode" className="form-label">
                                    Head Code <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    className={`form-control ${errors.headCode ? 'is-invalid' : ''}`}
                                    id="headCode"
                                    name="headCode"
                                    rows="4"
                                    value={formData.headCode}
                                    onChange={handleInputChange}
                                    placeholder="Paste Google Adsense head code here..."
                                />
                                {errors.headCode && (
                                    <div className="invalid-feedback">{errors.headCode}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bodyCode" className="form-label">
                                    Body Code <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    className={`form-control ${errors.bodyCode ? 'is-invalid' : ''}`}
                                    id="bodyCode"
                                    name="bodyCode"
                                    rows="4"
                                    value={formData.bodyCode}
                                    onChange={handleInputChange}
                                    placeholder="Paste Google Adsense body code here..."
                                />
                                {errors.bodyCode && (
                                    <div className="invalid-feedback">{errors.bodyCode}</div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="displayPages" className="form-label">
                                    Display Pages
                                </label>
                                <select
                                    className="form-select"
                                    id="displayPages"
                                    name="displayPages"
                                    value={formData.displayPages}
                                    onChange={handleInputChange}
                                >
                                    <option value="">All Pages</option>
                                    <option value="home">Home Page</option>
                                    <option value="details">Details Page</option>
                                    <option value="none">No Page</option>
                                </select>
                                <div className="form-text">
                                    Select which page this ad should appear on
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="maxImpressions" className="form-label">
                                    Max Impressions
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="maxImpressions"
                                    name="maxImpressions"
                                    value={formData.maxImpressions}
                                    onChange={handleInputChange}
                                    placeholder="Leave empty for unlimited"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="startDate" className="form-label">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="endDate" className="form-label">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="isActive">
                            Active
                        </label>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save me-2"></i>
                                    {ad ? 'Update Ad' : 'Create Ad'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdForm;