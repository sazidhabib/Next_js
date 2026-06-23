// TagsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/auth'; // Import your auth context
import TagForm from './TagForm';
import TagsTable from './TagTable';
import { getTags, createTag, updateTag, deleteTag, setAuthTokenGetter } from './tagService';

const TagsDashboard = () => {
    const [tags, setTags] = useState([]);
    const [editingTag, setEditingTag] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { token, isLoggedIn } = useAuth();

    useEffect(() => {
        setAuthTokenGetter(() => token);
    }, [token]);

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getTags();

            // Handle different response formats
            if (Array.isArray(response)) {
                setTags(response);
            } else if (response && Array.isArray(response.tags)) {
                setTags(response.tags);
            } else if (response && Array.isArray(response.data)) {
                setTags(response.data);
            } else {
                console.warn('Unexpected response format:', response);
                setTags([]);
            }
        } catch (error) {
            console.error('Error loading tags:', error);
            setError('Failed to load tags. Please try again.');
            setTags([]); // Ensure tags is always an array
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTag = async (formData) => { // Now receives FormData directly
        setError('');
        try {
            if (!isLoggedIn) {
                setError('You must be logged in to create tags');
                return;
            }

            console.log('Sending formData to createTag:', formData);
            await createTag(formData); // Pass FormData directly
            await loadTags();
            setShowForm(false);
        } catch (error) {
            console.error('Error creating tag:', error);
            setError('Failed to create tag. Please try again.');
        }
    };

    const handleUpdateTag = async (tagData) => {
        setError('');
        try {
            if (!isLoggedIn) {
                setError('You must be logged in to update tags');
                return;
            }

            await updateTag(editingTag.id, tagData);
            await loadTags();
            setEditingTag(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error updating tag:', error);
            setError('Failed to update tag. Please try again.');
        }
    };

    const handleDeleteTag = async (tagId) => {
        if (window.confirm('Are you sure you want to delete this tag?')) {
            setError('');
            try {
                if (!isLoggedIn) {
                    setError('You must be logged in to delete tags');
                    return;
                }

                await deleteTag(tagId);
                await loadTags();
            } catch (error) {
                console.error('Error deleting tag:', error);
                setError('Failed to delete tag. Please try again.');
            }
        }
    };

    const handleEditTag = (tag) => {
        setEditingTag(tag);
        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setEditingTag(null);
        setShowForm(false);
        setError('');
    };

    return (
        <div className="container-fluid custom-font-initial">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h3 mb-0">Tags Dashboard</h1>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(true)}
                            disabled={showForm || !isLoggedIn}
                            title={!isLoggedIn ? "Please log in to create tags" : ""}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Add New Tag
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {error}
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setError('')}
                            ></button>
                        </div>
                    )}

                    {!isLoggedIn && (
                        <div className="alert alert-warning">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            You must be logged in to create, edit, or delete tags.
                        </div>
                    )}

                    {showForm && (
                        <div className="mb-4">
                            <TagForm
                                tag={editingTag}
                                onSubmit={editingTag ? handleUpdateTag : handleCreateTag}
                                onCancel={handleCancelEdit}
                                isSubmitting={loading}
                            />
                        </div>
                    )}

                    <TagsTable
                        tags={tags}
                        onEdit={handleEditTag}
                        onDelete={handleDeleteTag}
                        loading={loading}
                        canEdit={isLoggedIn}
                    />
                </div>
            </div>
        </div>
    );
};

export default TagsDashboard;