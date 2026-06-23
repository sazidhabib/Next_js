// components/AdList.jsx
import React, { useState } from 'react';
import AdFilters from './AdFilters';
import AdTable from './AdTable';
import Pagination from './Pagination';

const AdList = ({
    ads = [],
    loading = false,
    filters = {},
    pagination = {},
    onEdit,
    onDelete,
    onBulkDelete,
    onFilterChange,
    onPageChange,
    onRefresh,
    isAdmin = false
}) => {
    const [selectedAds, setSelectedAds] = useState([]);

    const handleSelectAd = (adId, isSelected) => {
        if (!isAdmin) return;

        if (isSelected) {
            setSelectedAds(prev => [...prev, adId]);
        } else {
            setSelectedAds(prev => prev.filter(id => id !== adId));
        }
    };

    const handleSelectAll = (isSelected) => {
        if (!isAdmin) return;

        if (isSelected) {
            setSelectedAds(ads.map(ad => ad.id));
        } else {
            setSelectedAds([]);
        }
    };

    const handleBulkDelete = () => {
        if (!isAdmin || selectedAds.length === 0) return;
        onBulkDelete(selectedAds);
        setSelectedAds([]);
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">All Ads</h5>
                    <div>
                        <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={onRefresh}
                            disabled={loading}
                        >
                            <i className="fas fa-sync-alt me-1"></i>
                            Refresh
                        </button>
                        {isAdmin && selectedAds.length > 0 && (
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={handleBulkDelete}
                            >
                                <i className="fas fa-trash me-1"></i>
                                Delete Selected ({selectedAds.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="card-body">
                {/* Filters */}
                <AdFilters
                    filters={filters}
                    onFilterChange={onFilterChange}
                    loading={loading}
                />

                {/* Admin notice for non-admin users */}
                {!isAdmin && (
                    <div className="alert alert-info mb-3">
                        <i className="fas fa-info-circle me-2"></i>
                        You are in view-only mode. Admin privileges are required to create, edit, or delete ads.
                    </div>
                )}

                {/* Ads Table */}
                <AdTable
                    ads={ads}
                    loading={loading}
                    selectedAds={selectedAds}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onSelectAd={handleSelectAd}
                    onSelectAll={handleSelectAll}
                    isAdmin={isAdmin}
                />

                {/* Pagination */}
                <Pagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default AdList;