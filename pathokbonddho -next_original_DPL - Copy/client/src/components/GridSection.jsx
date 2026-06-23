import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMenu } from '../store/MenuContext';
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
                gridRow: `${rowIndex + 1} / span ${rowSpan}`,
                gridColumn: `${colIndex + 1} / span ${colSpan}`,
                key: col.id || cellKey
            });
        });
    });

    // Calculate column template: use the width values from first row if available
    const firstRowCols = (firstRow.Columns || firstRow.columns || []).sort((a, b) => a.colOrder - b.colOrder);
    const gridTemplateColumns = firstRowCols.map(col => `${col.width || 1}fr`).join(' ');

    // ─── Mobile layout: categorize cells ───
    const mergedCells = [];
    const adCells = [];
    const remainingNewsCells = [];

    gridCells.forEach(({ col, gridRow, gridColumn, key }) => {
        const rowSpan = parseInt(gridRow.split('span ')[1] || 1);
        const colSpan = parseInt(gridColumn.split('span ')[1] || 1);
        const isMerged = rowSpan > 1 || colSpan > 1;

        if (isMerged) {
            mergedCells.push({ col, key });
        } else if (col.contentType === 'ad') {
            adCells.push({ col, key });
        } else if (col.contentType === 'news') {
            remainingNewsCells.push({ col, key });
        }
    });

    // Build alternating rows for mobile: odd=title-image-left (1 item full-width), even=image-top (2 items)
    const mobileRemainingRows = [];
    let cellIdx = 0;
    let rowType = 'title-image-left'; // start with this

    while (cellIdx < remainingNewsCells.length) {
        if (rowType === 'title-image-left') {
            mobileRemainingRows.push({
                type: 'title-image-left',
                cells: [remainingNewsCells[cellIdx]]
            });
            cellIdx++;
            rowType = 'image-top';
        } else {
            const rowCells = [remainingNewsCells[cellIdx]];
            if (cellIdx + 1 < remainingNewsCells.length) {
                rowCells.push(remainingNewsCells[cellIdx + 1]);
                cellIdx += 2;
            } else {
                cellIdx++;
            }
            mobileRemainingRows.push({
                type: 'image-top',
                cells: rowCells
            });
            rowType = 'title-image-left';
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

                    if (targetTo === '#') {
                        console.warn(`⚠️ GridSection: Could not resolve slug for section "${section.name}".`, {
                            menuSlug: section.menuSlug,
                            availableMenus: menus.map(m => m.name)
                        });
                    }

                    return (
                        <Link
                            to={targetTo}
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
                        gridTemplateRows: `repeat(${sortedRows.length}, auto)`,
                        gap: '20px',
                    }}
                >
                    {gridCells.map(({ col, gridRow, gridColumn, key }, index) => {
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
                                    position: 'relative'
                                }}
                            >
                                <GridCell cell={col} />

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
                    {/* 1. Merged cells first (image-top, full width) */}
                    {mergedCells.map(({ col, key }) => (
                        <div key={`mobile-merged-${key}`} className="mb-3">
                            <GridCell cell={{ ...col, design: 'image-top' }} />
                        </div>
                    ))}

                    {/* 2. Ad cells (full width) */}
                    {adCells.map(({ col, key }) => (
                        <div key={`mobile-ad-${key}`} className="mb-3">
                            <GridCell cell={col} />
                        </div>
                    ))}

                    {/* 3. Remaining news in alternating rows */}
                    {mobileRemainingRows.map((row, rowIdx) => {
                        if (row.type === 'title-image-left') {
                            // Full-width, title & image left design
                            return (
                                <div key={`mobile-row-${rowIdx}`} className="mb-3 mobile-row-title-image-left">
                                    {row.cells.map(({ col, key }) => (
                                        <GridCell key={`mobile-til-${key}`} cell={{ ...col, design: 'title-image-left' }} />
                                    ))}
                                </div>
                            );
                        } else {
                            // 2-column, image-top design
                            return (
                                <div key={`mobile-row-${rowIdx}`} className="row g-2 mb-3 mobile-row-image-top">
                                    {row.cells.map(({ col, key }) => (
                                        <div key={`mobile-it-${key}`} className="col-6">
                                            <GridCell cell={{ ...col, design: 'image-top' }} />
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                    })}
                </div>
            </Container>
        </section>
    );
};

export default GridSection;
