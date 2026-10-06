'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Modal, Table, Tabs, Tab, InputGroup, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { toast } from 'react-toastify';
import api from '@/app/lib/api';

// Normalize layout data from backend (handling capitalized Rows/Columns and variations)
const normalizeLayout = (rawLayout) => {
    if (!rawLayout) return null;
    const data = JSON.parse(JSON.stringify(rawLayout));
    if (data.PageSections && Array.isArray(data.PageSections)) {
        data.PageSections = data.PageSections.map(s => ({
            ...s,
            rows: (s.rows || s.Rows || []).map(r => ({
                ...r,
                columns: (r.columns || r.Columns || []).map(c => ({
                    ...c,
                    contentType: c.contentType || c.ContentType || 'text',
                    contentId: c.contentId || c.ContentId || null,
                    contentTitle: c.contentTitle || c.ContentTitle || null,
                    tag: c.tag || c.Tag || '',
                    design: c.design || c.Design || null,
                    merged: !!(c.merged || c.Merged),
                    masterCell: !!(c.masterCell || c.MasterCell),
                    rowSpan: c.rowSpan || c.RowSpan || 1,
                    colSpan: c.colSpan || c.ColSpan || 1,
                    masterCellKey: c.masterCellKey || c.MasterCellKey || null,
                    mergedCells: c.mergedCells || c.MergedCells || null
                }))
            }))
        }));
    }
    return data;
};

export default function SectionShortlistClient({ initialLayout, isAdmin, user }) {
    const [layout, setLayout] = useState(() => normalizeLayout(initialLayout) || null);
    const [loading, setLoading] = useState(!initialLayout);
    const [saving, setSaving] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [resolvedItems, setResolvedItems] = useState({});
    const [resolvingLoading, setResolvingLoading] = useState(false);

    // Drag and Drop state
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Modal state for content replacement
    const [showModal, setShowModal] = useState(false);
    const [activeSlotTarget, setActiveSlotTarget] = useState(null); // { sIdx, rIdx, cIdx, position }
    const [modalTab, setModalTab] = useState('news');
    const [modalSearch, setModalSearch] = useState('');
    const [modalData, setModalData] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalPage, setModalPage] = useState(1);
    const [modalTotalPages, setModalTotalPages] = useState(1);

    // Fetch the Home page layout if not provided or to refresh
    const fetchHomeLayout = useCallback(async () => {
        setLoading(true);
        try {
            const listRes = await api.get('/layout');
            const allPages = listRes.data.data || listRes.data || [];
            const homePage = (Array.isArray(allPages) && allPages.find(p => p.name?.toLowerCase() === 'home')) ||
                (Array.isArray(allPages) && allPages[0]) || null;

            if (!homePage) {
                toast.error("Home page layout not found.");
                setLayout(null);
                return;
            }

            const detailRes = await api.get(`/layout/${homePage.id}`);
            const data = detailRes.data.data || detailRes.data;
            setLayout(normalizeLayout(data));
        } catch (err) {
            console.error("Failed to load layout:", err);
            toast.error("Failed to load Section 1 layout");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!initialLayout && isAdmin) {
            fetchHomeLayout();
        }
    }, [initialLayout, isAdmin, fetchHomeLayout]);

    // Extract Section 1 and all its editorial slots in exact sorting order
    const { section1, editorialSlots, adSlotsCount } = useMemo(() => {
        if (!layout?.PageSections || layout.PageSections.length === 0) {
            return { section1: null, editorialSlots: [], adSlotsCount: 0 };
        }

        const sec1 = layout.PageSections[0];
        const rows = [...(sec1.rows || [])].sort((a, b) => (a.rowOrder || 0) - (b.rowOrder || 0));

        let masterMergedCell = null;
        const regularCells = [];
        let adsCount = 0;

        rows.forEach((row, rIdx) => {
            const cols = [...(row.columns || [])].sort((a, b) => (a.colOrder || 0) - (b.colOrder || 0));
            cols.forEach((col, cIdx) => {
                // If it is an advertisement, isolate it completely
                if (col.contentType === 'ad' || col.contentType === 'ads') {
                    adsCount++;
                    return; // Skip ads entirely from shortlist
                }

                // If it is a slave merged cell, skip it
                if (col.merged && !col.masterCell) {
                    return;
                }

                // Check if this is the Section Merged Master Cell (Position 1)
                const isMaster = col.masterCell || (col.merged && col.masterCell) || (col.rowSpan > 1 || col.colSpan > 1);

                const slotInfo = {
                    sIdx: 0,
                    rIdx,
                    cIdx,
                    colOrder: col.colOrder || cIdx + 1,
                    rowOrder: row.rowOrder || rIdx + 1,
                    colSpan: col.colSpan || 1,
                    rowSpan: col.rowSpan || 1,
                    design: col.design || null,
                    isMasterCell: !!isMaster,
                    cell: col
                };

                if (isMaster && !masterMergedCell) {
                    masterMergedCell = slotInfo;
                } else {
                    regularCells.push(slotInfo);
                }
            });
        });

        const ordered = [];
        let positionCounter = 1;

        // Position 1 is strictly the Merged Master Cell if it exists
        if (masterMergedCell) {
            ordered.push({
                ...masterMergedCell,
                position: positionCounter++,
                isLead: true
            });
        }

        // Remaining positions 2, 3, 4... start sequentially from the left side
        regularCells.forEach(slot => {
            ordered.push({
                ...slot,
                position: positionCounter++,
                isLead: false
            });
        });

        return { section1: sec1, editorialSlots: ordered, adSlotsCount: adsCount };
    }, [layout]);

    // Resolve live content for each editorial slot
    useEffect(() => {
        if (!editorialSlots || editorialSlots.length === 0) {
            setResolvedItems({});
            return;
        }

        let isMounted = true;
        const resolveContent = async () => {
            setResolvingLoading(true);
            const resolvedMap = {};
            const tagCounts = {};
            const tagSlots = [];

            // Group tag-based dynamic slots (ONLY if no explicit contentId was assigned)
            editorialSlots.forEach(slot => {
                const cell = slot.cell;
                if (!cell.contentId && cell.tag && cell.contentType === 'news') {
                    tagCounts[cell.tag] = (tagCounts[cell.tag] || 0) + 1;
                    tagSlots.push(slot);
                }
            });

            // Fetch dynamic tags if needed
            const fetchedByTag = {};
            if (Object.keys(tagCounts).length > 0) {
                await Promise.all(Object.keys(tagCounts).map(async (tag) => {
                    try {
                        const count = tagCounts[tag];
                        let res = await api.get(`/news?tag=${encodeURIComponent(tag)}&limit=${count}`);
                        let items = res.data.news || res.data.rows || res.data.data || [];
                        if (items.length === 0) {
                            res = await api.get(`/news?categories=${encodeURIComponent(tag)}&limit=${count}`);
                            items = res.data.news || res.data.rows || res.data.data || [];
                        }
                        fetchedByTag[tag] = items;
                    } catch (e) {
                        fetchedByTag[tag] = [];
                    }
                }));

                const tagCounters = {};
                tagSlots.forEach(slot => {
                    const tag = slot.cell.tag;
                    const items = fetchedByTag[tag] || [];
                    const idx = tagCounters[tag] || 0;
                    if (items[idx]) {
                        resolvedMap[`${slot.rIdx}-${slot.cIdx}`] = items[idx];
                        tagCounters[tag] = idx + 1;
                    }
                });
            }

            // Fetch static items with contentId
            const staticFetches = editorialSlots.map(async (slot) => {
                const cell = slot.cell;
                const slotKey = `${slot.rIdx}-${slot.cIdx}`;
                if (resolvedMap[slotKey]) return; // Already resolved via tag

                if (cell.contentId) {
                    try {
                        let res;
                        if (cell.contentType === 'news' || cell.contentType === 'video' || cell.contentType === 'photo') {
                            res = await api.get(`/news/${cell.contentId}`);
                            if (res.data) {
                                resolvedMap[slotKey] = res.data.data || res.data.news || res.data;
                            }
                        } else if (cell.contentType === 'image') {
                            res = await api.get(`/photos/${cell.contentId}`);
                            if (res.data) {
                                resolvedMap[slotKey] = res.data;
                            }
                        }
                    } catch (err) {
                        // Fallback placeholder object if ID fetch fails
                        resolvedMap[slotKey] = {
                            id: cell.contentId,
                            newsHeadline: cell.contentTitle || `Content ID: ${cell.contentId}`
                        };
                    }
                }
            });

            await Promise.all(staticFetches);

            if (isMounted) {
                setResolvedItems(prev => ({
                    ...prev,
                    ...resolvedMap
                }));
                setResolvingLoading(false);
            }
        };

        resolveContent();

        return () => {
            isMounted = false;
        };
    }, [editorialSlots]);

    // Filter and search slots
    const filteredSlots = useMemo(() => {
        return editorialSlots.filter(slot => {
            const slotKey = `${slot.rIdx}-${slot.cIdx}`;
            const resolved = resolvedItems[slotKey];
            const headline = (resolved?.newsHeadline || resolved?.title || slot.cell.contentTitle || '').toLowerCase();
            const headlineBn = (resolved?.newsHeadlineBangla || '').toLowerCase();
            const tag = (slot.cell.tag || resolved?.category?.name || '').toLowerCase();
            const type = (slot.cell.contentType || resolved?.newsType || 'news').toLowerCase();

            // Type filter
            if (typeFilter !== 'all') {
                if (typeFilter === 'news' && !['news', 'text', 'standard'].includes(type)) return false;
                if (typeFilter === 'video' && type !== 'video') return false;
                if (typeFilter === 'photo' && !['photo', 'image', 'album'].includes(type)) return false;
            }

            // Search filter
            if (searchFilter) {
                const q = searchFilter.toLowerCase();
                return headline.includes(q) || headlineBn.includes(q) || tag.includes(q);
            }

            return true;
        });
    }, [editorialSlots, resolvedItems, searchFilter, typeFilter]);

    // Handle reordering content between two positions safely via Shift/Insert (CELL DESIGN REMAINS LOCKED TO ITS POSITION)
    const handleReorderSlots = (fromFilteredIndex, toFilteredIndex) => {
        if (fromFilteredIndex < 0 || fromFilteredIndex >= filteredSlots.length || toFilteredIndex < 0 || toFilteredIndex >= filteredSlots.length) return;
        if (fromFilteredIndex === toFilteredIndex) return;

        const slotA = filteredSlots[fromFilteredIndex];
        const slotB = filteredSlots[toFilteredIndex];
        if (!slotA || !slotB) return;

        const fromEditorialIdx = editorialSlots.findIndex(s => s.rIdx === slotA.rIdx && s.cIdx === slotA.cIdx);
        const toEditorialIdx = editorialSlots.findIndex(s => s.rIdx === slotB.rIdx && s.cIdx === slotB.cIdx);
        if (fromEditorialIdx === -1 || toEditorialIdx === -1 || fromEditorialIdx === toEditorialIdx) return;

        // Extract ordered editorial contents
        const currentSlotContents = editorialSlots.map(s => {
            const key = `${s.rIdx}-${s.cIdx}`;
            return {
                contentType: s.cell.contentType,
                contentId: s.cell.contentId,
                contentTitle: s.cell.contentTitle,
                tag: s.cell.tag,
                resolved: resolvedItems[key]
            };
        });

        // Perform Shift / Insert: remove from source index and insert at target index
        const reorderedContents = [...currentSlotContents];
        const [movedPayload] = reorderedContents.splice(fromEditorialIdx, 1);
        reorderedContents.splice(toEditorialIdx, 0, movedPayload);

        // Update layout state with reordered contents across fixed slot geometries
        setLayout(prev => {
            const updated = normalizeLayout(prev);
            if (!updated?.PageSections?.[0]) return prev;

            const sec = updated.PageSections[0];
            const rows = sec.rows || [];

            editorialSlots.forEach((slot, idx) => {
                const row = rows[slot.rIdx];
                if (!row) return;
                const col = (row.columns || [])[slot.cIdx];
                if (!col) return;

                const newPayload = reorderedContents[idx];
                if (newPayload) {
                    col.contentType = newPayload.contentType;
                    col.contentId = newPayload.contentId;
                    col.contentTitle = newPayload.contentTitle;
                    col.tag = newPayload.tag;
                }
            });

            return updated;
        });

        // Update local resolved items cache
        setResolvedItems(prev => {
            const next = { ...prev };
            editorialSlots.forEach((slot, idx) => {
                const key = `${slot.rIdx}-${slot.cIdx}`;
                next[key] = reorderedContents[idx]?.resolved;
            });
            return next;
        });

        const movedHeadline = slotA.cell.contentTitle || resolvedItems[`${slotA.rIdx}-${slotA.cIdx}`]?.newsHeadline || `Item #${slotA.position}`;
        toast.info(`Moved to Position #${slotB.position} (Design preserved)`);
    };

    // Handle swapping content between two positions safely - CELL DESIGN IS LOCKED AND NEVER CHANGED
    const handleSwapSlots = (fromFilteredIndex, toFilteredIndex) => {
        handleReorderSlots(fromFilteredIndex, toFilteredIndex);
    };

    // Open Content Replacement Modal
    const handleOpenReplaceModal = (slot) => {
        setActiveSlotTarget(slot);
        setModalPage(1);
        setModalSearch('');
        const initialTab = slot.cell.contentType === 'video' ? 'video' : (slot.cell.contentType === 'photo' || slot.cell.contentType === 'image') ? 'photo' : 'news';
        setModalTab(initialTab);
        setShowModal(true);
    };

    // Fetch items for the content selector modal
    useEffect(() => {
        if (!showModal) return;

        let isCurrent = true;
        const fetchModalData = async () => {
            setModalLoading(true);
            try {
                if (modalTab === 'news') {
                    const params = {
                        page: modalPage,
                        limit: 10,
                        status: 'all',
                        ...(modalSearch && { search: modalSearch })
                    };
                    const res = await api.get('/news', { params });
                    const items = res.data.news || res.data.rows || res.data.data || [];
                    if (isCurrent) {
                        setModalData(items);
                        setModalTotalPages(res.data.totalPages || 1);
                    }
                } else if (modalTab === 'video') {
                    const params = {
                        categories: 'video,ভিডিও',
                        limit: 10,
                        status: 'all',
                        ...(modalSearch && { search: modalSearch })
                    };
                    const res = await api.get('/news', { params });
                    const items = res.data.news || res.data.rows || [];
                    if (isCurrent) {
                        setModalData(items);
                        setModalTotalPages(res.data.totalPages || 1);
                    }
                } else if (modalTab === 'photo') {
                    const res = await api.get('/photos', { params: { search: modalSearch, limit: 12 } });
                    const items = res.data.data || res.data.photos || res.data || [];
                    if (isCurrent) {
                        setModalData(Array.isArray(items) ? items : []);
                        setModalTotalPages(1);
                    }
                }
            } catch (err) {
                if (isCurrent) {
                    toast.error("Failed to load content options");
                    setModalData([]);
                }
            } finally {
                if (isCurrent) setModalLoading(false);
            }
        };

        fetchModalData();

        return () => {
            isCurrent = false;
        };
    }, [showModal, modalTab, modalSearch, modalPage]);

    // Apply selected item to target slot - CELL DESIGN REMAINS UNTOUCHED
    const handleSelectContentForSlot = (selectedItem) => {
        if (!activeSlotTarget) return;

        const { rIdx, cIdx, position } = activeSlotTarget;
        const contentType = modalTab === 'photo' ? 'image' : (modalTab === 'video' ? 'video' : 'news');
        const contentId = String(selectedItem.id || selectedItem._id);
        const contentTitle = selectedItem.newsHeadline || selectedItem.title || 'Selected Content';

        setLayout(prev => {
            const updated = normalizeLayout(prev);
            if (!updated?.PageSections?.[0]) return prev;

            const sec = updated.PageSections[0];
            const rows = sec.rows || [];
            const targetRow = rows[rIdx];
            if (!targetRow || !targetRow.columns) return prev;

            const cell = targetRow.columns[cIdx];
            if (!cell) return prev;

            // Update content only, keep cell.design and grid dimensions unchanged
            cell.contentType = contentType;
            cell.contentId = contentId;
            cell.contentTitle = contentTitle;
            cell.tag = ''; // Clear tag so explicit assignment is always used
            return updated;
        });

        // Update local resolved preview immediately
        setResolvedItems(prev => ({
            ...prev,
            [`${rIdx}-${cIdx}`]: selectedItem
        }));

        setShowModal(false);
        setActiveSlotTarget(null);
        toast.success(`Assigned "${contentTitle.substring(0, 30)}..." to Position #${position}`);
    };

    // Save all changes back to the database
    const handleSaveChanges = async () => {
        if (!layout?.id) return;

        setSaving(true);
        try {
            const saveData = normalizeLayout(layout);

            const cleanPayload = {
                name: saveData.name,
                autoNewsSelection: saveData.autoNewsSelection || false,
                PageSections: (saveData.PageSections || []).map((section) => {
                    return {
                        name: section.name || null,
                        menuSlug: section.menuSlug || null,
                        layoutType: section.layoutType || 'grid',
                        autoNewsSelection: section.autoNewsSelection || false,
                        rows: (section.rows || []).map((row, rIdx) => ({
                            rowOrder: row.rowOrder || rIdx + 1,
                            columns: (row.columns || []).map((col, cIdx) => {
                                let contentId = col.contentId || null;
                                let contentTitle = col.contentTitle || null;

                                if (col.merged && !col.masterCell) {
                                    contentId = null;
                                    contentTitle = null;
                                }

                                if (contentId !== null && contentId !== undefined) {
                                    contentId = String(contentId);
                                }

                                return {
                                    colOrder: col.colOrder || cIdx + 1,
                                    width: col.width || Math.floor(12 / (row.columns?.length || 3)),
                                    contentType: col.contentType || 'text',
                                    tag: col.tag || '',
                                    design: col.design || null, // Preserved exactly as assigned
                                    contentId,
                                    contentTitle,
                                    merged: col.merged || false,
                                    masterCell: col.masterCell || false,
                                    rowSpan: col.rowSpan || 1,
                                    colSpan: col.colSpan || 1,
                                    masterCellKey: col.masterCellKey || null,
                                    mergedCells: col.mergedCells || null,
                                };
                            })
                        }))
                    };
                })
            };

            await api.patch(`/layout/${saveData.id}`, cleanPayload);
            toast.success("Homepage Section 1 updated & published successfully!");
            fetchHomeLayout();
        } catch (err) {
            console.error("Save layout error:", err);
            toast.error("Failed to save changes: " + (err.response?.data?.error || err.message));
        } finally {
            setSaving(false);
        }
    };

    if (!isAdmin) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="danger">
                    <h4>Access Denied</h4>
                    <p>You do not have administrative permissions to access Section Short List.</p>
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3 text-muted fw-bold">Loading Homepage Section 1...</span>
            </div>
        );
    }

    return (
        <div className="container-fluid py-3">
            {/* Header & Stats Banner */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-4 rounded-3 shadow-sm border">
                <div>
                    <h3 className="mb-1 fw-bold text-dark d-flex align-items-center gap-2">
                        <i className="fas fa-list-ol text-primary"></i>
                        <span>Homepage Section 1 Short List</span>
                    </h3>
                    <p className="text-muted mb-0 small">
                        Manage news, videos, and photo galleries for Section 1. <strong>Position 1 is the Lead Merged Cell</strong>, followed sequentially from the left side. <em>(All cell designs remain permanently locked)</em>
                    </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Button variant="outline-secondary" size="sm" onClick={fetchHomeLayout} disabled={saving}>
                        <i className="fas fa-sync-alt me-1"></i> Refresh
                    </Button>
                    <Link href="/admin/page-layout" className="btn btn-outline-primary btn-sm">
                        <i className="fas fa-columns me-1"></i> Full Grid Editor
                    </Link>
                    <Button variant="success" size="sm" onClick={handleSaveChanges} disabled={saving} className="px-3 fw-bold">
                        {saving ? <><Spinner animation="border" size="sm" className="me-1" /> Saving...</> : <><i className="fas fa-save me-1"></i> Save & Publish</>}
                    </Button>
                </div>
            </div>

            {/* KPI Cards Banner */}
            <Row className="mb-4 g-3">
                <Col xs={6} md={3}>
                    <Card className="border shadow-sm h-100 bg-white">
                        <Card.Body className="py-3 px-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.72rem' }}>Total Editorial Slots</span>
                                <span className="p-1 px-2 rounded-circle bg-light text-primary"><i className="fas fa-layer-group"></i></span>
                            </div>
                            <h2 className="fw-bold mb-0 text-dark">{editorialSlots.length}</h2>
                            <div className="small mt-1 text-muted">#1 Lead + {editorialSlots.length > 0 ? editorialSlots.length - 1 : 0} Left Slots</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} md={3}>
                    <Card className="border shadow-sm h-100 bg-white">
                        <Card.Body className="py-3 px-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.72rem' }}>Lead Position #1</span>
                                <span className="p-1 px-2 rounded-circle bg-light text-warning"><i className="fas fa-star"></i></span>
                            </div>
                            <h6 className="fw-bold mb-0 mt-2 text-truncate text-dark" title={resolvedItems[`${editorialSlots[0]?.rIdx}-${editorialSlots[0]?.cIdx}`]?.newsHeadline || 'Master Merged Cell'}>
                                {resolvedItems[`${editorialSlots[0]?.rIdx}-${editorialSlots[0]?.cIdx}`]?.newsHeadline || 'Master Merged Cell'}
                            </h6>
                            <div className="small text-muted mt-1">Section Main Merged Lead</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} md={3}>
                    <Card className="border shadow-sm h-100 bg-white">
                        <Card.Body className="py-3 px-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.72rem' }}>Content Types</span>
                                <span className="p-1 px-2 rounded-circle bg-light text-teal-500"><i className="fas fa-photo-video"></i></span>
                            </div>
                            <div className="d-flex flex-wrap gap-1 mt-2">
                                <Badge bg="light" text="dark" className="border">📰 News</Badge>
                                <Badge bg="light" text="dark" className="border">🎥 Videos</Badge>
                                <Badge bg="light" text="dark" className="border">🖼️ Photos</Badge>
                            </div>
                            <div className="small text-muted mt-2">Strictly Editorial Only</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} md={3}>
                    <Card className="border shadow-sm h-100 bg-white">
                        <Card.Body className="py-3 px-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.72rem' }}>Protected Ads</span>
                                <span className="p-1 px-2 rounded-circle bg-light text-secondary"><i className="fas fa-shield-alt"></i></span>
                            </div>
                            <h2 className="fw-bold mb-0 text-dark">{adSlotsCount}</h2>
                            <div className="small text-muted mt-1">Ad slots untouched & excluded</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filter Bar */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-3">
                    <Row className="g-2 align-items-center">
                        <Col md={6}>
                            <InputGroup>
                                <InputGroup.Text className="bg-white border-end-0">
                                    <i className="fas fa-search text-muted"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    className="border-start-0 ps-0"
                                    placeholder="Search Section 1 headlines, tags, or topics..."
                                    value={searchFilter}
                                    onChange={e => setSearchFilter(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            <Form.Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                                <option value="all">All Content Types</option>
                                <option value="news">📰 News Articles</option>
                                <option value="video">🎥 Video News</option>
                                <option value="photo">🖼️ Photo Gallery</option>
                            </Form.Select>
                        </Col>
                        <Col md={3} className="text-end">
                            <span className="text-muted small">
                                Showing <strong>{filteredSlots.length}</strong> of <strong>{editorialSlots.length}</strong> slots
                            </span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Short List Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark">
                        <i className="fas fa-layer-group text-teal-500 me-2"></i>
                        Section 1 Editorial Order
                    </h5>
                    <Badge bg="success" className="p-2">
                        <i className="fas fa-shield-alt me-1"></i> Ads Area Protected
                    </Badge>
                </Card.Header>
                <div className="table-responsive">
                    <Table hover align="middle" className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '45px' }} className="text-center" title="Drag to reorder">
                                    <i className="fas fa-arrows-alt text-muted"></i>
                                </th>
                                <th style={{ width: '90px' }} className="text-center">Position</th>
                                <th>Headline & Details</th>
                                <th style={{ width: '130px' }}>Type</th>
                                <th style={{ width: '180px' }}>Placement Slot</th>
                                <th style={{ width: '120px' }}>Status</th>
                                <th style={{ width: '220px' }} className="text-center">Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSlots.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        No editorial items match your filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredSlots.map((slot, index) => {
                                    const slotKey = `${slot.rIdx}-${slot.cIdx}`;
                                    const content = resolvedItems[slotKey];
                                    const isLead = slot.isLead || slot.position === 1;
                                    const rawType = slot.cell.contentType || content?.newsType || 'news';
                                    const headline = content?.newsHeadline || content?.title || slot.cell.contentTitle || (slot.cell.tag ? `Auto Tag: ${slot.cell.tag}` : 'Empty Editorial Slot');
                                    const headlineBn = content?.newsHeadlineBangla || '';
                                    const authorName = content?.Author?.name || content?.author?.name || 'Editorial Desk';
                                    const cellDesign = slot.cell.design || 'Default Design';
                                    const isBeingDragged = draggedIndex === index;
                                    const isDragOver = dragOverIndex === index && draggedIndex !== index;

                                    return (
                                        <tr 
                                            key={slotKey} 
                                            className={`${isLead ? 'table-warning bg-opacity-25' : ''} ${isBeingDragged ? 'opacity-50 bg-light' : ''}`}
                                            draggable={!searchFilter}
                                            onDragStart={(e) => {
                                                setDraggedIndex(index);
                                                e.dataTransfer.effectAllowed = 'move';
                                                e.dataTransfer.setData('text/plain', String(index));
                                            }}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                e.dataTransfer.dropEffect = 'move';
                                                if (dragOverIndex !== index) {
                                                    setDragOverIndex(index);
                                                }
                                            }}
                                            onDragLeave={() => {
                                                if (dragOverIndex === index) {
                                                    setDragOverIndex(null);
                                                }
                                            }}
                                            onDragEnd={() => {
                                                setDraggedIndex(null);
                                                setDragOverIndex(null);
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const sourceIdx = draggedIndex !== null ? draggedIndex : parseInt(e.dataTransfer.getData('text/plain'), 10);
                                                if (!isNaN(sourceIdx) && sourceIdx !== index) {
                                                    handleReorderSlots(sourceIdx, index);
                                                }
                                                setDraggedIndex(null);
                                                setDragOverIndex(null);
                                            }}
                                            style={{
                                                transition: 'all 0.15s ease',
                                                borderTop: isDragOver ? '3px solid #006a60' : undefined,
                                                backgroundColor: isDragOver ? 'rgba(0, 106, 96, 0.08)' : undefined,
                                                cursor: searchFilter ? 'default' : 'grab'
                                            }}
                                        >
                                            {/* Drag Handle */}
                                            <td className="text-center text-muted align-middle" style={{ cursor: searchFilter ? 'default' : 'grab', userSelect: 'none' }}>
                                                <i className="fas fa-grip-vertical text-muted opacity-75" title={searchFilter ? "Clear search to reorder" : "Drag to reorder position"}></i>
                                            </td>

                                            {/* Position Rank */}
                                            <td className="text-center">
                                                {isLead ? (
                                                    <div className="d-flex flex-column align-items-center">
                                                        <Badge bg="warning" text="dark" className="px-2 py-1 fw-bold fs-6 shadow-sm border border-warning">
                                                            #1 LEAD
                                                        </Badge>
                                                        <small className="text-muted" style={{ fontSize: '0.65rem' }}>Merged Cell</small>
                                                    </div>
                                                ) : (
                                                    <Badge bg="primary" className="px-2 py-1 fs-6">
                                                        #{slot.position}
                                                    </Badge>
                                                )}
                                            </td>

                                            {/* Headline & Metadata */}
                                            <td>
                                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '1rem' }}>
                                                    {headline}
                                                </div>
                                                {headlineBn && (
                                                    <div className="text-muted small mb-1">{headlineBn}</div>
                                                )}
                                                <div className="d-flex flex-wrap gap-2 align-items-center text-muted small" style={{ fontSize: '0.75rem' }}>
                                                    {content?.category?.name && (
                                                        <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>{content.category.name}</Badge>
                                                    )}
                                                    {slot.cell.tag && (
                                                        <span className="text-primary"><i className="fas fa-tag me-1"></i>{slot.cell.tag}</span>
                                                    )}
                                                    <span><i className="fas fa-user-edit me-1"></i>{authorName}</span>
                                                    {content?.createdAt && (
                                                        <span><i className="fas fa-calendar-alt me-1"></i>{new Date(content.createdAt).toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Content Type */}
                                            <td>
                                                {rawType === 'video' ? (
                                                    <Badge bg="danger" className="px-2 py-1"><i className="fas fa-video me-1"></i> Video</Badge>
                                                ) : (rawType === 'photo' || rawType === 'image') ? (
                                                    <Badge bg="primary" className="px-2 py-1"><i className="fas fa-camera me-1"></i> Photo</Badge>
                                                ) : (
                                                    <Badge bg="secondary" className="px-2 py-1"><i className="fas fa-newspaper me-1"></i> News</Badge>
                                                )}
                                            </td>

                                            {/* Placement Coordinate & Locked Design Info */}
                                            <td>
                                                <div className="small fw-semibold text-dark">
                                                    Row {slot.rowOrder}, Col {slot.colOrder}
                                                    <span className="text-muted ms-1">({String.fromCharCode(65 + slot.cIdx)}{slot.rIdx + 1})</span>
                                                </div>
                                                <div className="mt-1">
                                                    <Badge bg="light" text="dark" className="border text-truncate" style={{ maxWidth: '160px', fontSize: '0.7rem' }} title={`Locked Design: ${cellDesign}`}>
                                                        🎨 {cellDesign}
                                                    </Badge>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td>
                                                {content?.status === 'published' ? (
                                                    <Badge bg="success">Published</Badge>
                                                ) : content?.status === 'scheduled' ? (
                                                    <Badge bg="info">Scheduled</Badge>
                                                ) : content?.status === 'draft' ? (
                                                    <Badge bg="warning" text="dark">Draft</Badge>
                                                ) : (
                                                    <Badge bg="light" text="dark" className="border">Active</Badge>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="text-center">
                                                <div className="btn-group btn-group-sm mb-1">
                                                    {/* Move Up / Promote Button */}
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        disabled={index === 0}
                                                        onClick={() => handleSwapSlots(index, index - 1)}
                                                        title="Move Up (Keeps Cell Design Locked)"
                                                    >
                                                        <i className="fas fa-arrow-up"></i>
                                                    </Button>

                                                    {/* Move Down Button */}
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        disabled={index === filteredSlots.length - 1}
                                                        onClick={() => handleSwapSlots(index, index + 1)}
                                                        title="Move Down (Keeps Cell Design Locked)"
                                                    >
                                                        <i className="fas fa-arrow-down"></i>
                                                    </Button>

                                                    {/* Change / Replace Modal */}
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleOpenReplaceModal(slot)}
                                                        title="Replace Content (Preserves Design)"
                                                    >
                                                        <i className="fas fa-exchange-alt me-1"></i> Change
                                                    </Button>

                                                    {/* Direct Edit */}
                                                    {content?.id && (
                                                        <Link
                                                            href={
                                                                rawType === 'photo'
                                                                    ? `/admin/photo-news/edit/${content.id}`
                                                                    : rawType === 'video'
                                                                    ? `/admin/video-news/edit/${content.id}`
                                                                    : `/admin/news/edit/${content.id}`
                                                            }
                                                            className="btn btn-outline-info"
                                                            title="Edit Content Details"
                                                        >
                                                            <i className="fas fa-pen"></i>
                                                        </Link>
                                                    )}

                                                    {/* Public View */}
                                                    {content?.slug && (
                                                        <Link
                                                            href={`/news/${content.slug}`}
                                                            target="_blank"
                                                            className="btn btn-outline-dark"
                                                            title="View Live"
                                                        >
                                                            <i className="fas fa-external-link-alt"></i>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>

            {/* Content Selection / Replacement Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="fs-5 fw-bold">
                        Replace Content for Position #{activeSlotTarget?.position}
                        {activeSlotTarget?.isLead && <Badge bg="warning" text="dark" className="ms-2">Lead Slot</Badge>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Tabs activeKey={modalTab} onSelect={(k) => { setModalTab(k); setModalPage(1); }} className="mb-3">
                        <Tab eventKey="news" title="📰 News Articles" />
                        <Tab eventKey="video" title="🎥 Video News" />
                        <Tab eventKey="photo" title="🖼️ Photo Galleries" />
                    </Tabs>

                    <InputGroup className="mb-3">
                        <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                        <Form.Control
                            placeholder={`Search ${modalTab} content...`}
                            value={modalSearch}
                            onChange={e => { setModalSearch(e.target.value); setModalPage(1); }}
                        />
                    </InputGroup>

                    {modalLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : modalData.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            No content found matching your search.
                        </div>
                    ) : (
                        <Row className="g-3">
                            {modalData.map(item => {
                                const itemTitle = item.newsHeadline || item.title || 'Untitled';

                                return (
                                    <Col md={6} key={item.id || item._id}>
                                        <Card
                                            className="h-100 cursor-pointer shadow-sm hover-shadow border"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSelectContentForSlot(item)}
                                        >
                                            <Card.Body className="p-3 d-flex justify-content-between align-items-center">
                                                <div className="overflow-hidden me-2">
                                                    <h6 className="mb-1 text-truncate fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{itemTitle}</h6>
                                                    <div className="d-flex gap-2 align-items-center small text-muted">
                                                        {item.category?.name && <Badge bg="secondary" style={{ fontSize: '0.65rem' }}>{item.category.name}</Badge>}
                                                        <span style={{ fontSize: '0.75rem' }}>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline-primary" className="text-nowrap">
                                                    Select
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}

                    {modalTotalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                            <Button size="sm" variant="outline-secondary" disabled={modalPage === 1} onClick={() => setModalPage(p => p - 1)}>
                                Previous
                            </Button>
                            <span className="small text-muted">Page {modalPage} of {modalTotalPages}</span>
                            <Button size="sm" variant="outline-secondary" disabled={modalPage === modalTotalPages} onClick={() => setModalPage(p => p + 1)}>
                                Next
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
