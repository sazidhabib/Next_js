// components/Ads.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/auth'; // Adjust path as needed
import AdList from './AdList';
import AdForm from './AdForm';
import { getAds, deleteAd, bulkDeleteAds } from './AdService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdsDashboard = () => {
    const { isLoggedIn, isAdmin, LogoutUser } = useAuth();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        position: '',
        isActive: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0
    });

    useEffect(() => {
        if (isLoggedIn) {
            fetchAds();
        }
    }, [pagination.page, pagination.limit, filters, isLoggedIn]);

    const fetchAds = async () => {
        if (!isLoggedIn) {
            toast.error('Please login to access ads');
            return;
        }

        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            };
            console.log('Fetching ads with params:', params);

            const response = await getAds(params);
            console.log('API Response:', response); // Debug log

            // Handle different response structures
            let adsData = response.ads || [];
            let totalCount = response.totalCount || 0;

            adsData = adsData.map(ad => ({
                ...ad,
                isActive: Boolean(ad.isActive)
            }));

            console.log('Processed ads data:', adsData);
            console.log('Total count:', totalCount);

            setAds(Array.isArray(adsData) ? adsData : []);
            setPagination(prev => ({
                ...prev,
                totalCount,
                totalPages: Math.ceil(totalCount / pagination.limit) || 0
            }));
        } catch (error) {
            console.error('Error fetching ads:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch ads';
            toast.error(errorMessage);

            if (error.response?.status === 401) {
                LogoutUser();
                toast.error('Session expired. Please login again.');
            }

            setAds([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        if (!isAdmin) {
            toast.error('Admin access required to create ads');
            return;
        }
        setEditingAd(null);
        setShowForm(true);
    };

    const handleEdit = (ad) => {
        if (!isAdmin) {
            toast.error('Admin access required to edit ads');
            return;
        }
        setEditingAd(ad);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!isAdmin) {
            toast.error('Admin access required to delete ads');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this ad?')) {
            return;
        }

        try {
            await deleteAd(id);
            toast.success('Ad deleted successfully');
            fetchAds();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete ad';
            toast.error(errorMessage);

            if (error.response?.status === 401) {
                LogoutUser();
                toast.error('Session expired. Please login again.');
            }
        }
    };

    const handleBulkDelete = async (adIds) => {
        if (!isAdmin) {
            toast.error('Admin access required to delete ads');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${adIds.length} ads?`)) {
            return;
        }

        try {
            await bulkDeleteAds(adIds);
            toast.success(`${adIds.length} ads deleted successfully`);
            fetchAds();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete ads';
            toast.error(errorMessage);

            if (error.response?.status === 401) {
                LogoutUser();
                toast.error('Session expired. Please login again.');
            }
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingAd(null);
    };

    const handleFormSuccess = () => {
        toast.success(editingAd ? 'Ad updated successfully' : 'Ad created successfully');
        setShowForm(false);
        setEditingAd(null);

        // Force refresh the list
        console.log('Refreshing ads list after form success...');
        fetchAds();
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    // Show login prompt if not authenticated
    if (!isLoggedIn) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-warning text-center">
                            <h4>Authentication Required</h4>
                            <p>Please log in to access the ads management system.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid custom-font-initial">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1>Ads Management</h1>
                            {!isAdmin && (
                                <small className="text-muted">View-only mode (Admin required for modifications)</small>
                            )}
                        </div>
                        {isAdmin && (
                            <button
                                className="btn btn-primary"
                                onClick={handleCreate}
                                disabled={loading}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Create New Ad
                            </button>
                        )}
                    </div>

                    {/* Ads List */}
                    {!showForm ? (
                        <AdList
                            ads={ads}
                            loading={loading}
                            filters={filters}
                            pagination={pagination}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onBulkDelete={handleBulkDelete}
                            onFilterChange={handleFilterChange}
                            onPageChange={handlePageChange}
                            onRefresh={fetchAds}
                            isAdmin={isAdmin}
                        />
                    ) : (
                        <AdForm
                            ad={editingAd}
                            onClose={handleFormClose}
                            onSuccess={handleFormSuccess}
                            isAdmin={isAdmin}
                        />
                    )}
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default AdsDashboard;