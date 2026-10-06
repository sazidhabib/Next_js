import api from '@/app/lib/api';

/**
 * Normalizes layout data from backend (handling capitalized vs lowercase variations)
 */
export const normalizeLayout = (rawLayout) => {
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

/**
 * Extracts ordered editorial slots from Section 1 (excluding ads and slave merged cells)
 */
export const extractSection1EditorialSlots = (layout) => {
    if (!layout?.PageSections || layout.PageSections.length === 0) {
        return [];
    }

    const sec1 = layout.PageSections[0];
    const rows = [...(sec1.rows || [])].sort((a, b) => (a.rowOrder || 0) - (b.rowOrder || 0));

    let masterMergedCell = null;
    const regularCells = [];

    rows.forEach((row, rIdx) => {
        const cols = [...(row.columns || [])].sort((a, b) => (a.colOrder || 0) - (b.colOrder || 0));
        cols.forEach((col, cIdx) => {
            // Exclude ads
            if (col.contentType === 'ad' || col.contentType === 'ads') {
                return;
            }

            // Exclude slave merged cells
            if (col.merged && !col.masterCell) {
                return;
            }

            const isMaster = col.masterCell || (col.merged && col.masterCell) || (col.rowSpan > 1 || col.colSpan > 1);

            const slotInfo = {
                sIdx: 0,
                rIdx,
                cIdx,
                colOrder: col.colOrder || cIdx + 1,
                rowOrder: row.rowOrder || rIdx + 1,
                colSpan: col.colSpan || 1,
                rowSpan: col.rowSpan || 1,
                design: col.design || 'Default Design',
                isMasterCell: !!isMaster,
                contentId: col.contentId ? String(col.contentId) : null,
                contentTitle: col.contentTitle || null,
                contentType: col.contentType || 'news',
                tag: col.tag || '',
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

    // Master cell is Position #1 LEAD
    if (masterMergedCell) {
        ordered.push({
            ...masterMergedCell,
            position: positionCounter++,
            isLead: true
        });
    }

    // Remaining slots sequential 2..N
    regularCells.forEach(slot => {
        ordered.push({
            ...slot,
            position: positionCounter++,
            isLead: false
        });
    });

    return ordered;
};

/**
 * Fetches the current Homepage Section 1 details and its available editorial slots
 */
export const fetchHomepageSection1Info = async () => {
    try {
        const listRes = await api.get('/layout');
        const allPages = listRes.data.data || listRes.data || [];
        const homePage = (Array.isArray(allPages) && allPages.find(p => p.name?.toLowerCase() === 'home')) ||
            (Array.isArray(allPages) && allPages[0]) || null;

        if (!homePage) {
            return { homeLayout: null, editorialSlots: [] };
        }

        const detailRes = await api.get(`/layout/${homePage.id}`);
        const data = detailRes.data.data || detailRes.data;
        const normalized = normalizeLayout(data);
        const slots = extractSection1EditorialSlots(normalized);

        return {
            homeLayout: normalized,
            editorialSlots: slots
        };
    } catch (err) {
        console.error("Failed to fetch Homepage Section 1 info:", err);
        return { homeLayout: null, editorialSlots: [] };
    }
};

/**
 * Assigns or updates a content item into Homepage Section 1 using Shift/Insert
 */
export const assignContentToHomepageSection1 = async ({ contentId, contentTitle, contentType = 'news', targetPosition }) => {
    try {
        const { homeLayout, editorialSlots } = await fetchHomepageSection1Info();
        if (!homeLayout || !homeLayout.id || editorialSlots.length === 0) {
            return false;
        }

        const targetPosNumber = targetPosition && targetPosition !== 'none' ? parseInt(targetPosition, 10) : null;
        const stringId = contentId ? String(contentId) : null;

        if (!stringId) return false;

        // Current contents in Section 1 slots
        const currentContents = editorialSlots.map(s => ({
            contentId: s.contentId,
            contentTitle: s.contentTitle,
            contentType: s.contentType,
            tag: s.tag
        }));

        let changed = false;

        if (targetPosNumber && targetPosNumber >= 1 && targetPosNumber <= editorialSlots.length) {
            const targetIdx = targetPosNumber - 1;

            // Remove if already existing in any slot
            const existingIdx = currentContents.findIndex(c => c.contentId && String(c.contentId) === stringId);
            if (existingIdx !== -1) {
                currentContents.splice(existingIdx, 1);
            }

            // Insert at target index (Shift/Insert)
            const newPayload = {
                contentId: stringId,
                contentTitle: contentTitle || '',
                contentType: contentType || 'news',
                tag: ''
            };
            currentContents.splice(targetIdx, 0, newPayload);

            // Keep array exact slot size
            while (currentContents.length > editorialSlots.length) {
                currentContents.pop();
            }

            changed = true;
        } else if (targetPosition === 'none' || !targetPosition) {
            // Check if it was previously in Section 1 and remove it
            const existingIdx = currentContents.findIndex(c => c.contentId && String(c.contentId) === stringId);
            if (existingIdx !== -1) {
                currentContents[existingIdx] = {
                    contentId: null,
                    contentTitle: null,
                    contentType: 'text',
                    tag: ''
                };
                changed = true;
            }
        }

        if (!changed) return true;

        // Reassign back to layout PageSections[0]
        const cleanPayload = {
            name: homeLayout.name,
            autoNewsSelection: homeLayout.autoNewsSelection || false,
            PageSections: (homeLayout.PageSections || []).map((section, sIdx) => {
                if (sIdx !== 0) {
                    return {
                        name: section.name || null,
                        menuSlug: section.menuSlug || null,
                        layoutType: section.layoutType || 'grid',
                        autoNewsSelection: section.autoNewsSelection || false,
                        rows: (section.rows || []).map((row, rIdx) => ({
                            rowOrder: row.rowOrder || rIdx + 1,
                            columns: (row.columns || []).map((col, cIdx) => ({
                                colOrder: col.colOrder || cIdx + 1,
                                width: col.width || 4,
                                contentType: col.contentType || 'text',
                                tag: col.tag || '',
                                design: col.design || null,
                                contentId: col.contentId ? String(col.contentId) : null,
                                contentTitle: col.contentTitle || null,
                                merged: col.merged || false,
                                masterCell: col.masterCell || false,
                                rowSpan: col.rowSpan || 1,
                                colSpan: col.colSpan || 1,
                                masterCellKey: col.masterCellKey || null,
                                mergedCells: col.mergedCells || null
                            }))
                        }))
                    };
                }

                // Section 0
                return {
                    name: section.name || null,
                    menuSlug: section.menuSlug || null,
                    layoutType: section.layoutType || 'grid',
                    autoNewsSelection: section.autoNewsSelection || false,
                    rows: (section.rows || []).map((row, rIdx) => ({
                        rowOrder: row.rowOrder || rIdx + 1,
                        columns: (row.columns || []).map((col, cIdx) => {
                            // Find if this is an editorial slot
                            const slotIdx = editorialSlots.findIndex(s => s.rIdx === rIdx && s.cIdx === cIdx);
                            let newContentId = col.contentId ? String(col.contentId) : null;
                            let newContentTitle = col.contentTitle || null;
                            let newContentType = col.contentType || 'text';
                            let newTag = col.tag || '';

                            if (slotIdx !== -1 && currentContents[slotIdx]) {
                                newContentId = currentContents[slotIdx].contentId ? String(currentContents[slotIdx].contentId) : null;
                                newContentTitle = currentContents[slotIdx].contentTitle || null;
                                newContentType = currentContents[slotIdx].contentType || col.contentType || 'text';
                                newTag = currentContents[slotIdx].tag || '';
                            }

                            if (col.merged && !col.masterCell) {
                                newContentId = null;
                                newContentTitle = null;
                            }

                            return {
                                colOrder: col.colOrder || cIdx + 1,
                                width: col.width || 4,
                                contentType: newContentType,
                                tag: newTag,
                                design: col.design || null,
                                contentId: newContentId,
                                contentTitle: newContentTitle,
                                merged: col.merged || false,
                                masterCell: col.masterCell || false,
                                rowSpan: col.rowSpan || 1,
                                colSpan: col.colSpan || 1,
                                masterCellKey: col.masterCellKey || null,
                                mergedCells: col.mergedCells || null
                            };
                        })
                    }))
                };
            })
        };

        await api.patch(`/layout/${homeLayout.id}`, cleanPayload);
        return true;
    } catch (err) {
        console.error("Failed to sync homepage section 1 lead position:", err);
        return false;
    }
};
