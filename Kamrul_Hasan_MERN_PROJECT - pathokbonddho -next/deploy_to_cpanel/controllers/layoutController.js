const { Page, PageSection, Row, Column } = require("../models");

exports.createPage = async (req, res) => {
    try {
        const { name, sections, autoNewsSelection } = req.body;

        console.log("📝 Creating page with data:", JSON.stringify({ name, sections, autoNewsSelection }, null, 2));

        const page = await Page.create(
            {
                name,
                autoNewsSelection: autoNewsSelection || false,
                PageSections: sections.map((section) => ({
                    name: section.name,
                    menuSlug: section.menuSlug,
                    layoutType: section.layoutType,
                    autoNewsSelection: section.autoNewsSelection || false,
                    Rows: section.rows.map((row) => ({
                        rowOrder: row.rowOrder,
                        Columns: row.columns,
                    })),
                })),
            },
            {
                include: [
                    {
                        model: PageSection,
                        include: [{ model: Row, include: [Column] }],
                    },
                ],
            }
        );

        res.status(201).json(page);
    } catch (err) {
        console.error("❌ Create page error:", err);
        console.error("❌ Error details:", err.message);
        console.error("❌ Stack trace:", err.stack);
        res.status(500).json({
            error: err.message,
            details: err.errors ? err.errors.map(e => e.message) : null
        });
    }
};

exports.getPageLayout = async (req, res) => {
    try {
        const { pageId } = req.params;

        const page = await Page.findByPk(pageId, {
            include: [
                {
                    model: PageSection,
                    include: [
                        {
                            model: Row,
                            include: [Column]
                        }
                    ]
                }
            ],
            order: [
                [PageSection, 'id', 'ASC'],
                [PageSection, Row, 'rowOrder', 'ASC'],
                [PageSection, Row, Column, 'colOrder', 'ASC']
            ]
        });

        if (!page) return res.status(404).json({ message: "Page not found" });
        res.json(page);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePageLayout = async (req, res) => {
    try {
        const { pageId } = req.params;
        const { name, PageSections, autoNewsSelection } = req.body;

        console.log("🔄 Update request received:", {
            pageId,
            name,
            autoNewsSelection,
            PageSectionsCount: PageSections?.length,
            PageSections: PageSections // Log the actual sections data
        });

        // Find the page
        const page = await Page.findByPk(pageId);
        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        // Update page fields
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (autoNewsSelection !== undefined) updateData.autoNewsSelection = autoNewsSelection;

        if (Object.keys(updateData).length > 0) {
            await page.update(updateData);
        }

        // If PageSections are provided, update them
        if (PageSections && Array.isArray(PageSections)) {
            console.log(`🗑️ Removing existing sections for page ${pageId}`);

            // First, remove existing sections and their children (cascade delete)
            await PageSection.destroy({ where: { pageId } });

            console.log(`✅ Existing sections removed. Creating ${PageSections.length} new sections`);

            // Create new sections with proper structure
            for (const [index, sectionData] of PageSections.entries()) {
                console.log(`📦 Creating section ${index + 1}:`, {
                    name: sectionData.name,
                    menuSlug: sectionData.menuSlug,
                    layoutType: sectionData.layoutType,
                    autoNewsSelection: sectionData.autoNewsSelection,
                    rowsCount: sectionData.rows?.length,
                    columnsCount: sectionData.rows?.[0]?.columns?.length
                });

                // Ensure we have at least one row with columns
                const rows = sectionData.rows && sectionData.rows.length > 0
                    ? sectionData.rows
                    : [{
                        rowOrder: 1,
                        columns: [{
                            colOrder: 1,
                            width: 12,
                            contentType: 'text',
                            tag: 'default'
                        }]
                    }];

                await PageSection.create({
                    name: sectionData.name || null,
                    menuSlug: sectionData.menuSlug || null,
                    layoutType: sectionData.layoutType || 'grid',
                    autoNewsSelection: sectionData.autoNewsSelection || false,
                    pageId: page.id,
                    Rows: rows.map((row, rowIndex) => ({
                        rowOrder: row.rowOrder || index + 1,
                        Columns: (row.columns || []).map((column, colIndex) => {
                            // Debug log for tag
                            if (column.tag) {
                                console.log(`📌 Saving Column [${rowIndex},${colIndex}] Tag: "${column.tag}"`);
                            }

                            return {
                                colOrder: column.colOrder || colIndex + 1,
                                width: column.width || 12,
                                contentType: column.contentType || 'text',
                                tag: column.tag || `col-${colIndex + 1}`,
                                design: column.design || null,
                                contentId: column.contentId || null,
                                contentTitle: column.contentTitle || null,
                                merged: column.merged || false,
                                masterCell: column.masterCell || false,
                                rowSpan: column.rowSpan || 1,
                                colSpan: column.colSpan || 1,
                                masterCellKey: column.masterCellKey || null,
                                mergedCells: column.mergedCells || null,
                            };
                        })
                    }))
                }, {
                    include: [{
                        model: Row,
                        include: [Column]
                    }]
                });
            }
        }

        // Return the updated page with all associations
        const updatedPage = await Page.findByPk(pageId, {
            include: [
                {
                    model: PageSection,
                    include: [
                        {
                            model: Row,
                            include: [Column]
                        }
                    ]
                }
            ],
            order: [
                [PageSection, 'id', 'ASC'],
                [PageSection, Row, 'rowOrder', 'ASC'],
                [PageSection, Row, Column, 'colOrder', 'ASC']
            ]
        });

        console.log(`✅ Update completed. Returning page with ${updatedPage.PageSections?.length} sections`);
        if (updatedPage.PageSections) {
            updatedPage.PageSections.forEach((section, idx) => {
                console.log(`Section ${idx + 1}: ${section.Rows?.[0]?.Columns?.length || 0} columns`);
            });
        }

        res.json(updatedPage);
    } catch (err) {
        console.error("❌ Update page error:", err);
        console.error("❌ Error details:", err.message);
        console.error("❌ Stack trace:", err.stack);
        res.status(500).json({
            error: err.message,
            details: err.errors ? err.errors.map(e => e.message) : null
        });
    }
};

exports.deletePage = async (req, res) => {
    try {
        const { pageId } = req.params;
        const deleted = await Page.destroy({ where: { id: pageId } });

        if (!deleted) return res.status(404).json({ message: "Page not found" });
        res.json({ message: "Page deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllPages = async (req, res) => {
    try {
        const pages = await Page.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']]
        });
        res.json(pages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};