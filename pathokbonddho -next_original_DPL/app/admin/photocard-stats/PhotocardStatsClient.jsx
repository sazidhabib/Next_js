'use client';

import React from 'react';
import { Card, Table, Row, Col, Spinner, Button } from 'react-bootstrap';
import useSWR, { mutate } from 'swr';
import { fetcher } from "@/app/lib/swr-config";
import { toast } from 'react-toastify';

export default function PhotocardStatsClient({ initialStats, isAdmin }) {
    const swrKey = isAdmin ? '/photocards/stats' : null;
    
    const { data: stats, isLoading } = useSWR(swrKey, fetcher, {
        fallbackData: initialStats,
        keepPreviousData: true
    });

    if (!isAdmin) {
        return <div className="p-4 text-center"><h4>Access Denied</h4></div>;
    }

    const totalDownloads = stats?.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0) || 0;
    const totalShares = stats?.reduce((acc, curr) => acc + (curr.shareCount || 0), 0) || 0;
    
    // Find top card
    let topCardName = 'None';
    let maxDownloads = -1;
    if (stats && stats.length > 0) {
        stats.forEach(item => {
            if ((item.downloadCount || 0) > maxDownloads) {
                maxDownloads = item.downloadCount;
                topCardName = item.name;
            }
        });
    }

    const handleRefresh = () => {
        mutate(swrKey);
        toast.info("Stats refreshed");
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Photocard Download Statistics</h4>
                <Button variant="outline-primary" onClick={handleRefresh} disabled={isLoading}>
                    {isLoading ? <Spinner size="sm" animation="border" /> : <i className="fas fa-sync-alt me-1"></i>} Refresh Stats
                </Button>
            </div>

            {/* Stat Cards */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 bg-primary text-white mb-3">
                        <Card.Body>
                            <Card.Title>Total Downloads</Card.Title>
                            <h2>{totalDownloads}</h2>
                            <small>Overall photocard files saved by readers</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 bg-success text-white mb-3">
                        <Card.Body>
                            <Card.Title>Total Shares</Card.Title>
                            <h2>{totalShares}</h2>
                            <small>Photocards shared to Facebook</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 bg-info text-white mb-3">
                        <Card.Body>
                            <Card.Title>Top Performing</Card.Title>
                            <h2 style={{ fontSize: '1.4rem', margin: '8px 0' }}>{topCardName}</h2>
                            <small>{maxDownloads >= 0 ? `${maxDownloads} downloads` : 'No data'}</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Data Table */}
            <Card className="shadow-sm">
                <Card.Body>
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>Photocard Name</th>
                                    <th>Identifier (Slug)</th>
                                    <th className="text-center">Download Count</th>
                                    <th className="text-center">Share Count</th>
                                    <th>Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && !stats ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <Spinner animation="border" />
                                        </td>
                                    </tr>
                                ) : stats && stats.length > 0 ? (
                                    stats.map(item => (
                                        <tr key={item.id}>
                                            <td><strong>{item.name}</strong></td>
                                            <td><code>{item.type}</code></td>
                                            <td className="text-center fw-bold text-primary">{item.downloadCount || 0}</td>
                                            <td className="text-center fw-bold text-success">{item.shareCount || 0}</td>
                                            <td>{new Date(item.updatedAt).toLocaleString('en-US')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No statistics records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
