'use client';

import React, { useEffect, useState } from 'react';
import { Card, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { fetchHomepageSection1Info } from '@/app/lib/homepageSection1Sync';

export default function HomepageLeadPositionSelector({
    value,
    onChange,
    currentContentId = null,
    currentContentType = 'news'
}) {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const loadSlots = async () => {
            setLoading(true);
            try {
                const { editorialSlots } = await fetchHomepageSection1Info();
                if (isMounted) {
                    setSlots(editorialSlots || []);
                    
                    // If editing and no value explicitly selected yet, check if this content is already placed in a slot
                    if (currentContentId && (value === undefined || value === null)) {
                        const existingSlot = (editorialSlots || []).find(
                            s => s.contentId && String(s.contentId) === String(currentContentId)
                        );
                        if (existingSlot) {
                            onChange(String(existingSlot.position));
                        }
                    }
                }
            } catch (err) {
                if (isMounted) setError("Failed to load Section 1 positions");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadSlots();
        return () => { isMounted = false; };
    }, [currentContentId]);

    const selectedSlot = slots.find(s => String(s.position) === String(value));

    return (
        <Card className="shadow-sm border-0 mb-4 bg-white">
            <Card.Header className="bg-light py-2 px-3 d-flex justify-content-between align-items-center border-bottom">
                <div className="fw-bold small text-dark d-flex align-items-center gap-2">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>Homepage Lead Position</span>
                </div>
                {slots.length > 0 && (
                    <Badge bg="primary" className="fw-normal" style={{ fontSize: '0.7rem' }}>
                        {slots.length} Section 1 Slots
                    </Badge>
                )}
            </Card.Header>
            <Card.Body className="p-3">
                {loading ? (
                    <div className="d-flex align-items-center text-muted small py-2">
                        <Spinner animation="border" size="sm" className="me-2" />
                        <span>Loading Homepage Section 1 slots...</span>
                    </div>
                ) : error ? (
                    <small className="text-danger d-block">{error}</small>
                ) : slots.length === 0 ? (
                    <small className="text-muted d-block">
                        No editorial slots found in Homepage Section 1.
                    </small>
                ) : (
                    <div>
                        <Form.Group className="mb-2">
                            <Form.Label className="small text-muted fw-semibold mb-1">
                                Choose Position in Homepage Section 1:
                            </Form.Label>
                            <Form.Select
                                value={value || 'none'}
                                onChange={(e) => onChange(e.target.value)}
                                className="shadow-none form-select-sm"
                                style={{ fontSize: '0.85rem' }}
                            >
                                <option value="none">
                                    -- None (Standard Category / Flow Listing) --
                                </option>
                                {slots.map((slot) => {
                                    const isCurrentItemHere = currentContentId && slot.contentId && String(slot.contentId) === String(currentContentId);
                                    let label = slot.isLead 
                                        ? `#1 LEAD (Master Merged Cell)` 
                                        : `#${slot.position} (Row ${slot.rowOrder}, Col ${slot.colOrder} - ${slot.design})`;
                                    
                                    if (isCurrentItemHere) {
                                        label += ` [CURRENT POSITION]`;
                                    } else if (slot.contentTitle) {
                                        label += ` • Currently: "${slot.contentTitle.substring(0, 28)}..."`;
                                    }

                                    return (
                                        <option key={slot.position} value={String(slot.position)}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>

                        {/* Selected Slot Information preview */}
                        {selectedSlot ? (
                            <div className="p-2 bg-light rounded border mt-2 small">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="fw-bold text-dark">
                                        {selectedSlot.isLead ? '⭐ Section 1 Lead Position' : `Slot Position #${selectedSlot.position}`}
                                    </span>
                                    <Badge bg="secondary" style={{ fontSize: '0.68rem' }}>
                                        Row {selectedSlot.rowOrder}, Col {selectedSlot.colOrder}
                                    </Badge>
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                    <div>🎨 Template: <strong>{selectedSlot.design}</strong></div>
                                    <div className="text-primary mt-1">
                                        <i className="fas fa-info-circle me-1"></i>
                                        Saving will place this item at <strong>#{selectedSlot.position}</strong> and shift lower items down.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <small className="text-muted d-block" style={{ fontSize: '0.74rem' }}>
                                Not assigned to Homepage Section 1. News will display according to its category and publish date.
                            </small>
                        )}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
