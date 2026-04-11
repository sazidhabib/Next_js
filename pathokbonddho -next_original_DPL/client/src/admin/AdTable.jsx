// components/AdTable.jsx
import React from 'react';

const AdTable = ({
    ads = [],
    loading = false,
    selectedAds = [],
    onEdit,
    onDelete,
    onSelectAd,
    onSelectAll,
    isAdmin = false
}) => {
    const allSelected = ads.length > 0 && selectedAds.length === ads.length;

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading ads...</p>
            </div>
        );
    }

    if (!ads || ads.length === 0) {
        return (
            <div className="text-center py-5">
                <i className="fas fa-ad fa-3x text-muted mb-3"></i>
                <h5>No ads found</h5>
                <p className="text-muted">Create your first ad to get started.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        {isAdmin && (
                            <th width="50">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={allSelected}
                                    onChange={(e) => onSelectAll?.(e.target.checked)}
                                    disabled={!isAdmin}
                                />
                            </th>
                        )}
                        <th>Ad</th>
                        <th>Type</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Impressions</th>
                        <th>Clicks</th>
                        <th>CTR</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {ads.map(ad => (
                        <tr key={ad.id}>
                            {isAdmin && (
                                <td>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedAds.includes(ad.id)}
                                        onChange={(e) => onSelectAd?.(ad.id, e.target.checked)}
                                        disabled={!isAdmin}
                                    />
                                </td>
                            )}
                            <td>
                                <div className="d-flex align-items-center">
                                    {ad.type === 'image' && ad.image && (
                                        <img
                                            src={`http://localhost:5000/uploads/ads/${ad.image}`}
                                            alt={ad.name}
                                            className="rounded me-3"
                                            style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <div>
                                        <strong>{ad.name || 'Unnamed Ad'}</strong>
                                        <br />
                                        <small className="text-muted">{ad.slug || 'No slug'}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className={`badge ${ad.type === 'image' ? 'bg-primary' : 'bg-success'}`}>
                                    {ad.type === 'image' ? 'Image' : 'Google Adsense'}
                                </span>
                            </td>
                            <td>
                                <span className="badge bg-secondary text-capitalize">
                                    {ad.position ? ad.position.replace('_', ' ') : 'Unknown'}
                                </span>
                            </td>
                            <td>
                                <span className={`badge ${ad.isActive ? 'bg-success' : 'bg-danger'}`}>
                                    {ad.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <div>
                                    <strong>{ad.currentImpressions || 0}</strong>
                                    {ad.maxImpressions && (
                                        <small className="text-muted"> / {ad.maxImpressions}</small>
                                    )}
                                </div>
                            </td>
                            <td>
                                <strong>{ad.clickCount || 0}</strong>
                            </td>
                            <td>
                                <strong>
                                    {ad.currentImpressions ?
                                        ((ad.clickCount / ad.currentImpressions) * 100).toFixed(2) + '%'
                                        : '0%'
                                    }
                                </strong>
                            </td>
                            {isAdmin && (
                                <td>
                                    <div className="btn-group btn-group-sm">
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={() => onEdit?.(ad)}
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => onDelete?.(ad.id)}
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdTable;