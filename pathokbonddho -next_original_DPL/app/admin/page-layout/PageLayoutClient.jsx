'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Table, Spinner, Badge, Tab, Nav, Alert } from 'react-bootstrap';
import api from "@/app/lib/api";
import { toast } from 'react-toastify';
import { ExcelGridSection, PreviewCellContent } from './components/ExcelGrid';
import useSWR, { mutate } from 'swr';
import { fetcher } from "@/app/lib/swr-config";

const createNewSection = (rows = 3, columns = 3) => {
    const sectionRows = [];
    for (let i = 0; i < rows; i++) {
        const row = { rowOrder: i + 1, columns: [] };
        for (let j = 0; j < columns; j++) {
            row.columns.push({
                colOrder: j + 1,
                contentType: 'text',
                tag: '',
                width: Math.floor(12 / columns),
                merged: false,
                rowSpan: 1,
                colSpan: 1
            });
        }
        sectionRows.push(row);
    }
    return { layoutType: 'grid', name: `Section ${Date.now()}`, autoNewsSelection: false, rows: sectionRows };
};

const PageLayoutClient = ({ initialPages, initialTags, initialMenus, initialDesigns, isAdmin }) => {
    const { data: swrPages, error, isLoading: loading } = useSWR(isAdmin ? '/layout' : null, fetcher, {
        fallbackData: initialPages,
        revalidateOnFocus: false
    });
    
    const pages = Array.isArray(swrPages) ? swrPages : (swrPages?.data || []);
    const [selectedPage, setSelectedPage] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editPage, setEditPage] = useState(null);
    const [availableTags] = useState(initialTags || []);
    const [availableDesigns] = useState(initialDesigns || []);
    const [menus] = useState(initialMenus || []);
    const [autoNewsData, setAutoNewsData] = useState({});
    const [newPage, setNewPage] = useState({ name: '', autoNewsSelection: false, sections: [createNewSection(3, 3)] });

    const refreshData = () => mutate('/layout');

    const handleFetchForEdit = async (id) => {
        try {
            const res = await api.get(`/layout/${id}`);
            const data = res.data;
            if (data.PageSections) {
                data.PageSections = data.PageSections.map(s => ({
                    ...s,
                    rows: (s.Rows || s.rows || []).map(r => ({
                        ...r,
                        columns: (r.Columns || r.columns || []).map(c => ({
                            ...c,
                            contentType: c.contentType || 'text',
                            contentId: c.contentId || null,
                            contentTitle: c.contentTitle || null,
                            merged: c.merged || false,
                            rowSpan: c.rowSpan || 1,
                            colSpan: c.colSpan || 1
                        }))
                    }))
                }));
            }
            setEditPage(data);
            if (data.autoNewsSelection || (data.PageSections && data.PageSections.some(s => s.autoNewsSelection))) {
                fetchAutoNewsForPage(data);
            }
            setShowEditModal(true);
        } catch (err) { toast.error("Failed to load page"); }
    };

    const fetchAutoNewsForPage = async (pageData) => {
        if (!pageData?.PageSections) return;
        const tagCounts = {};
        const cellMap = [];
        pageData.PageSections.forEach((section, sIdx) => {
            (section.rows || section.Rows || []).forEach((row, rIdx) => {
                (row.columns || row.Columns || []).forEach((col, cIdx) => {
                    if (col.tag) {
                        tagCounts[col.tag] = (tagCounts[col.tag] || 0) + 1;
                        cellMap.push({ sIdx, rIdx, cIdx, tag: col.tag });
                    }
                });
            });
        });

        const fetchedNewsByTag = {};
        try {
            await Promise.all(Object.keys(tagCounts).map(async (tag) => {
                const count = tagCounts[tag];
                const res = await api.get(`/news?tag=${tag}&limit=${count}`);
                fetchedNewsByTag[tag] = res.data.news || res.data.rows || res.data.data || [];
            }));

            const newAutoNewsData = {};
            const tagUsageCounter = {};

            cellMap.forEach(({ sIdx, rIdx, cIdx, tag }) => {
                const availableNews = fetchedNewsByTag[tag] || [];
                const usageCount = tagUsageCounter[tag] || 0;
                const newsItem = availableNews[usageCount] || null;
                if (newsItem) {
                    newAutoNewsData[`${sIdx}-${rIdx}-${cIdx}`] = newsItem;
                    tagUsageCounter[tag] = usageCount + 1;
                }
            });
            setAutoNewsData(newAutoNewsData);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch auto news");
        }
    };

    const handleSave = async () => {
        try {
            // Deep clone the data for save
            const saveData = JSON.parse(JSON.stringify(editPage));

            // Build a clean payload that only has the fields the backend expects
            const cleanPayload = {
                name: saveData.name,
                autoNewsSelection: saveData.autoNewsSelection || false,
                PageSections: (saveData.PageSections || []).map((section, sIdx) => {
                    const isAutoActive = saveData.autoNewsSelection || section.autoNewsSelection;

                    return {
                        name: section.name || null,
                        menuSlug: section.menuSlug || null,
                        layoutType: section.layoutType || 'grid',
                        autoNewsSelection: section.autoNewsSelection || false,
                        rows: (section.rows || []).map((row, rIdx) => ({
                            rowOrder: row.rowOrder || rIdx + 1,
                            columns: (row.columns || []).map((col, cIdx) => {
                                // Check if auto news should fill this cell
                                const autoNewsKey = `${sIdx}-${rIdx}-${cIdx}`;
                                const autoItem = autoNewsData[autoNewsKey];
                                let contentType = col.contentType || 'text';
                                let contentId = col.contentId || null;
                                let contentTitle = col.contentTitle || null;

                                if (isAutoActive && autoItem && col.tag) {
                                    contentType = 'news';
                                    contentId = String(autoItem.id || autoItem._id);
                                    contentTitle = autoItem.newsHeadline || `News ${autoItem.id || autoItem._id}`;
                                }

                                // Ensure contentId is always a string if present
                                if (contentId !== null && contentId !== undefined) {
                                    contentId = String(contentId);
                                }

                                return {
                                    colOrder: col.colOrder || cIdx + 1,
                                    width: col.width || Math.floor(12 / (row.columns?.length || 3)),
                                    contentType,
                                    tag: col.tag || '',
                                    design: col.design || null,
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
            toast.success("Saved successfully");
            setShowEditModal(false);
            refreshData();
            // Also refresh the selected page preview so grid preview updates
            try {
                const res = await api.get(`/layout/${saveData.id}`);
                setSelectedPage(res.data);
            } catch (e) {
                // If refresh fails, just clear selectedPage
                setSelectedPage(null);
            }
        } catch (err) {
            console.error("Save error:", err);
            toast.error("Save failed: " + (err.response?.data?.error || err.message));
        }
    };

    const updateGridCell = (sIdx, rIdx, cIdx, field, value) => {
        const newData = JSON.parse(JSON.stringify(editPage));
        newData.PageSections[sIdx].rows[rIdx].columns[cIdx][field] = value;
        setEditPage(newData);
    };

    const updateCellContent = (sIdx, rIdx, cIdx, type, id, title) => {
        const newData = JSON.parse(JSON.stringify(editPage));
        const cell = newData.PageSections[sIdx].rows[rIdx].columns[cIdx];
        cell.contentType = type;
        cell.contentId = id;
        cell.contentTitle = title;
        setEditPage(newData);
    };

    const mergeGridCells = (sIdx, mergeData) => {
        const newData = JSON.parse(JSON.stringify(editPage));
        const section = newData.PageSections[sIdx];
        if (mergeData.action === 'merge') {
            const { startRow, startCol, endRow, endCol, cells } = mergeData;
            const master = section.rows[startRow].columns[startCol];
            master.merged = true; master.masterCell = true;
            master.rowSpan = endRow - startRow + 1;
            master.colSpan = endCol - startCol + 1;
            master.mergedCells = cells.slice(1);
            cells.slice(1).forEach(c => {
                const cell = section.rows[c.row].columns[c.col];
                cell.merged = true; cell.masterCell = false; cell.masterCellKey = `${startRow}-${startCol}`;
            });
        } else if (mergeData.action === 'split') {
            const { row, col } = mergeData;
            const master = section.rows[row].columns[col];
            if (master.merged && master.masterCell) {
                (master.mergedCells || []).forEach(c => {
                    const cell = section.rows[c.row].columns[c.col];
                    cell.merged = false; delete cell.masterCellKey;
                });
                master.merged = false; master.masterCell = false; master.rowSpan = 1; master.colSpan = 1; delete master.mergedCells;
            }
        }
        setEditPage(newData);
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container-fluid mt-4">
            <Row>
                <Col md={3}>
                    <Card className="shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <span>Pages</span>
                            <Button size="sm" onClick={() => setShowCreateModal(true)}>+</Button>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="list-group list-group-flush">
                                {pages.map(p => (
                                    <div key={p.id} className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedPage?.id === p.id ? 'active' : ''}`} style={{cursor: 'pointer'}} onClick={() => api.get(`/layout/${p.id}`).then(r => setSelectedPage(r.data))}>
                                        <span className="text-truncate" style={{maxWidth: '120px'}}>{p.name}</span>
                                        <div className="btn-group">
                                            <Button size="sm" variant={selectedPage?.id === p.id ? "light" : "outline-primary"} onClick={(e) => { e.stopPropagation(); handleFetchForEdit(p.id); }}>Edit</Button>
                                            <Button size="sm" variant={selectedPage?.id === p.id ? "light" : "outline-danger"} onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) api.delete(`/layout/${p.id}`).then(() => refreshData()); }}>×</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={9}>
                    {selectedPage ? (
                        <Card className="shadow-sm">
                            <Card.Header>
                                <h4 className="mb-0">Layout: {selectedPage.name}</h4>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Container defaultActiveKey="preview">
                                    <Nav variant="tabs" className="mb-3">
                                        <Nav.Item>
                                            <Nav.Link eventKey="preview">Grid Preview</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="json">JSON Data</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="preview">
                                            {selectedPage.PageSections?.map((section, sectionIndex) => (
                                                <div key={sectionIndex} className="mb-4">
                                                    <h5>{section.name || `Section ${sectionIndex + 1}`}</h5>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <tbody>
                                                                {(section.Rows || section.rows)?.map((row, rowIndex) => (
                                                                    <tr key={rowIndex}>
                                                                        {(row.Columns || row.columns)?.map((column, colIndex) => {
                                                                            if (column.merged && !column.masterCell) return null;
                                                                            return (
                                                                                <td
                                                                                    key={colIndex}
                                                                                    className="p-2"
                                                                                    rowSpan={column.rowSpan || 1}
                                                                                    colSpan={column.colSpan || 1}
                                                                                    style={{
                                                                                        minWidth: '150px',
                                                                                        verticalAlign: 'top',
                                                                                        backgroundColor: column.contentId ? '#fff' : '#f8f9fa'
                                                                                    }}
                                                                                >
                                                                                    {/* Header: Content Type + Badges */}
                                                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                                                        <Badge bg={
                                                                                            column.contentType === 'news' ? 'primary' :
                                                                                                column.contentType === 'image' ? 'success' :
                                                                                                    column.contentType === 'video' ? 'danger' :
                                                                                                        column.contentType === 'ad' ? 'warning' : 'secondary'
                                                                                        } className="text-uppercase" style={{ fontSize: '0.65rem' }}>
                                                                                            {column.contentType === 'news' && '📰 '}
                                                                                            {column.contentType === 'image' && '🖼️ '}
                                                                                            {column.contentType === 'video' && '🎥 '}
                                                                                            {column.contentType === 'ad' && '📢 '}
                                                                                            {column.contentType || 'text'}
                                                                                        </Badge>
                                                                                        <div>
                                                                                            {column.tag && <Badge bg="info" className="me-1" style={{ fontSize: '0.6rem' }}>{column.tag}</Badge>}
                                                                                            {column.design && <Badge bg="warning" text="dark" style={{ fontSize: '0.6rem' }}>{column.design}</Badge>}
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Content Preview */}
                                                                                    {column.contentId && column.contentType && column.contentType !== 'text' && (
                                                                                        <PreviewCellContent
                                                                                            contentType={column.contentType}
                                                                                            contentId={column.contentId}
                                                                                            contentTitle={column.contentTitle}
                                                                                        />
                                                                                    )}

                                                                                    {/* Fallback: No content selected */}
                                                                                    {(!column.contentId && column.contentType && column.contentType !== 'text') && (
                                                                                        <div className="text-center text-muted small py-2" style={{ fontSize: '0.75rem' }}>
                                                                                            <em>No content selected</em>
                                                                                        </div>
                                                                                    )}

                                                                                    {/* Size info */}
                                                                                    <div className="mt-1">
                                                                                        <small className="text-muted" style={{ fontSize: '0.6rem' }}>
                                                                                            Size: {column.width}/12
                                                                                        </small>
                                                                                    </div>
                                                                                </td>
                                                                            );
                                                                        })}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            ))}
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="json">
                                            <pre className="bg-dark text-light p-3 rounded" style={{ maxHeight: '500px', overflow: 'auto' }}>
                                                {JSON.stringify(selectedPage, null, 2)}
                                            </pre>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    ) : (
                        <div className="text-center p-5 border rounded bg-light text-muted">
                            <i className="fas fa-layer-group fa-3x mb-3"></i>
                            <p>Select a page to preview its layout</p>
                        </div>
                    )}
                </Col>
            </Row>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="xl" fullscreen="lg-down">
                <Modal.Header closeButton><Modal.Title>Edit Layout: {editPage?.name}</Modal.Title></Modal.Header>
                <Modal.Body className="bg-light">
                    <Row className="mb-4">
                        <Col md={8}>
                            <Form.Group><Form.Label>Page Name</Form.Label><Form.Control value={editPage?.name || ''} onChange={e => setEditPage({...editPage, name: e.target.value})}/></Form.Group>
                        </Col>
                        <Col md={4} className="d-flex align-items-end">
                            <Form.Check type="switch" id="auto-news-page-switch" label="Global Auto News Selection" checked={editPage?.autoNewsSelection || false} onChange={e => {
                                const newEditPage = {...editPage, autoNewsSelection: e.target.checked};
                                setEditPage(newEditPage);
                                if (e.target.checked) fetchAutoNewsForPage(newEditPage);
                            }} />
                        </Col>
                    </Row>
                    {editPage?.PageSections?.map((s, si) => (
                        <ExcelGridSection
                            key={s.id || si}
                            section={s}
                            sectionIndex={si}
                            onUpdateSection={(idx, f, v) => {
                                const ss = JSON.parse(JSON.stringify(editPage.PageSections));
                                if (typeof f === 'object') {
                                    Object.keys(f).forEach(k => { ss[idx][k] = f[k]; });
                                } else {
                                    ss[idx][f] = v;
                                }
                                // Clear section cells if autoNews is turned OFF
                                if (f === 'autoNewsSelection' && v === false) {
                                    ss[idx].rows?.forEach(row => {
                                        row.columns?.forEach(col => {
                                            if (col.tag && col.contentType === 'news') {
                                                col.contentId = null;
                                                col.contentTitle = null;
                                            }
                                        });
                                    });
                                }
                                const newEditPage = { ...editPage, PageSections: ss };
                                setEditPage(newEditPage);
                                // Trigger fetch if enabling auto news for a section
                                if (f === 'autoNewsSelection' && v === true) {
                                    fetchAutoNewsForPage(newEditPage);
                                }
                            }}
                            onAddRow={idx => { const ss = [...editPage.PageSections]; const cols = ss[idx].rows[0]?.columns?.length || 3; ss[idx].rows.push({rowOrder: ss[idx].rows.length+1, columns: Array.from({length: cols}, (_, i) => ({colOrder: i+1, contentType: 'text', width: Math.floor(12/cols)}))}); setEditPage({...editPage, PageSections: ss}); }}
                            onAddColumn={idx => { const ss = [...editPage.PageSections]; ss[idx].rows.forEach(r => r.columns.push({colOrder: r.columns.length+1, contentType: 'text', width: Math.floor(12/(r.columns.length+1))})); setEditPage({...editPage, PageSections: ss}); }}
                            onDeleteRow={(si, ri) => { const ss = [...editPage.PageSections]; ss[si].rows.splice(ri, 1); setEditPage({...editPage, PageSections: ss}); }}
                            onDeleteColumn={(si, ci) => { const ss = [...editPage.PageSections]; ss[si].rows.forEach(r => r.columns.splice(ci, 1)); setEditPage({...editPage, PageSections: ss}); }}
                            onUpdateCell={updateGridCell}
                            onUpdateCellContent={updateCellContent}
                            onMergeCells={mergeGridCells}
                            availableTags={availableTags}
                            availableDesigns={availableDesigns}
                            menus={menus}
                            globalAutoNewsSelection={editPage?.autoNewsSelection}
                            autoNewsData={autoNewsData}
                        />
                    ))}
                    <Button variant="primary" className="mt-2" onClick={() => setEditPage({...editPage, PageSections: [...(editPage.PageSections || []), createNewSection()]})}>+ Add New Section</Button>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button><Button variant="success" onClick={handleSave}>Save Layout</Button></Modal.Footer>
            </Modal>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Create New Page</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control value={newPage.name} onChange={e => setNewPage({...newPage, name: e.target.value})}/></Form.Group>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button><Button variant="primary" onClick={() => api.post('/layout', newPage).then(() => { setShowCreateModal(false); refreshData(); })}>Create</Button></Modal.Footer>
            </Modal>
        </div>
    );
};

export default PageLayoutClient;
