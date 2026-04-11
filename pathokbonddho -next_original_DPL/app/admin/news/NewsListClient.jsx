'use client';

import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Card, Spinner, Pagination, Badge, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Link from 'next/link';
import api from "@/app/lib/api";

const NewsListClient = ({ initialNews, initialTotalPages, isAdmin }) => {
    const [news, setNews] = useState(initialNews || []);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [bulkAction, setBulkAction] = useState('');
    const [selected, setSelected] = useState([]);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 20,
                search,
                status,
                ...(type && { newsType: type })
            };
            const res = await api.get('/news', { params });
            const data = res.data;
            const items = data.news || data.rows || data.data || (Array.isArray(data) ? data : []);
            setNews(items);

            // Calculate totalPages correctly - if API returns count, convert to pages
            let pages = data.totalPages || 1;
            if (pages > 1000) {
                // Likely API returned total count instead of pages
                const total = data.total || data.count || pages;
                pages = Math.ceil(total / 20);
                console.warn(`Recalculated pages from ${data.totalPages} to ${pages}`);
            }
            setTotalPages(Math.max(1, pages));
        } catch (err) {
            toast.error("Failed to fetch news");
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle updates when filters change (skip initial mount as we have initialNews)
    const isFirstRun = React.useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (isAdmin) fetchNews();
    }, [page, search, status, type, isAdmin]);

    const handleBulk = async () => {
        if (!bulkAction || selected.length === 0) return;
        if (bulkAction === 'delete' && !confirm(`Delete ${selected.length} items?`)) return;

        try {
            if (bulkAction === 'delete') {
                await api.post('/news/bulk-delete', { newsIds: selected });
                toast.success("Bulk delete successful");
            }
            setSelected([]);
            setBulkAction('');
            fetchNews();
        } catch (err) { toast.error("Bulk action failed"); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this news post?")) return;
        try {
            await api.delete(`/news/${id}`);
            toast.success("Deleted");
            fetchNews();
        } catch (err) { toast.error("Delete failed"); }
    };

    const getStatusBadge = (s) => {
        const map = { published: 'success', draft: 'warning', scheduled: 'info' };
        return <Badge bg={map[s] || 'secondary'}>{s}</Badge>;
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>News Management</h4>
                <Link href="/admin/news/create" className="btn btn-primary">+ Create News</Link>
            </div>

            <Row className="mb-3 g-2">
                <Col md={4}><Form.Control placeholder="Search news..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></Col>
                <Col md={2}>
                    <Form.Select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                    </Form.Select>
                </Col>
                <Col md={6}>
                    <InputGroup>
                        <Form.Select value={bulkAction} onChange={e => setBulkAction(e.target.value)}>
                            <option value="">Bulk Actions</option>
                            <option value="delete">Delete Selected</option>
                        </Form.Select>
                        <Button variant="outline-primary" onClick={handleBulk} disabled={!bulkAction || selected.length === 0}>Apply</Button>
                    </InputGroup>
                </Col>
            </Row>

            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: '40px' }}><Form.Check checked={selected.length === news.length && news.length > 0} onChange={e => setSelected(e.target.checked ? news.map(n => n.id) : [])} /></th>
                                <th>Headline</th><th>Type</th><th>Author</th><th>Status</th><th>Created</th><th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="7" className="text-center py-5"><Spinner animation="border" /></td></tr> :
                                news.map(n => (
                                    <tr key={n.id}>
                                        <td><Form.Check checked={selected.includes(n.id)} onChange={e => setSelected(e.target.checked ? [...selected, n.id] : selected.filter(id => id !== n.id))} /></td>
                                        <td><div className="fw-bold">{n.newsHeadline}</div><small className="text-muted">{n.newsHeadlineBangla}</small></td>
                                        <td><Badge bg={n.newsType === 'photo' ? 'primary' : n.newsType === 'video' ? 'danger' : 'secondary'}>{n.newsType || 'standard'}</Badge></td>
                                        <td>{n.Author?.name || n.author?.name || 'N/A'}</td>
                                        <td>{getStatusBadge(n.status)}</td>
                                        <td>{new Date(n.createdAt).toLocaleDateString()}</td>
                                        <td className="text-center">
                                            <div className="btn-group">
                                                <Link href={n.newsType === 'photo' ? `/admin/photo-news/edit/${n.id}` : n.newsType === 'video' ? `/admin/video-news/edit/${n.id}` : `/admin/news/edit/${n.id}`} className="btn btn-sm btn-outline-primary">Edit</Link>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(n.id)}>Del</Button>
                                                <Link href={`/news/${n.slug}`} target="_blank" className="btn btn-sm btn-outline-info">View</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            {!loading && news.length === 0 && <tr><td colSpan="7" className="text-center py-4 text-muted">No news found</td></tr>}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                    <Pagination className="mb-0">
                        <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
                    </Pagination>

                    {/* Page info */}
                    <div style={{ minWidth: '150px', textAlign: 'center' }}>
                        <small className="text-muted">
                            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                        </small>
                    </div>

                    {/* Jump to page input */}
                    <InputGroup style={{ maxWidth: '120px' }}>
                        <Form.Control
                            placeholder="Go to..."
                            type="number"
                            min="1"
                            max={totalPages}
                            defaultValue={page}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const newPage = Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1));
                                    setPage(newPage);
                                    e.target.value = '';
                                }
                            }}
                            className="text-center"
                            size="sm"
                        />
                    </InputGroup>

                    <Pagination className="mb-0">
                        <Pagination.Next disabled={page === totalPages} onClick={() => setPage(page + 1)} />
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default NewsListClient;
