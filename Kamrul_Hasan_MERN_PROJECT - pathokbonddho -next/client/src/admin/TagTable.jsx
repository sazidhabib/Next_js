// TagsTable.jsx
import React from 'react';

const TagsTable = ({ tags, onEdit, onDelete, loading, canEdit }) => {
    // Ensure tags is always an array and handle different response formats
    const tagsArray = Array.isArray(tags) ? tags : (tags?.tags || tags?.data || []);

    if (loading) {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!tagsArray || tagsArray.length === 0) {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <p className="text-muted mb-0">No tags found. Create your first tag!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">All Tags ({tagsArray.length})</h5>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Tag Title</th>
                                <th>Image</th>
                                <th>Meta Title</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tagsArray.map((tag, index) => (
                                <tr key={tag.id || index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            {tag.image && (
                                                <img
                                                    src={tag.image}
                                                    alt={tag.name}
                                                    className="rounded me-3"
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <strong>{tag.name}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <code>{tag.slug}</code>
                                    </td>
                                    <td>{tag.tagTitle || '-'}</td>
                                    <td>
                                        {tag.image ? (
                                            <span className="badge bg-success">Yes</span>
                                        ) : (
                                            <span className="badge bg-secondary">No</span>
                                        )}
                                    </td>
                                    <td>{tag.metaTitle || '-'}</td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => onEdit(tag)}
                                                title={canEdit ? "Edit tag" : "Please log in to edit tags"}
                                                disabled={!canEdit}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => onDelete(tag.id)}
                                                title={canEdit ? "Delete tag" : "Please log in to delete tags"}
                                                disabled={!canEdit}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TagsTable;