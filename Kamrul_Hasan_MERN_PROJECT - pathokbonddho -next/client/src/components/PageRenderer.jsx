import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Spinner, Alert } from 'react-bootstrap';
import GridSection from './GridSection';
import LoadMoreNews from './LoadMoreNews';

const PageRenderer = ({ pageId, slug }) => {
    const [pageLayout, setPageLayout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchLayout = async () => {
            try {
                setLoading(true);
                let targetPageId = pageId;

                // Resolve ID if not provided, using slug or defaulting to Home
                if (!targetPageId) {
                    // 1. Fetch all pages list
                    const listResponse = await axios.get(`${API_BASE_URL}/api/layout`);
                    const allPages = listResponse.data;

                    if (Array.isArray(allPages) && allPages.length > 0) {
                        let matchPage = null;

                        // 2. Try to find page by slug (as name)
                        if (slug) {
                            matchPage = allPages.find(p => p.name.toLowerCase() === slug.toLowerCase());
                        }

                        // 3. Fallback to "Home" if no match found yet
                        if (!matchPage) {
                            matchPage = allPages.find(p => p.name.toLowerCase() === 'home');
                        }

                        // 4. Fallback to first available page if still no match
                        if (!matchPage) {
                            console.warn('No matching page found. Defaulting to first available.');
                            matchPage = allPages[0];
                        }

                        if (matchPage) {
                            targetPageId = matchPage.id;
                        }

                    } else {
                        throw new Error('No pages found in the system. Please create a page in the Admin panel.');
                    }
                }

                // If still no ID, we can't fetch anything
                if (!targetPageId) {
                    throw new Error('Could not resolve a valid Page ID.');
                }

                // 5. Fetch the full layout details
                const response = await axios.get(`${API_BASE_URL}/api/layout/${targetPageId}`);
                const layoutData = response.data;

                if (!layoutData) {
                    throw new Error('Page layout not found');
                }

                setPageLayout(layoutData);
            } catch (err) {
                console.error('Error fetching page layout:', err);
                setError(err.message || 'Failed to load page layout');
            } finally {
                setLoading(false);
            }
        };

        fetchLayout();
    }, [pageId, slug, API_BASE_URL]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <Alert.Heading>Error Loading Content</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">
                        Please ensure you have created a page named "Home" (or matching the requested slug) in the Admin Panel -&gt; Page Layout.
                    </p>
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
        const ids = new Set();
        pageLayout.PageSections.forEach(section => {
            (section.Rows || section.rows || []).forEach(row => {
                (row.Columns || row.columns || []).forEach(col => {
                    if (col.contentType === 'news' && col.contentId) {
                        ids.add(col.contentId);
                    }
                });
            });
        });
        return Array.from(ids);
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
