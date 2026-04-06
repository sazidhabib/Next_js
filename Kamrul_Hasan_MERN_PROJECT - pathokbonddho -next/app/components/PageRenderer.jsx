"use client";
import React, { useState, useEffect } from 'react';
import api from '@/app/lib/api';
import { Container, Spinner, Alert } from 'react-bootstrap';
import GridSection from './GridSection';
import LoadMoreNews from './LoadMoreNews';

const PageRenderer = ({ pageId, slug, initialLayout }) => {
    const [pageLayout, setPageLayout] = useState(initialLayout || null);
    const [loading, setLoading] = useState(!initialLayout);
    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        // If we have initialLayout and it matches the current slug, we can skip the fetch
        if (initialLayout && (!slug || initialLayout.name?.toLowerCase() === slug?.toLowerCase())) {
            setPageLayout(initialLayout);
            setLoading(false);
            return;
        }

        const fetchLayout = async () => {
            try {
                setLoading(true);
                let targetPageId = pageId;

                // Resolve ID if not provided, using slug or defaulting to Home
                if (!targetPageId) {
                    const listResponse = await api.get('/layout');
                    const allPages = listResponse.data.data || listResponse.data || [];

                    if (Array.isArray(allPages) && allPages.length > 0) {
                        const matchPage = (slug && allPages.find(p => p.name.toLowerCase() === slug.toLowerCase())) ||
                                         allPages.find(p => p.name.toLowerCase() === 'home') ||
                                         allPages[0];
                        targetPageId = matchPage?.id;
                    }
                }

                if (!targetPageId) {
                    throw new Error('Could not resolve a valid Page ID.');
                }

                const response = await api.get(`/layout/${targetPageId}`);
                setPageLayout(response.data.data || response.data);
            } catch (err) {
                console.error('Error fetching page layout:', err);
                setError(err.message || 'Failed to load page layout');
            } finally {
                setLoading(false);
            }
        };

        fetchLayout();
    }, [pageId, slug, initialLayout, API_BASE_URL]);

    if (loading && !pageLayout) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error && !pageLayout) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <Alert.Heading>Error Loading Content</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">Please ensure you have created a page named "Home" (or matching the requested slug) in the Admin Panel.</p>
                </Alert>
            </Container>
        );
    }

    if (!pageLayout?.PageSections?.length) {
        return (
            <Container className="py-5 text-center">
                <p className="text-muted">No content configured for this page.</p>
            </Container>
        );
    }

    const getExcludeIds = () => {
        if (!pageLayout?.PageSections) return [];
        return pageLayout.PageSections.flatMap(section => 
            (section.rows || section.Rows || []).flatMap(row => 
                (row.columns || row.Columns || []).filter(col => col.contentType === 'news' && col.contentId).map(col => col.contentId)
            )
        );
    };

    return (
        <div className="page-renderer">
            {pageLayout.PageSections.map((section, index) => (
                <GridSection key={section.id || index} section={section} />
            ))}
            {slug && slug.toLowerCase() !== 'home' && (
                <LoadMoreNews slug={slug} excludeIds={getExcludeIds()} />
            )}
        </div>
    );
};

export default PageRenderer;
