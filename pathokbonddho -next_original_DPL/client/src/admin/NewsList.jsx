import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../store/auth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const NewsList = () => {
    const { token } = useAuth();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedNews, setSelectedNews] = useState([]);
    const [bulkAction, setBulkAction] = useState('');

    useEffect(() => {
        fetchNews();
    }, [currentPage, searchTerm, statusFilter]);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && { status: statusFilter })
            };

            const response = await axios.get(`${API_URL}/api/news`, { params });

            // Extract news array from different response formats
            const newsData = extractArrayFromResponse(response.data, 'news');

            setNews(newsData);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching news:', error);
            toast.error('Failed to load news');
            setNews([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const extractArrayFromResponse = (data, key) => {
        console.log('API Response data:', data); // Debug log

        if (!data) {
            console.warn('No data received from API');
            return [];
        }

        // Check different possible locations
        if (Array.isArray(data)) {
            return data;
        }

        // Check for 'news' key (your backend format)
        if (data.news && Array.isArray(data.news)) {
            return data.news;
        }

        // Check for 'rows' key (Sequelize format)
        if (data.rows && Array.isArray(data.rows)) {
            return data.rows;
        }

        // Check for 'data' key (common API format)
        if (data.data && Array.isArray(data.data)) {
            return data.data;
        }

        // Check if the key parameter exists
        if (key && data[key] && Array.isArray(data[key])) {
            return data[key];
        }

        console.warn('Could not find array in response:', data);
        return [];
    };

    useEffect(() => {
        console.log('Current news state:', news);
        console.log('News length:', news.length);
        console.log('Is news array?', Array.isArray(news));
    }, [news]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this news post?')) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/api/news/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast.success('News deleted successfully');
            fetchNews();
        } catch (error) {
            console.error('Error deleting news:', error);
            toast.error('Failed to delete news');
        }
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedNews.length === 0) {
            toast.warning('Please select news and an action');
            return;
        }

        if (bulkAction === 'delete') {
            if (!window.confirm(`Are you sure you want to delete ${selectedNews.length} news posts?`)) {
                return;
            }
        }

        try {
            if (bulkAction === 'delete') {
                await axios.post(`${API_URL}/api/news/bulk-delete`,
                    { newsIds: selectedNews },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                toast.success(`${selectedNews.length} news posts deleted successfully`);
            }

            setSelectedNews([]);
            setBulkAction('');
            fetchNews();
        } catch (error) {
            console.error('Error performing bulk action:', error);
            toast.error('Failed to perform bulk action');
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedNews(news.map(item => item.id));
        } else {
            setSelectedNews([]);
        }
    };

    const handleSelectSingle = (id, checked) => {
        if (checked) {
            setSelectedNews(prev => [...prev, id]);
        } else {
            setSelectedNews(prev => prev.filter(item => item !== id));
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            published: { class: 'bg-success', text: 'Published' },
            draft: { class: 'bg-warning', text: 'Draft' },
            scheduled: { class: 'bg-info', text: 'Scheduled' }
        };

        const config = statusConfig[status] || { class: 'bg-secondary', text: status };
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    // Safe access for nested properties
    const getAuthorName = (newsItem) => {
        console.log('News item for author:', newsItem);

        // Try multiple possible locations
        return newsItem.Author?.name ||
            newsItem.author?.name ||
            (newsItem.authorId && `Author ID: ${newsItem.authorId}`) ||
            'N/A';
    };

    const getCategories = (newsItem) => {
        console.log('News item categories:', newsItem.Categories);
        return newsItem.Categories || newsItem.categories || [];
    };

    // If you need to display category path somewhere
    const getCategoryPath = (category) => {
        return category.path || category.slug || '';
    };
    const getTags = (newsItem) => {
        console.log('News item tags:', newsItem.Tags, newsItem.tags);
        return newsItem.Tags || newsItem.tags || [];
    };

    const getPaginationItems = (current, total) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

        const pages = [];
        if (current <= 4) {
            pages.push(1, 2, 3, 4, 5, '...', total);
        } else if (current >= total - 3) {
            pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
        } else {
            pages.push(1, '...', current - 1, current, current + 1, '...', total);
        }
        return pages;
    };

    return (
        <div className="container-fluid custom-font-initial">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title">News Management</h4>
                            <Link to="/admin/news/create" className="btn btn-primary">
                                <i className="fas fa-plus"></i> Create News
                            </Link>
                        </div>
                        <div className="card-body">
                            {/* Filters and Search */}
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search news..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <select
                                        className="form-control"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">All Status</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="scheduled">Scheduled</option>
                                    </select>
                                </div>
                                <div className="col-md-5">
                                    <div className="d-flex gap-2">
                                        <select
                                            className="form-control"
                                            value={bulkAction}
                                            onChange={(e) => setBulkAction(e.target.value)}
                                        >
                                            <option value="">Bulk Actions</option>
                                            <option value="delete">Delete Selected</option>
                                        </select>
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={handleBulkAction}
                                            disabled={!bulkAction || selectedNews.length === 0}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* News Table */}
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={selectedNews.length === news.length && news.length > 0}
                                                />
                                            </th>
                                            <th>Headline</th>
                                            <th>Type</th>
                                            <th>Author</th>
                                            <th>Categories</th>
                                            <th>Tags</th>
                                            <th>Status</th>
                                            <th>Schedule</th>
                                            <th>Views</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="10" className="text-center">
                                                    <div className="spinner-border" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : !Array.isArray(news) || news.length === 0 ? (
                                            <tr>
                                                <td colSpan="10" className="text-center">
                                                    No news found
                                                </td>
                                            </tr>
                                        ) : (
                                            news.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedNews.includes(item.id)}
                                                            onChange={(e) => handleSelectSingle(item.id, e.target.checked)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <strong>{item.newsHeadline}</strong>
                                                            {item.alternativeHeadline && (
                                                                <div className="text-muted small">
                                                                    {item.alternativeHeadline}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {item.newsType === 'photo' ? (
                                                            <span className="badge bg-primary">Photo</span>
                                                        ) : item.newsType === 'video' ? (
                                                            <span className="badge bg-danger">Video</span>
                                                        ) : (
                                                            <span className="badge bg-secondary">Standard</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {getAuthorName(item)}
                                                    </td>
                                                    <td>
                                                        {getCategories(item).length > 0 ? (
                                                            getCategories(item).slice(0, 2).map(cat => (
                                                                <span key={cat.id} className="badge bg-light text-dark me-1">
                                                                    {cat.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted">No categories</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {getTags(item).length > 0 ? (
                                                            getTags(item).slice(0, 2).map(tag => (
                                                                <span key={tag.id} className="badge bg-secondary me-1">
                                                                    {tag.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted">No tags</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {getStatusBadge(item.status)}
                                                    </td>
                                                    <td>
                                                        {item.newsSchedule ? formatDate(item.newsSchedule) : '-'}
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-info">{item.views || 0}</span>
                                                    </td>
                                                    <td>
                                                        {formatDate(item.createdAt)}
                                                    </td>
                                                    <td>
                                                        <div className="btn-group">
                                                            <Link
                                                                to={
                                                                    item.newsType === 'photo' ? `/admin/photo-news/edit/${item.id}` :
                                                                    item.newsType === 'video' ? `/admin/video-news/edit/${item.id}` :
                                                                    `/admin/news/edit/${item.id}`
                                                                }
                                                                className="btn btn-sm btn-outline-primary"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                            <Link
                                                                to={`/news/${item.slug}`}
                                                                target="_blank"
                                                                className="btn btn-sm btn-outline-info"
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav>
                                    <ul className="pagination justify-content-center flex-wrap">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                        </li>

                                        {getPaginationItems(currentPage, totalPages).map((item, index) => (
                                            <li
                                                key={index}
                                                className={`page-item ${item === currentPage ? 'active' : ''} ${item === '...' ? 'disabled' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => typeof item === 'number' && setCurrentPage(item)}
                                                    disabled={item === '...'}
                                                >
                                                    {item}
                                                </button>
                                            </li>
                                        ))}

                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsList;