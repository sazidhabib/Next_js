'use client';

import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Tabs, Tab, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from "@/app/lib/api";
import { useSettings } from '@/app/providers/SettingsProvider';

const SettingsClient = ({ isAdmin }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [existingId, setExistingId] = useState(null);
    const { settings: globalSettings, fetchSettings: refreshSettings } = useSettings();
    const [logoPreview, setLogoPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [uploading, setUploading] = useState({ logo: false, favicon: false });

    const [settings, setSettings] = useState({
        siteName: 'Pathokbonddho',
        siteNameBn: 'পাঠকবন্ধু',
        tagline: '',
        logo: '/images/Logo.png',
        favicon: '/favicon.ico',
        footerDescription: 'সত্য, বস্তুনিষ্ঠ ও নিরপেক্ষ সংবাদ পরিবেশনে অঙ্গীকারবদ্ধ। দেশ-বিদেশের সর্বশেষ খবর, রাজনীতি, অর্থনীতি, খেলাধুলা ও বিনোদনের সকল খবর সবার আগে জানতে আমাদের সাথেই থাকুন।',
        contact: {
            email: 'info@pathokbonddho.com',
            phone: '+880 1XXX-XXXXXX',
            address: 'Dhaka, Bangladesh'
        },
        social: {
            facebook: 'https://facebook.com/pathokbonddho',
            twitter: 'https://twitter.com/pathokbonddho',
            instagram: 'https://instagram.com/pathokbonddho',
            linkedin: 'https://linkedin.com/company/pathokbonddho',
            youtube: 'https://youtube.com/pathokbonddho'
        },
        seo: {
            description: 'Latest news and updates from Pathokbonddho.',
            keywords: 'news, bangladesh, pathokbonddho'
        }
    });

    const handleFileUpload = async (file, fileType) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType);

        console.log(`Uploading ${fileType}:`, file.name, file.size, file.type);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log(`Upload response for ${fileType}:`, data);

            if (!response.ok) {
                console.error(`Upload failed for ${fileType}:`, data.error);
                toast.error(`Upload failed: ${data.error}`);
                return null;
            }

            if (!data.path) {
                console.error(`No path returned from upload:`, data);
                toast.error('Upload succeeded but no file path returned');
                return null;
            }

            console.log(`${fileType} uploaded successfully to:`, data.path);
            return data.path;
        } catch (error) {
            console.error(`Upload error for ${fileType}:`, error);
            toast.error('Failed to upload file');
            return null;
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/designs', { params: { search: 'site-settings' } });
                const designs = res.data.designs || res.data || [];
                const siteSettings = designs.find(d => d.slug === 'site-settings');

                if (siteSettings) {
                    setExistingId(siteSettings.id);
                    const data = typeof siteSettings.design_data === 'string'
                        ? JSON.parse(siteSettings.design_data)
                        : siteSettings.design_data;

                    // Merge with defaults to ensure all fields exist
                    setSettings(prev => ({
                        ...prev,
                        ...data,
                        contact: { ...prev.contact, ...(data.contact || {}) },
                        social: { ...prev.social, ...(data.social || {}) },
                        seo: { ...prev.seo, ...(data.seo || {}) }
                    }));
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) fetchSettings();
    }, [isAdmin]);

    const handleChange = (section, field, value) => {
        if (section) {
            setSettings(prev => ({
                ...prev,
                [section]: { ...prev[section], [field]: value }
            }));
        } else {
            setSettings(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        console.log('Saving settings...', settings);

        const payload = {
            design_name: 'Site Settings',
            slug: 'site-settings',
            design_status: true,
            description: 'Core website configuration managed via Settings panel',
            design_data: settings
        };

        try {
            console.log('Sending payload:', payload);
            if (existingId) {
                await api.patch(`/designs/${existingId}`, payload);
            } else {
                await api.post('/designs', payload);
            }
            console.log('Settings saved successfully');
            toast.success("Settings saved successfully!");
            console.log('Refreshing settings from server...');
            refreshSettings();
        } catch (err) {
            console.error('Save error:', err);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;
    if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold"><i className="fas fa-cog me-2"></i>Website Settings</h2>
                <Button variant="primary" onClick={handleSave} disabled={saving} className="px-5 shadow-sm">
                    {saving ? <Spinner animation="border" size="sm" /> : 'Save All Changes'}
                </Button>
            </div>

            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    <Tabs defaultActiveKey="general" id="settings-tabs" className="custom-tabs border-bottom">
                        {/* General Settings */}
                        <Tab eventKey="general" title="General" className="p-4">
                            <Row className="g-4">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Site Name (English)</Form.Label>
                                        <Form.Control
                                            value={settings.siteName}
                                            onChange={e => handleChange(null, 'siteName', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Site Name (Bengali)</Form.Label>
                                        <Form.Control
                                            value={settings.siteNameBn}
                                            onChange={e => handleChange(null, 'siteNameBn', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">💬 Site Tagline</Form.Label>
                                        <Form.Control
                                            value={settings.tagline}
                                            onChange={e => handleChange(null, 'tagline', e.target.value)}
                                            placeholder="A catchy motto or headline for your site"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">🖼️ Logo</Form.Label>
                                        <div className="d-flex gap-2 align-items-start">
                                            <div style={{ flex: 1 }}>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={uploading.logo}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setUploading(prev => ({ ...prev, logo: true }));
                                                            const reader = new FileReader();
                                                            reader.onloadend = async () => {
                                                                setLogoPreview(reader.result);
                                                                const uploadedPath = await handleFileUpload(file, 'logo');
                                                                if (uploadedPath) {
                                                                    handleChange(null, 'logo', uploadedPath);
                                                                    toast.success('Logo uploaded successfully!');
                                                                }
                                                                setUploading(prev => ({ ...prev, logo: false }));
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <small className="text-muted d-block mt-1">
                                                    {uploading.logo ? 'Uploading...' : 'PNG/JPG recommended (transparent background)'}
                                                </small>
                                            </div>
                                            {(logoPreview || settings.logo) && (
                                                <div style={{ width: '80px', height: '60px', border: '1px solid #ddd', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                                                    <img src={logoPreview || settings.logo} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                </div>
                                            )}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">🔗 Favicon</Form.Label>
                                        <div className="d-flex gap-2 align-items-start">
                                            <div style={{ flex: 1 }}>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/x-icon,image/png,.ico"
                                                    disabled={uploading.favicon}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            console.log('Favicon file selected:', file.name, file.size, file.type);
                                                            setUploading(prev => ({ ...prev, favicon: true }));
                                                            const reader = new FileReader();
                                                            reader.onloadend = async () => {
                                                                setFaviconPreview(reader.result);
                                                                console.log('Starting favicon upload...');
                                                                const uploadedPath = await handleFileUpload(file, 'favicon');
                                                                if (uploadedPath) {
                                                                    console.log('Favicon uploaded, saving path:', uploadedPath);
                                                                    handleChange(null, 'favicon', uploadedPath);
                                                                    toast.success('✅ Favicon uploaded successfully! Click "Save All Changes" to apply it.');
                                                                } else {
                                                                    console.error('Failed to get uploaded path from server');
                                                                    toast.error('Favicon upload failed - please check the console for details.');
                                                                }
                                                                setUploading(prev => ({ ...prev, favicon: false }));
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <small className="text-muted d-block mt-1">
                                                    {uploading.favicon ? 'Uploading...' : 'ICO/PNG format (32x32px recommended)'}
                                                </small>
                                            </div>
                                            {(faviconPreview || settings.favicon) && (
                                                <div style={{ width: '40px', height: '40px', border: '1px solid #ddd', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                                                    <img src={faviconPreview || settings.favicon} alt="Favicon Preview" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                                </div>
                                            )}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Tab>

                        {/* Social Links */}
                        <Tab eventKey="social" title="Social Links" className="p-4">
                            <Row className="g-4">
                                {Object.keys(settings.social).map(key => (
                                    <Col md={6} key={key}>
                                        <Form.Group className="mb-3 text-capitalize">
                                            <Form.Label className="fw-bold"><i className={`fab fa-${key === 'twitter' ? 'x-twitter' : key} me-2`}></i>{key}</Form.Label>
                                            <Form.Control
                                                value={settings.social[key]}
                                                onChange={e => handleChange('social', key, e.target.value)}
                                                placeholder={`https://${key}.com/yourpage`}
                                            />
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </Tab>

                        {/* Contact Info */}
                        <Tab eventKey="contact" title="Contact Us" className="p-4">
                            <Row className="g-4">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Email Address</Form.Label>
                                        <Form.Control
                                            value={settings.contact.email}
                                            onChange={e => handleChange('contact', 'email', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Phone Number</Form.Label>
                                        <Form.Control
                                            value={settings.contact.phone}
                                            onChange={e => handleChange('contact', 'phone', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Office Address</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={settings.contact.address}
                                            onChange={e => handleChange('contact', 'address', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Tab>

                        {/* Footer Settings */}
                        <Tab eventKey="footer" title="Footer Content" className="p-4">
                            <Row className="g-4">
                                <Col md={12}>
                                    <Alert variant="info" className="mb-3">
                                        <i className="fas fa-info-circle me-2"></i>
                                        This description will appear in the footer section of your website.
                                    </Alert>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">📝 Footer Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            value={settings.footerDescription}
                                            onChange={e => handleChange(null, 'footerDescription', e.target.value)}
                                            placeholder="Enter the short description that will appear in your website footer..."
                                        />
                                        <small className="text-muted d-block mt-2">
                                            Word count: {settings.footerDescription?.split(/\s+/).filter(Boolean).length || 0} words
                                        </small>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Tab>

                        {/* SEO Settings */}
                        <Tab eventKey="seo" title="SEO & Keywords" className="p-4">
                            <Row className="g-4">
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Global Meta Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={settings.seo.description}
                                            onChange={e => handleChange('seo', 'description', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Keywords (comma separated)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={settings.seo.keywords}
                                            onChange={e => handleChange('seo', 'keywords', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    );
};

export default SettingsClient;
