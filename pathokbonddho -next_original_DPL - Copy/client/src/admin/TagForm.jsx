// TagForm.jsx
import React, { useState, useEffect } from 'react';

const TagForm = ({ tag, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        tagTitle: '',
        tagDescription: '',
        image: null,
        imageUrl: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: ''
    });

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');

    // Function to get full image URL from backend filename
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';

        // If it's already a full URL, return it
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // If it's a filename from backend, construct the full URL
        // Adjust this based on your server setup
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        return `${baseUrl}/uploads/${imagePath}`;
    };

    useEffect(() => {
        if (tag) {
            console.log('Editing tag:', tag);
            const imageUrl = tag.image ? getImageUrl(tag.image) : '';

            setFormData({
                name: tag.name || '',
                slug: tag.slug || '',
                tagTitle: tag.tagTitle || '',
                tagDescription: tag.tagDescription || '',
                image: null,
                imageUrl: tag.image || '', // Store the raw value for form submission
                metaTitle: tag.metaTitle || '',
                metaDescription: tag.metaDescription || '',
                metaKeywords: tag.metaKeywords || ''
            });

            // Set image preview for existing image
            if (imageUrl) {
                console.log('Setting image preview from existing tag:', imageUrl);
                setImagePreview(imageUrl);

                // Test if image loads
                const img = new Image();
                img.onload = () => {
                    console.log('Image preview loaded successfully');
                };
                img.onerror = () => {
                    console.error('Image preview failed to load:', imageUrl);
                    // If backend image fails to load, show a placeholder or hide preview
                    setImagePreview('');
                };
                img.src = imageUrl;
            }
        } else {
            // Reset form for new tag
            setFormData({
                name: '',
                slug: '',
                tagTitle: '',
                tagDescription: '',
                image: null,
                imageUrl: '',
                metaTitle: '',
                metaDescription: '',
                metaKeywords: ''
            });
            setImagePreview('');
        }
    }, [tag]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        console.log('Input changed:', { name, value, type, files: files ? files[0] : 'no files' });

        if (type === 'file') {
            const file = files[0];
            console.log('File selected:', file);

            setFormData(prev => ({
                ...prev,
                [name]: file,
                imageUrl: '' // Clear URL when file is selected
            }));

            // Create preview for uploaded file
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    console.log('File preview created');
                    setImagePreview(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                setImagePreview('');
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            // If image URL changes, update preview immediately
            if (name === 'imageUrl') {
                if (value) {
                    const previewUrl = getImageUrl(value);
                    console.log('Setting preview from URL:', previewUrl);
                    setImagePreview(previewUrl);

                    // Test if the URL image loads
                    if (value.startsWith('http')) {
                        const img = new Image();
                        img.onload = () => {
                            console.log('URL image loaded successfully');
                        };
                        img.onerror = () => {
                            console.error('URL image failed to load:', previewUrl);
                            setImagePreview(''); // Clear preview if URL image fails
                        };
                        img.src = previewUrl;
                    }
                } else {
                    setImagePreview('');
                }
            }
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted, formData:', formData);
        console.log('Image preview:', imagePreview);

        if (validateForm()) {
            const submitData = new FormData();

            // Append all form data
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
                    if (key === 'image' && formData[key] instanceof File) {
                        console.log('Appending file:', formData[key]);
                        submitData.append(key, formData[key]);
                    } else if (key !== 'imageUrl') {
                        console.log(`Appending ${key}:`, formData[key]);
                        submitData.append(key, formData[key]);
                    }
                }
            });

            // Also append imageUrl if no file is selected but URL exists
            if (!formData.image && formData.imageUrl) {
                console.log('Appending image URL:', formData.imageUrl);
                submitData.append('image', formData.imageUrl);
            }

            // Log FormData contents
            console.log('FormData contents:');
            for (let [key, value] of submitData.entries()) {
                console.log(key, value);
            }

            onSubmit(submitData);
        }
    };

    const generateSlug = () => {
        if (!formData.name) return;

        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        setFormData(prev => ({
            ...prev,
            slug
        }));
    };

    const clearImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null,
            imageUrl: ''
        }));
        setImagePreview('');
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">
                    {tag ? 'Edit Tag' : 'Create New Tag'}
                </h5>
            </div>
            <div className="card-body">
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
                                    onChange={handleChange}
                                    placeholder="Enter tag name"
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
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                                        id="slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="tag-slug"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={generateSlug}
                                        disabled={!formData.name}
                                    >
                                        Generate
                                    </button>
                                    {errors.slug && (
                                        <div className="invalid-feedback">{errors.slug}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="tagTitle" className="form-label">Tag Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="tagTitle"
                            name="tagTitle"
                            value={formData.tagTitle}
                            onChange={handleChange}
                            placeholder="Enter tag title for display"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="tagDescription" className="form-label">Tag Description</label>
                        <textarea
                            className="form-control"
                            id="tagDescription"
                            name="tagDescription"
                            rows="3"
                            value={formData.tagDescription}
                            onChange={handleChange}
                            placeholder="Enter tag description"
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Upload Image</label>
                        <input
                            type="file"
                            className="form-control"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        <div className="form-text">
                            Upload an image file (JPG, PNG, WEBP, etc.)
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">Or Enter Image URL</label>
                        <input
                            type="url"
                            className="form-control"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                        <div className="form-text">
                            Alternatively, provide an image URL
                        </div>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mb-3">
                            <label className="form-label">Image Preview</label>
                            <div className="d-flex align-items-center">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="img-thumbnail me-3"
                                    style={{
                                        maxHeight: '100px',
                                        maxWidth: '150px',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        console.error('Image failed to load:', imagePreview);
                                        e.target.style.display = 'none';
                                        // Show error message
                                        const previewContainer = e.target.parentElement;
                                        const errorMsg = document.createElement('div');
                                        errorMsg.className = 'text-danger small';
                                        errorMsg.textContent = 'Image failed to load';
                                        previewContainer.appendChild(errorMsg);
                                    }}
                                    onLoad={(e) => {
                                        console.log('Image loaded successfully:', imagePreview);
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={clearImage}
                                >
                                    Remove Image
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Show current image info when editing */}
                    {tag && tag.image && !imagePreview && (
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            Current image: {tag.image}
                            <br />
                            <small>
                                {tag.image.startsWith('http')
                                    ? 'This is an external URL.'
                                    : 'This is an uploaded file. The preview may not show if the file path is not accessible.'}
                            </small>
                            <br />
                            <small>If you want to change the image, upload a new file or enter a new URL.</small>
                        </div>
                    )}

                    <div className="card mt-4">
                        <div className="card-header">
                            <h6 className="card-title mb-0">SEO Settings</h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="metaTitle" className="form-label">Meta Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="metaTitle"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleChange}
                                    placeholder="Enter meta title for SEO"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="metaDescription" className="form-label">Meta Description</label>
                                <textarea
                                    className="form-control"
                                    id="metaDescription"
                                    name="metaDescription"
                                    rows="3"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    placeholder="Enter meta description for SEO"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="metaKeywords" className="form-label">Meta Keywords</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="metaKeywords"
                                    name="metaKeywords"
                                    value={formData.metaKeywords}
                                    onChange={handleChange}
                                    placeholder="keyword1, keyword2, keyword3"
                                />
                                <div className="form-text">
                                    Separate keywords with commas
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    {tag ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    {tag ? 'Update Tag' : 'Create Tag'}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TagForm;