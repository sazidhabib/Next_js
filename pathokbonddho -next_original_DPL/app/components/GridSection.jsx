"use client";
import React from 'react';
import { Container } from 'react-bootstrap';
import Link from 'next/link';
import { useMenu } from '../providers/MenuProvider';
import GridCell from './GridCell';

const GridSection = ({ section }) => {
    const { menus } = useMenu();
    const sortedRows = [...(section.Rows || section.rows || [])].sort((a, b) => a.rowOrder - b.rowOrder);

    if (!sortedRows.length) return null;

    // Determine the number of grid columns from the first row
    const firstRow = sortedRows[0];
    const totalCols = (firstRow.Columns || firstRow.columns || []).length;

    // Build a flat list of cells with grid placement info
    // We need to process merged cells to place them correctly in CSS Grid
    const gridCells = [];
    const occupiedCells = new Set(); // Track cells occupied by merged spans

    sortedRows.forEach((row, rowIndex) => {
        const sortedCols = [...(row.Columns || row.columns || [])].sort((a, b) => a.colOrder - b.colOrder);

        sortedCols.forEach((col, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`;

            // Skip cells that are occupied by a merge span from another cell
            if (occupiedCells.has(cellKey)) return;

            // Skip non-master merged cells
            if (col.merged && !col.masterCell) return;

            const rowSpan = col.rowSpan || 1;
            const colSpan = col.colSpan || 1;

            // Mark occupied cells for merged spans
            if (rowSpan > 1 || colSpan > 1) {
                for (let r = 0; r < rowSpan; r++) {
                    for (let c = 0; c < colSpan; c++) {
                        if (r === 0 && c === 0) continue;
                        occupiedCells.add(`${rowIndex + r}-${colIndex + c}`);
                    }
                }
            }

            // CSS Grid uses 1-based positioning
            gridCells.push({
                col,
                rowIndex,
                colIndex,
                gridRow: `${rowIndex + 1} / span ${rowSpan}`,
                gridColumn: `${colIndex + 1} / span ${colSpan}`,
                key: col.id || cellKey
            });
        });
    });

    // Calculate column template: enforce equal width for all columns (1fr)
    const firstRowCols = (firstRow.Columns || firstRow.columns || []).sort((a, b) => a.colOrder - b.colOrder);
    const gridTemplateColumns = firstRowCols.map(() => `minmax(0, 1fr)`).join(' ');

    // ─── Mobile layout: lead item, then ads, then remaining cells ───
    const mergedCells = [];
    const ads = [];
    const newsCells = [];

    // Check if this is a "ছবি" (photo) section – exempt from the new mobile layout
    const sectionName = (section.name || '').trim();
    const isPhotoSection = sectionName === 'ছবি' || sectionName.toLowerCase() === 'photo';

    gridCells.forEach(({ col, key, rowIndex, colIndex }) => {
        // Skip empty/text-only cells
        if (!col.contentType || col.contentType === 'text') return;

        if (col.contentType === 'ad' || col.contentType === 'ads') {
            ads.push({ col, key });
            return;
        }

        const colSpan = col.colSpan || 1;
        const isMerged = col.masterCell === true && colSpan > 1;

        if (isMerged) {
            mergedCells.push({ col, key, rowIndex, colIndex });
        } else {
            newsCells.push({ col, key, rowIndex, colIndex });
        }
    });

    // Sort by grid position
    newsCells.sort((a, b) => a.rowIndex - b.rowIndex || a.colIndex - b.colIndex);
    mergedCells.sort((a, b) => a.rowIndex - b.rowIndex || a.colIndex - b.colIndex);

    // If no merged cells, the first news item is the "lead"
    let leadNews = null;
    if (mergedCells.length === 0 && newsCells.length > 0) {
        leadNews = newsCells.shift();
    }

    // ─── Build mobile rows from remaining news cells ───
    // New layout (for non-photo sections):
    //   • First 4 news → "image-top", 2 per row
    //   • Remaining news → "title-image-left", 1 per row
    // Photo section keeps original grid behavior.

    const mobileRows = [];

    if (isPhotoSection) {
        // Photo section: keep original alternating layout but start with 2-column row
        // ALL cells forced to text-inside-image design.
        let contentBuffer = [];
        let alternatingType = 'photo-double';

        const flushContentBuffer = () => {
            while (contentBuffer.length > 0) {
                if (alternatingType === 'photo-single') {
                    mobileRows.push({
                        type: 'photo-single',
                        cells: [contentBuffer.shift()]
                    });
                    alternatingType = 'photo-double';
                } else {
                    const cells = [contentBuffer.shift()];
                    if (contentBuffer.length > 0) {
                        cells.push(contentBuffer.shift());
                    }
                    mobileRows.push({
                        type: 'photo-double',
                        cells
                    });
                    alternatingType = 'photo-single';
                }
            }
        };

        newsCells.forEach(({ col, key }) => {
            contentBuffer.push({ col, key });
        });
        flushContentBuffer();
    } else {
        // New layout for all non-photo sections
        // First/unnamed section ("Section 1") gets 4 image-top items (2 rows of 2)
        // Other named sections get 2 image-top items (1 row of 2)
        const isFirstSection = sectionName.startsWith('Section') || !sectionName;
        const IMAGE_TOP_LIMIT = isFirstSection ? 4 : 2;
        let imageTopCount = 0;
        let imageTopBuffer = [];

        newsCells.forEach(({ col, key }) => {
            // Always preserve text-inside-image design
            if (col.design === 'text-inside-image') {
                // Flush any pending image-top buffer first
                if (imageTopBuffer.length > 0) {
                    mobileRows.push({
                        type: 'image-top',
                        cells: [...imageTopBuffer]
                    });
                    imageTopBuffer = [];
                }
                mobileRows.push({
                    type: 'text-inside-image',
                    cells: [{ col, key }]
                });
                return;
            }

            if (imageTopCount < IMAGE_TOP_LIMIT) {
                // First 4 news: image-top design, buffer 2 per row
                imageTopBuffer.push({ col, key });
                imageTopCount++;

                if (imageTopBuffer.length === 2) {
                    mobileRows.push({
                        type: 'image-top',
                        cells: [...imageTopBuffer]
                    });
                    imageTopBuffer = [];
                }
            } else {
                // Remaining news: title-image-left design, 1 per row
                // Flush any leftover image-top buffer first
                if (imageTopBuffer.length > 0) {
                    mobileRows.push({
                        type: 'image-top',
                        cells: [...imageTopBuffer]
                    });
                    imageTopBuffer = [];
                }
                mobileRows.push({
                    type: 'title-image-left',
                    cells: [{ col, key }]
                });
            }
        });

        // Flush any remaining image-top buffer
        if (imageTopBuffer.length > 0) {
            mobileRows.push({
                type: 'image-top',
                cells: [...imageTopBuffer]
            });
        }
    }


    // Section header (shared between desktop and mobile)
    const sectionHeader = section.name && !section.name.startsWith('Section') && (
        <div className="section-header mb-3">
            <div className="text-center">
                {(() => {
                    const trimmedName = section.name?.trim();
                    const resolvedSlug = section.menuSlug || menus.find(m =>
                        m.name?.trim().toLowerCase() === trimmedName?.toLowerCase()
                    )?.path;

                    const targetTo = resolvedSlug ? (resolvedSlug.startsWith('/') ? resolvedSlug : `/${resolvedSlug}`) : '#';

                    if (targetTo === '#' && menus.length > 0) {
                        console.warn(`⚠️ GridSection: Could not resolve slug for section "${section.name}".`, {
                            menuSlug: section.menuSlug,
                            availableMenus: menus.map(m => m.name)
                        });
                    }

                    return (
                        <Link
                            href={targetTo}
                            className="text-decoration-none section-title-with-lines"
                            onClick={(e) => {
                                if (targetTo === '#') e.preventDefault();
                            }}
                            style={{ position: 'relative', zIndex: 5 }}
                        >
                            <h2 className="title-text font-bangla">{section.name}</h2>
                        </Link>
                    );
                })()}
            </div>
        </div>
    );

    return (
        <section className="py-3 section-wrapper">
            <Container>
                {sectionHeader}

                {/* ═══ DESKTOP LAYOUT (md and above) ═══ */}
                <div
                    className="grid-section d-none d-md-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: gridTemplateColumns,
                        gridTemplateRows: `repeat(${sortedRows.length}, minmax(0, auto))`,
                        gap: '20px',
                        alignItems: 'stretch',
                    }}
                >
                    {gridCells.map(({ col, gridRow, gridColumn, key, rowIndex }, index) => {
                        const colStart = parseInt(gridColumn.split(' / ')[0]);
                        const colSpan = parseInt(gridColumn.split('span ')[1] || 1);
                        const isLastCol = (colStart - 1 + colSpan) >= totalCols;

                        const rowStart = parseInt(gridRow.split(' / ')[0]);
                        const rowSpan = parseInt(gridRow.split('span ')[1] || 1);
                        const isLastRow = (rowStart - 1 + rowSpan) >= sortedRows.length;

                        return (
                            <div
                                key={key}
                                className="news-grid-item"
                                style={{
                                    gridRow,
                                    gridColumn,
                                    minHeight: '0',
                                    minWidth: '0',
                                    height: '100%',
                                    position: 'relative'
                                }}
                            >
                                <GridCell cell={col} isPriority={rowIndex === 0} />

                                {/* Vertical Separator Line */}
                                {!isLastCol && (
                                    <div 
                                        className="grid-separator-v"
                                        style={{
                                            position: 'absolute',
                                            right: '-10px',
                                            top: '20px',
                                            bottom: '20px',
                                            width: '1px',
                                            backgroundColor: '#e5e5e5',
                                            zIndex: 1
                                        }} 
                                    />
                                )}

                                {/* Horizontal Separator Line */}
                                {!isLastRow && (
                                    <div 
                                        className="grid-separator-h"
                                        style={{
                                            position: 'absolute',
                                            bottom: '-1px',
                                            left: '5px',
                                            right: isLastCol ? '5px' : '-5px',
                                            height: '1px',
                                            backgroundColor: '#e5e5e5',
                                            zIndex: 1
                                        }} 
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* ═══ MOBILE LAYOUT (below md) ═══ */}
                <div className="d-md-none mobile-section-layout">
                    {/* 1. Lead content: Merged cells OR first news item */}
                    {mergedCells.map(({ col, key }) => (
                        <div key={`mobile-merged-${key}`} className="mb-3 mobile-lead-news">
                            <GridCell 
                                cell={{ ...col, design: isPhotoSection ? 'text-inside-image' : (col.design === 'text-inside-image' ? 'text-inside-image' : 'image-top') }} 
                                isPriority={false} 
                            />
                        </div>
                    ))}

                    {leadNews && (
                        <div key={`mobile-lead-${leadNews.key}`} className="mb-3 mobile-lead-news">
                            <GridCell 
                                cell={{ ...leadNews.col, design: isPhotoSection ? 'text-inside-image' : (leadNews.col.design === 'text-inside-image' ? 'text-inside-image' : 'image-top') }} 
                                isPriority={false} 
                            />
                        </div>
                    )}

                    {/* 2. All Ads for this section */}
                    {ads.map(({ col, key }) => (
                        <div key={`mobile-ad-${key}`} className="mb-3">
                            <GridCell cell={col} isPriority={false} />
                        </div>
                    ))}

                    {/* 3. Remaining cells: first 4 as image-top (2 per row), rest as title-image-left */}
                    {mobileRows.map((row, rowIdx) => {
                        if (row.type === 'photo-single') {
                            return (
                                <div key={`mobile-row-${rowIdx}`} className="mb-3">
                                    {row.cells.map(({ col, key }) => (
                                        <GridCell key={`mobile-ps-${key}`} cell={{ ...col, design: 'text-inside-image', rowSpan: 1, colSpan: 1 }} isPriority={false} />
                                    ))}
                                </div>
                            );
                        }
                        if (row.type === 'photo-double') {
                            return (
                                <div key={`mobile-row-${rowIdx}`} className="row g-2 mb-3">
                                    {row.cells.map(({ col, key }) => (
                                        <div key={`mobile-pd-${key}`} className="col-6">
                                            <GridCell 
                                                cell={{ ...col, design: 'text-inside-image', rowSpan: 1, colSpan: 1 }} 
                                                isPriority={false} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                        if (row.type === 'text-inside-image') {
                            return (
                                <div key={`mobile-row-${rowIdx}`} className="mb-3">
                                    {row.cells.map(({ col, key }) => (
                                        <GridCell key={`mobile-tii-${key}`} cell={{ ...col, rowSpan: 1, colSpan: 1 }} isPriority={false} />
                                    ))}
                                </div>
                            );
                        }
                        if (row.type === 'title-image-left') {
                            return (
                                <div key={`mobile-row-${rowIdx}`} className="mb-3 mobile-row-title-image-left">
                                    {row.cells.map(({ col, key }) => (
                                        <GridCell 
                                            key={`mobile-til-${key}`} 
                                            cell={{ ...col, design: col.design === 'text-inside-image' ? 'text-inside-image' : 'title-image-left', rowSpan: 1, colSpan: 1 }} 
                                            isPriority={false} 
                                        />
                                    ))}
                                </div>
                            );
                        }
                        // image-top: 2-column layout
                        return (
                            <div key={`mobile-row-${rowIdx}`} className="row g-2 mb-3 mobile-row-image-top">
                                {row.cells.map(({ col, key }) => (
                                    <div key={`mobile-it-${key}`} className="col-6">
                                        <GridCell 
                                            cell={{ ...col, design: col.design === 'text-inside-image' ? 'text-inside-image' : 'image-top', rowSpan: 1, colSpan: 1 }} 
                                            isPriority={false} 
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
};

export default GridSection;
