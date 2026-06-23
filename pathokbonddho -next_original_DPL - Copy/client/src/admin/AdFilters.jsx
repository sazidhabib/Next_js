// components/AdFilters.js
import React from 'react';

const AdFilters = ({ filters, onFilterChange, loading }) => {
    const handleFilterChange = (key, value) => {
        onFilterChange({
            ...filters,
            [key]: value
        });
    };

    const clearFilters = () => {
        onFilterChange({
            search: '',
            type: '',
            position: '',
            isActive: ''
        });
    };

    return (
        <div className="row mb-4">
            <div className="col-md-3">
                <label htmlFor="search" className="form-label">Search</label>
                <input
                    type="text"
                    className="form-control"
                    id="search"
                    placeholder="Search by name or slug..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="col-md-2">
                <label htmlFor="type" className="form-label">Type</label>
                <select
                    className="form-select"
                    id="type"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    disabled={loading}
                >
                    <option value="">All Types</option>
                    <option value="image">Image</option>
                    <option value="google_adsense">Google Adsense</option>
                </select>
            </div>
            <div className="col-md-2">
                <label htmlFor="position" className="form-label">Position</label>
                <select
                    className="form-select"
                    id="position"
                    value={filters.position}
                    onChange={(e) => handleFilterChange('position', e.target.value)}
                    disabled={loading}
                >
                    <option value="">All Positions</option>
                    <option value="header">Header</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                    <option value="in_content">In Content</option>
                    <option value="popup">Popup</option>
                </select>
            </div>
            <div className="col-md-2">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                    className="form-select"
                    id="status"
                    value={filters.isActive}
                    onChange={(e) => handleFilterChange('isActive', e.target.value)}
                    disabled={loading}
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
                <button
                    className="btn btn-outline-secondary w-100"
                    onClick={clearFilters}
                    disabled={loading}
                >
                    <i className="fas fa-times me-1"></i>
                    Clear Filters
                </button>
            </div>
        </div>
    );
};

export default AdFilters;