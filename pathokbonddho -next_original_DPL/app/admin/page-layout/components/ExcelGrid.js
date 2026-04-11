'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Badge, OverlayTrigger, Tooltip, Spinner, Table } from 'react-bootstrap';
import { NewsSelectionModal, ImageSelectionModal, VideoSelectionModal, AdSelectionModal } from './ContentSelectionModals';
import api, { STATIC_URL } from "@/app/lib/api";
import Image from 'next/image';

const UPLOADS_BASE_URL = STATIC_URL || 'http://localhost:5000';

// Helper to build a correct image URL
const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path.replace(/^http:\/\//, 'https://');
    return `${UPLOADS_BASE_URL}/${path.replace(/^\/+/, '')}`;
};

// Preview Cell Content Component
export const PreviewCellContent = ({ contentType, contentId, contentTitle }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            if (!contentId || contentType === 'text') {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                let res;
                if (contentType === 'news') res = await api.get(`/news/${contentId}`);
                else if (contentType === 'ad') res = await api.get(`/ads/${contentId}`);
                else if (contentType === 'image') res = await api.get(`/photos/${contentId}`);

                if (res) setData(res.data.data || res.data.news || res.data);
                else setData({ id: contentId, title: contentTitle });
            } catch (err) {
                console.error(`Error fetching ${contentType} preview:`, err);
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [contentId, contentType]);

    if (loading) return <Spinner animation="border" size="sm" />;
    if (contentType === 'text') return <div className="small text-muted">{contentTitle || 'Text Content'}</div>;

    // News preview
    if (contentType === 'news') {
        const newsImage = data?.thumbImage || data?.leadImage || data?.metaImage || data?.image || data?.thumbnail;
        const headline = data?.newsHeadline || contentTitle;
        const imgSrc = getImageUrl(newsImage);
        return (
            <div className="preview-news-cell">
                {imgSrc && (
                    <div style={{ position: 'relative', height: '80px', overflow: 'hidden', borderRadius: '4px', marginBottom: '4px' }}>
                        <Image
                            src={imgSrc}
                            alt={headline || 'News Thumbnail'}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="150px"
                        />
                    </div>
                )}
                {headline && (
                    <div className="small fw-bold" style={{ fontSize: '0.75rem', lineHeight: '1.2', maxHeight: '2.4em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {headline}
                    </div>
                )}
                {data?.category?.name && <Badge bg="danger" style={{ fontSize: '0.55rem' }} className="mt-1">{data.category.name}</Badge>}
            </div>
        );
    }

    // Image preview
    if (contentType === 'image') {
        const imgSrc = getImageUrl(data?.imageUrl || contentId);
        return (
            <div style={{ position: 'relative', height: '80px', overflow: 'hidden', borderRadius: '4px' }}>
                {imgSrc && (
                    <Image
                        src={imgSrc}
                        alt={data?.title || contentTitle || 'Image'}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="150px"
                    />
                )}
            </div>
        );
    }

    // Video preview
    if (contentType === 'video') {
        const videoTitle = contentTitle || 'Video';
        let youtubeId = null;
        if (contentId) {
            const match = String(contentId).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
            if (match) youtubeId = match[1];
        }
        return (
            <div>
                {youtubeId ? (
                    <div style={{ height: '80px', overflow: 'hidden', borderRadius: '4px', position: 'relative' }}>
                        <Image
                            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                            alt={videoTitle}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="150px"
                        />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem', color: 'white', textShadow: '0 0 6px rgba(0,0,0,0.7)', zIndex: 1 }}>▶</div>
                    </div>
                ) : (
                    <div className="bg-dark text-white text-center rounded py-2" style={{ fontSize: '0.7rem' }}>🎥 {videoTitle}</div>
                )}
            </div>
        );
    }

    // Ad preview
    if (contentType === 'ad') {
        const adImage = data?.image;
        const adTitle = data?.title || data?.name || contentTitle || 'Ad';
        const imgSrc = adImage ? getImageUrl(`uploads/ads/${adImage}`) : null;
        return (
            <div>
                {imgSrc && (
                    <div style={{ position: 'relative', height: '60px', overflow: 'hidden', borderRadius: '4px', marginBottom: '4px' }}>
                        <Image
                            src={imgSrc}
                            alt={adTitle}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="150px"
                        />
                    </div>
                )}
                <div className="small text-truncate" style={{ fontSize: '0.7rem' }}>{adTitle}</div>
            </div>
        );
    }

    // Fallback
    return contentTitle ? <div className="small text-muted text-truncate" style={{ fontSize: '0.7rem' }}>{contentTitle}</div> : null;
};

// Grid Cell Component
const GridCell = ({
    cell, rowIndex, colIndex, onUpdate, isMerged, isSelected, onCellSelect,
    rowSpan, colSpan, isMasterCell, onContentSelect, onMouseDown, onMouseEnter,
    availableTags = [], availableDesigns = [], isAutoNewsMode = false, autoNewsItem = null
}) => {
    const [isEditing, setIsEditing] = useState(false);

    const cellStyle = {
        minWidth: '120px',
        height: isAutoNewsMode ? '120px' : '100px',
        backgroundColor: isMerged ? '#e3f2fd' : isSelected ? '#fff3cd' : 'white',
        cursor: 'pointer',
        position: 'relative',
        border: isSelected ? '2px solid #007bff' : '1px solid #dee2e6',
        verticalAlign: 'top',
        padding: '8px'
    };

    if (isMerged && !isMasterCell) return null;

    const handleContentTypeChange = (newContentType) => {
        if (cell.contentType && cell.contentType !== 'text' && newContentType !== cell.contentType) {
            onUpdate(rowIndex, colIndex, 'contentId', null);
            onUpdate(rowIndex, colIndex, 'contentTitle', null);
        }
        onUpdate(rowIndex, colIndex, 'contentType', newContentType);
        if (newContentType !== 'text' && onContentSelect) {
            setTimeout(() => onContentSelect(rowIndex, colIndex, newContentType), 100);
        } else {
            setIsEditing(false);
        }
    };

    return (
        <td
            rowSpan={rowSpan || 1}
            colSpan={colSpan || 1}
            style={cellStyle}
            onClick={(e) => onCellSelect(rowIndex, colIndex, e)}
            onMouseDown={(e) => onMouseDown(rowIndex, colIndex, e)}
            onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
            onDoubleClick={() => !isAutoNewsMode && setIsEditing(true)}
        >
            <Badge bg="secondary" className="position-absolute top-0 start-0" style={{ fontSize: '0.6rem' }}>
                {String.fromCharCode(65 + colIndex)}{rowIndex + 1}
            </Badge>

            {isSelected && (
                <div className="position-absolute top-0 end-0 p-1"><Badge bg="success">✓</Badge></div>
            )}

            <div className="d-flex flex-column h-100 mt-2">
                {isEditing ? (
                    <div onClick={e => e.stopPropagation()}>
                        <Form.Select size="sm" value={cell.contentType || 'text'} onChange={e => handleContentTypeChange(e.target.value)}>
                            <option value="text">📝 Text</option>
                            <option value="news">📰 News</option>
                            <option value="image">🖼️ Image</option>
                            <option value="video">🎥 Video</option>
                            <option value="ad">📢 Ad</option>
                        </Form.Select>

                        {/* Tag Input with Form.Select */}
                        <Form.Select
                            size="sm"
                            value={cell.tag || ''}
                            onChange={e => onUpdate(rowIndex, colIndex, 'tag', e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className="mt-1"
                        >
                            <option value="">No Tag</option>
                            {availableTags.map(tag => (
                                <option key={tag.id} value={tag.name}>{tag.name}</option>
                            ))}
                        </Form.Select>

                        {/* Design Input with Form.Select */}
                        <Form.Select
                            size="sm"
                            value={cell.design || ''}
                            onChange={e => onUpdate(rowIndex, colIndex, 'design', e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className="mt-1"
                        >
                            <option value="">No Design</option>
                            {availableDesigns.map(design => (
                                <option key={design.id || design.slug} value={design.slug || design.name}>
                                    {design.name || design.slug}
                                </option>
                            ))}
                        </Form.Select>

                        {/* Content select button for non-text */}
                        {cell.contentType && cell.contentType !== 'text' && (
                            <>
                                <Button size="sm" variant="outline-primary" className="mt-1 w-100" style={{ fontSize: '0.7rem' }}
                                    onClick={(e) => { e.stopPropagation(); onContentSelect(rowIndex, colIndex, cell.contentType); }}>
                                    {cell.contentId ? 'Change Selection' : 'Select Content'}
                                </Button>
                                {cell.contentId && (
                                    <div className="mt-1 p-1 bg-light border rounded small">
                                        <div className="fw-bold text-success" style={{ fontSize: '0.7rem' }}>✓ Selected:</div>
                                        <div className="text-truncate" style={{ fontSize: '0.7rem' }} title={cell.contentTitle}>
                                            {cell.contentTitle || `ID: ${String(cell.contentId).substring(0, 8)}...`}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <Button size="sm" variant="link" className="p-0 mt-1" onClick={() => setIsEditing(false)}>Done</Button>
                    </div>
                ) : (
                    <div className="text-center p-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', overflow: 'hidden', opacity: isAutoNewsMode && !cell.tag ? 0.5 : 1 }}>
                        {isAutoNewsMode ? (
                            /* Auto News Mode Display */
                            <>
                                <div className="small fw-bold border-bottom mb-1 pb-1">
                                    {cell.tag ? (
                                        <Badge bg="info" className="text-truncate" style={{ maxWidth: '100%' }}>{cell.tag}</Badge>
                                    ) : (
                                        <Badge bg="danger">MISSING TAG</Badge>
                                    )}
                                </div>
                                {cell.design && <Badge bg="warning" text="dark" className="small d-block mb-1" style={{ fontSize: '0.6rem' }}>Design: {cell.design}</Badge>}
                                <div className="flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden">
                                    {!cell.tag ? (
                                        <div className="text-danger small" style={{ fontSize: '0.7rem' }}>⚠️ Select Tag</div>
                                    ) : autoNewsItem ? (
                                        <div className="w-100">
                                            {autoNewsItem.thumbImage && (
                                                <div className="mb-1" style={{ position: 'relative', height: '30px', overflow: 'hidden' }}>
                                                    <Image
                                                        src={getImageUrl(autoNewsItem.thumbImage)}
                                                        alt={autoNewsItem.newsHeadline || ''}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        sizes="100px"
                                                    />
                                                </div>
                                            )}
                                            <div className="text-truncate small" style={{ fontSize: '0.65rem' }} title={autoNewsItem.newsHeadline}>
                                                {autoNewsItem.newsHeadline}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-muted small" style={{ fontSize: '0.7rem' }}>No news found</div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Standard Editing Mode Display */
                            <>
                                <div className="small fw-bold" style={{ marginBottom: '4px' }}>
                                    {cell.contentType === 'text' && '📝 Text'}
                                    {cell.contentType === 'news' && '📰 News'}
                                    {cell.contentType === 'image' && '🖼️ Image'}
                                    {cell.contentType === 'video' && '🎥 Video'}
                                    {cell.contentType === 'ad' && '📢 Ad'}
                                    {!cell.contentType && '📝 Text'}
                                </div>

                                {cell.tag && <Badge bg="info" className="small" style={{ marginBottom: '4px' }}>Tag: {cell.tag}</Badge>}
                                {cell.design && <Badge bg="warning" text="dark" className="small" style={{ marginBottom: '4px' }}>Design: {cell.design}</Badge>}

                                {cell.contentType && cell.contentType !== 'text' && (
                                    <div style={{ marginTop: 'auto', overflow: 'hidden', maxHeight: '50px' }}>
                                        {cell.contentId ? (
                                            <>
                                                <Badge bg="success" className="small d-block mb-1">✓ {cell.contentType}</Badge>
                                                <div className="small text-break" style={{ fontSize: '0.7rem', backgroundColor: '#e8f4f8', padding: '3px', borderRadius: '3px', maxHeight: '35px', overflow: 'hidden', lineHeight: '1.1', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={cell.contentTitle || `Selected ${cell.contentType} - ID: ${cell.contentId}`}>
                                                    <strong>{cell.contentType}: </strong>
                                                    {cell.contentTitle ? (typeof cell.contentTitle === 'string' ? cell.contentTitle.substring(0, 40) + (cell.contentTitle.length > 40 ? '...' : '') : String(cell.contentTitle)) : `ID: ${String(cell.contentId).substring(0, 8)}...`}
                                                </div>
                                            </>
                                        ) : (
                                            <Button size="sm" variant="outline-primary" className="w-100" style={{ fontSize: '0.7rem', padding: '4px 2px', marginTop: '5px' }}
                                                onClick={e => { e.stopPropagation(); onContentSelect(rowIndex, colIndex, cell.contentType); }}>
                                                Select {cell.contentType}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </td>
    );
};

// Merge Controls
const MergeControls = ({ selectedCells, selectedRange, onMerge, onClearSelection }) => {
    if (selectedCells.size === 0) return null;
    const cellCount = selectedCells.size;
    return (
        <Card className="mb-3 bg-light border-primary">
            <Card.Body className="py-2 d-flex justify-content-between align-items-center">
                <div>
                    <Badge bg="primary" className="me-2">{cellCount} {cellCount === 1 ? 'Cell' : 'Cells'} Selected</Badge>
                    {selectedRange && (
                        <small className="text-muted">
                            Range: {String.fromCharCode(65 + selectedRange.startCol)}{selectedRange.startRow + 1} to {String.fromCharCode(65 + selectedRange.endCol)}{selectedRange.endRow + 1}
                        </small>
                    )}
                </div>
                <div>
                    {cellCount > 1 && <Button variant="success" size="sm" className="me-2" onClick={() => onMerge('merge')}>🔗 Merge {cellCount} Cells</Button>}
                    <Button variant="warning" size="sm" className="me-2" onClick={() => onMerge('split')}>🔓 Split</Button>
                    <Button variant="outline-secondary" size="sm" onClick={onClearSelection}>Clear</Button>
                </div>
            </Card.Body>
        </Card>
    );
};

// Excel Grid Section
export const ExcelGridSection = ({
    section, sectionIndex, onUpdateSection, onAddRow, onAddColumn, onDeleteRow, onDeleteColumn,
    onUpdateCell, onUpdateCellContent, onMergeCells, availableTags, availableDesigns = [], menus = [],
    globalAutoNewsSelection = false, autoNewsData = {}
}) => {
    const [selectedCells, setSelectedCells] = useState(new Set());
    const [selectionStart, setSelectionStart] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [contentModal, setContentModal] = useState({ show: false, contentType: null, rowIndex: null, colIndex: null });

    const rows = section.rows || [];
    const columns = rows[0]?.columns || [];

    const isAutoNewsMode = globalAutoNewsSelection || section.autoNewsSelection;

    const getSelectedRange = () => {
        if (selectedCells.size === 0) return null;
        const cellsArray = Array.from(selectedCells).map(key => {
            const [row, col] = key.split('-').map(Number);
            return { row, col };
        });
        const rowsArr = cellsArray.map(cell => cell.row);
        const colsArr = cellsArray.map(cell => cell.col);
        return {
            startRow: Math.min(...rowsArr), startCol: Math.min(...colsArr),
            endRow: Math.max(...rowsArr), endCol: Math.max(...colsArr),
            cells: cellsArray
        };
    };

    const handleCellSelect = (rowIndex, colIndex, event) => {
        const cellKey = `${rowIndex}-${colIndex}`;
        if (event.shiftKey && selectionStart) {
            handleRangeSelection(rowIndex, colIndex);
        } else if (event.ctrlKey || event.metaKey) {
            setSelectedCells(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cellKey)) newSet.delete(cellKey);
                else newSet.add(cellKey);
                return newSet;
            });
        } else {
            setSelectedCells(new Set([cellKey]));
            setSelectionStart({ r: rowIndex, c: colIndex });
        }
    };

    const handleRangeSelection = (endRow, endCol) => {
        if (!selectionStart) return;
        const newSelected = new Set();
        const startR = Math.min(selectionStart.r, endRow);
        const endR = Math.max(selectionStart.r, endRow);
        const startC = Math.min(selectionStart.c, endCol);
        const endC = Math.max(selectionStart.c, endCol);
        for (let i = startR; i <= endR; i++) {
            for (let j = startC; j <= endC; j++) {
                newSelected.add(`${i}-${j}`);
            }
        }
        setSelectedCells(newSelected);
    };

    const handleMouseDown = (r, c, e) => {
        setIsSelecting(true);
        const key = `${r}-${c}`;
        setSelectedCells(new Set([key]));
        setSelectionStart({ r, c });
    };

    const handleMouseEnter = (r, c) => {
        if (!isSelecting || !selectionStart) return;
        const newSelected = new Set();
        const startR = Math.min(selectionStart.r, r);
        const endR = Math.max(selectionStart.r, r);
        const startC = Math.min(selectionStart.c, c);
        const endC = Math.max(selectionStart.c, c);
        for (let i = startR; i <= endR; i++) {
            for (let j = startC; j <= endC; j++) {
                newSelected.add(`${i}-${j}`);
            }
        }
        setSelectedCells(newSelected);
    };

    useEffect(() => {
        const handleMouseUp = () => setIsSelecting(false);
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    const handleMerge = (action) => {
        if (action === 'merge' && selectedCells.size > 1) {
            const cells = Array.from(selectedCells).map(k => {
                const [r, c] = k.split('-').map(Number);
                return { row: r, col: c };
            });
            const rIdxs = cells.map(c => c.row);
            const cIdxs = cells.map(c => c.col);
            onMergeCells(sectionIndex, {
                action: 'merge',
                startRow: Math.min(...rIdxs), endRow: Math.max(...rIdxs),
                startCol: Math.min(...cIdxs), endCol: Math.max(...cIdxs),
                cells
            });
        } else if (action === 'split') {
            const keys = Array.from(selectedCells);
            if (keys.length > 0) {
                const [r, c] = keys[0].split('-').map(Number);
                onMergeCells(sectionIndex, { action: 'split', row: r, col: c });
            }
        }
        setSelectedCells(new Set());
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                <div className="d-flex align-items-center">
                    <h6 className="mb-0 me-3">{section.name || `Section ${sectionIndex + 1}`}</h6>
                    <Form.Check type="switch" label="Auto News" checked={section.autoNewsSelection || false} onChange={e => onUpdateSection(sectionIndex, 'autoNewsSelection', e.target.checked)} />
                </div>
                <div>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onAddRow(sectionIndex)}>+ Row</Button>
                    <Button variant="outline-primary" size="sm" onClick={() => onAddColumn(sectionIndex)}>+ Col</Button>
                </div>
            </Card.Header>
            <Card.Body>
                {/* Section Name from Menu Selection - like old React project */}
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Section Name (Menu Category)</Form.Label>
                    <Form.Select
                        value={section.name || ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                const selectedMenu = menus.find(m => m.name === val);
                                onUpdateSection(sectionIndex, { name: val, menuSlug: selectedMenu?.path || selectedMenu?.slug || '' });
                            } else {
                                onUpdateSection(sectionIndex, { name: '', menuSlug: '' });
                            }
                        }}
                    >
                        <option value="">No menu selection</option>
                        {menus.map((menu) => (
                            <option key={menu.id} value={menu.name}>
                                {menu.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <MergeControls selectedCells={selectedCells} selectedRange={getSelectedRange()} onMerge={handleMerge} onClearSelection={() => setSelectedCells(new Set())} />
                <div className="table-responsive">
                    <Table bordered className="mb-0" style={{ borderCollapse: 'separate' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }} className="bg-light"></th>
                                {columns.map((_, ci) => (
                                    <th key={ci} className="text-center bg-light position-relative">
                                        {String.fromCharCode(65 + ci)}
                                        <Button variant="link" size="sm" className="p-0 position-absolute end-0 text-danger" onClick={() => onDeleteColumn(sectionIndex, ci)}>×</Button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, ri) => (
                                <tr key={ri}>
                                    <td className="bg-light text-center fw-bold position-relative">
                                        {ri + 1}
                                        <Button variant="link" size="sm" className="p-0 position-absolute bottom-0 text-danger" onClick={() => onDeleteRow(sectionIndex, ri)}>×</Button>
                                    </td>
                                    {row.columns.map((cell, ci) => {
                                        const autoNewsKey = `${sectionIndex}-${ri}-${ci}`;
                                        return (
                                            <GridCell
                                                key={`${ri}-${ci}`}
                                                cell={cell}
                                                rowIndex={ri}
                                                colIndex={ci}
                                                onUpdate={(r, c, f, v) => onUpdateCell(sectionIndex, r, c, f, v)}
                                                isSelected={selectedCells.has(`${ri}-${ci}`)}
                                                onCellSelect={handleCellSelect}
                                                onMouseDown={handleMouseDown}
                                                onMouseEnter={handleMouseEnter}
                                                onContentSelect={(r, c, type) => setContentModal({ show: true, contentType: type, rowIndex: r, colIndex: c })}
                                                isMerged={cell.merged}
                                                isMasterCell={cell.masterCell}
                                                rowSpan={cell.rowSpan}
                                                colSpan={cell.colSpan}
                                                isAutoNewsMode={isAutoNewsMode}
                                                autoNewsItem={autoNewsData[autoNewsKey] || null}
                                                availableTags={availableTags}
                                                availableDesigns={availableDesigns}
                                            />
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
            {contentModal.show && (
                <>
                    {contentModal.contentType === 'news' && <NewsSelectionModal show={true} onClose={() => setContentModal({ show: false })} onSelect={data => { onUpdateCellContent(sectionIndex, contentModal.rowIndex, contentModal.colIndex, 'news', data.id, data.newsHeadline); setContentModal({ show: false }); }} />}
                    {contentModal.contentType === 'image' && <ImageSelectionModal show={true} onClose={() => setContentModal({ show: false })} onSelect={data => { onUpdateCellContent(sectionIndex, contentModal.rowIndex, contentModal.colIndex, 'image', data.imageUrl || data.image, data.filename); setContentModal({ show: false }); }} />}
                    {contentModal.contentType === 'video' && <VideoSelectionModal show={true} onClose={() => setContentModal({ show: false })} onSelect={data => { onUpdateCellContent(sectionIndex, contentModal.rowIndex, contentModal.colIndex, 'video', data.id, data.newsHeadline); setContentModal({ show: false }); }} />}
                    {contentModal.contentType === 'ad' && <AdSelectionModal show={true} onClose={() => setContentModal({ show: false })} onSelect={data => { onUpdateCellContent(sectionIndex, contentModal.rowIndex, contentModal.colIndex, 'ad', data.id, data.title || data.name); setContentModal({ show: false }); }} />}
                </>
            )}
        </Card>
    );
};
