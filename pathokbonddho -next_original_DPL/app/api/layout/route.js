import { NextResponse } from 'next/server';
import { Page, PageSection, Row, Column } from '@/lib/models/index';

export async function GET(req) {
    try {
        const pages = await Page.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']]
        });
        return NextResponse.json(pages, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, sections, autoNewsSelection } = body;

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

        return NextResponse.json(page, { status: 201 });
    } catch (err) {
        return NextResponse.json({
            error: err.message,
            details: err.errors ? err.errors.map(e => e.message) : null
        }, { status: 500 });
    }
}
