import { NextResponse } from 'next/server';
import { Page, PageSection, Row, Column } from '@/lib/models/index';

export async function GET(req, { params }) {
    try {
        const { id: pageId } = await params;

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

        if (!page) return NextResponse.json({ message: "Page not found" }, { status: 404 });
        return NextResponse.json(page, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id: pageId } = await params;
        const body = await req.json();
        const { name, PageSections, autoNewsSelection } = body;

        const page = await Page.findByPk(pageId);
        if (!page) {
            return NextResponse.json({ message: "Page not found" }, { status: 404 });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (autoNewsSelection !== undefined) updateData.autoNewsSelection = autoNewsSelection;

        if (Object.keys(updateData).length > 0) {
            await page.update(updateData);
        }

        if (PageSections && Array.isArray(PageSections)) {
            await PageSection.destroy({ where: { pageId } });

            for (const [index, sectionData] of PageSections.entries()) {
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
                        Columns: (row.columns || []).map((column, colIndex) => ({
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
                        }))
                    }))
                }, {
                    include: [{
                        model: Row,
                        include: [Column]
                    }]
                });
            }
        }

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

        return NextResponse.json(updatedPage, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            error: err.message,
            details: err.errors ? err.errors.map(e => e.message) : null
        }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id: pageId } = await params;
        const deleted = await Page.destroy({ where: { id: pageId } });

        if (!deleted) return NextResponse.json({ message: "Page not found" }, { status: 404 });
        return NextResponse.json({ message: "Page deleted successfully" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
