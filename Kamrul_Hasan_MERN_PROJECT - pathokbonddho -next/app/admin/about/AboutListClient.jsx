'use client';

import React, { useState, useEffect } from "react";
import { Button, Spinner, Image, Form, Card, Row, Col, Tabs, Tab, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import api, { STATIC_URL } from "@/app/lib/api";

const IMG_URL = STATIC_URL;


const AboutListClient = ({ initialAbout, isAdmin }) => {
    const getFullImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/^\/+/, "");
        return cleanPath.startsWith('uploads/')
            ? `${IMG_URL}/${cleanPath}`
            : `${IMG_URL}/uploads/${cleanPath}`;
    };

    const [about, setAbout] = useState(initialAbout);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [activeTab, setActiveTab] = useState("hero");

    // Hero Section State
    const [heroTitle, setHeroTitle] = useState(initialAbout?.heroTitle || "");
    const [heroSubtitle, setHeroSubtitle] = useState(initialAbout?.heroSubtitle || "");

    // Introduction Section State
    const [introTag, setIntroTag] = useState(initialAbout?.introTag || "");
    const [introTitle, setIntroTitle] = useState(initialAbout?.introTitle || "");
    const [introDescription, setIntroDescription] = useState(initialAbout?.introDescription || "");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(getFullImageUrl(initialAbout?.imageUrl));

    // Socials State
    const [socials, setSocials] = useState(initialAbout?.socialLinks || { facebook: "", linkedin: "", twitter: "", email: "" });

    // Stats State (JSON Array)
    const [stats, setStats] = useState(initialAbout?.stats || [
        { icon: "fas fa-calendar-alt", number: "30+", label: "বছরের অভিজ্ঞতা" },
        { icon: "fas fa-trophy", number: "২০+", label: "জাতীয় ও আন্তর্জাতিক পুরস্কার" },
        { icon: "fas fa-file-alt", number: "৫০০০+", label: "প্রকাশিত প্রতিবেদন" },
        { icon: "fas fa-users", number: "১ লক্ষ+", label: "পাঠক ও অনুসারী" }
    ]);

    // Mission & Vision State (JSON Object)
    const [missionVision, setMissionVision] = useState(initialAbout?.missionVision || {
        mission: { title: "আমাদের মিশন", icon: "fas fa-bullseye", description: "" },
        vision: { title: "আমাদের ভিশন", icon: "fas fa-eye", description: "" }
    });

    // Values State (JSON Array)
    const [values, setValues] = useState(initialAbout?.values || [
        { icon: "fas fa-shield-alt", title: "সতর্কনিষ্ট", description: "" },
        { icon: "fas fa-balance-scale", title: "নিরপেক্ষতা", description: "" },
        { icon: "fas fa-handshake", title: "দায়বদ্ধতা", description: "" },
        { icon: "fas fa-lightbulb", title: "উদ্ভাবন", description: "" }
    ]);

    // CTA Section State
    const [ctaTitle, setCtaTitle] = useState(initialAbout?.ctaTitle || "");
    const [ctaSubtitle, setCtaSubtitle] = useState(initialAbout?.ctaSubtitle || "");

    const fetchAbout = async () => {
        setFetching(true);
        try {
            const res = await api.get('/about');
            const data = res.data;
            if (data) {
                setAbout(data);
                setHeroTitle(data.heroTitle || "");
                setHeroSubtitle(data.heroSubtitle || "");
                setIntroTag(data.introTag || "");
                setIntroTitle(data.introTitle || "");
                setIntroDescription(data.introDescription || "");
                setPreview(getFullImageUrl(data.imageUrl));
                setSocials(data.socialLinks || { facebook: "", linkedin: "", twitter: "", email: "" });
                setStats(data.stats || []);
                setMissionVision(data.missionVision || { mission: {}, vision: {} });
                setValues(data.values || []);
                setCtaTitle(data.ctaTitle || "");
                setCtaSubtitle(data.ctaSubtitle || "");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to refresh content");
        } finally {
            setFetching(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleStatChange = (index, field, value) => {
        const newStats = [...stats];
        newStats[index][field] = value;
        setStats(newStats);
    };

    const handleValueChange = (index, field, value) => {
        const newValues = [...values];
        newValues[index][field] = value;
        setValues(newValues);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('heroTitle', heroTitle);
            formData.append('heroSubtitle', heroSubtitle);
            formData.append('introTag', introTag);
            formData.append('introTitle', introTitle);
            formData.append('introDescription', introDescription);
            formData.append('socialLinks', JSON.stringify(socials));
            formData.append('stats', JSON.stringify(stats));
            formData.append('missionVision', JSON.stringify(missionVision));
            formData.append('values', JSON.stringify(values));
            formData.append('ctaTitle', ctaTitle);
            formData.append('ctaSubtitle', ctaSubtitle);

            if (image) {
                formData.append('image', image);
            } else if (about?.imageUrl) {
                formData.append('imageUrl', about.imageUrl);
            }

            await api.post('/about', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("About page updated successfully!");
            fetchAbout();
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to save changes');
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container-fluid px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-dark"><i className="fas fa-id-card me-2 text-primary"></i> About Page Dashboard</h4>
                <div>
                    <Button variant="outline-secondary" onClick={fetchAbout} className="me-2 rounded-pill px-4 shadow-sm" disabled={fetching}>
                        {fetching ? <Spinner size="sm" /> : <i className="fas fa-sync-alt me-2"></i>} Sync
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} className="rounded-pill px-5 shadow" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : <i className="fas fa-save me-2"></i>} Save Everything
                    </Button>
                </div>
            </div>

            <Row>
                <Col lg={12}>
                    <Card className="border-0 shadow-sm overflow-hidden mb-4">
                        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="bg-light border-0 admin-tabs">
                            <Tab eventKey="hero" title={<><i className="fas fa-flag me-2"></i> Banner</>} className="p-4">
                                <Row>
                                    <Col md={12}>
                                        <Card className="border p-3 bg-light-soft mb-4 border-2">
                                            <div className="p-2 border-start border-4 border-primary mb-3">
                                                <h6 className="mb-0 fw-bold">Hero Section (Top)</h6>
                                                <small className="text-muted">Edit the main banners appearing at the top of the About page.</small>
                                            </div>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-bold small text-uppercase">Page Title</Form.Label>
                                                        <Form.Control type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="e.g. পাঠকবন্ধু" className="border-2" />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-bold small text-uppercase">Sub-headline / Commitment</Form.Label>
                                                        <Form.Control type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="Commitment to neutral news..." className="border-2" />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="intro" title={<><i className="fas fa-user-circle me-2"></i> Introduction</>} className="p-4">
                                <Row>
                                    <Col lg={8}>
                                        <Card className="border-0 bg-white p-3 mb-4 shadow-sm">
                                            <h6 className="fw-bold mb-3 border-bottom pb-2">Biography & Presentation</h6>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold small">Section Tag (e.g. "পরিচিতি")</Form.Label>
                                                <Form.Control type="text" value={introTag} onChange={(e) => setIntroTag(e.target.value)} placeholder="Introduction Tag" />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold small">Catchy Section Title</Form.Label>
                                                <Form.Control type="text" value={introTitle} onChange={(e) => setIntroTitle(e.target.value)} placeholder="e.g. সাংবাদিকতা আমার সবকিছু" />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold small">Full Story / Description</Form.Label>
                                                <Form.Control as="textarea" rows={10} value={introDescription} onChange={(e) => setIntroDescription(e.target.value)} placeholder="Write your full story here..." />
                                            </Form.Group>
                                        </Card>
                                    </Col>
                                    <Col lg={4}>
                                        <Card className="border-0 shadow-sm p-3 mb-4">
                                            <h6 className="fw-bold mb-3 border-bottom pb-2">Profile Image</h6>
                                            <div className="text-center bg-light p-3 rounded mb-3" style={{ minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {preview ? <img src={preview} alt="Profile" className="img-fluid rounded shadow-sm border border-3 border-white" style={{ maxHeight: '300px' }} /> : <i className="fas fa-image fa-3x text-muted"></i>}
                                            </div>
                                            <Form.Control type="file" onChange={handleImageChange} className="mb-3" />
                                        </Card>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="stats" title={<><i className="fas fa-chart-line me-2"></i> Stats Bar</>} className="p-4">
                                <Row>
                                    {stats.map((stat, index) => (
                                        <Col md={3} key={index} className="mb-4">
                                            <Card className="border p-3 h-100 shadow-sm">
                                                <div className="text-center mb-3">
                                                    <i className={`${stat.icon} fa-2x text-primary p-3 bg-light rounded-circle`}></i>
                                                </div>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className="small fw-bold">Icon Class (FontAwesome)</Form.Label>
                                                    <Form.Control size="sm" type="text" value={stat.icon} onChange={(e) => handleStatChange(index, "icon", e.target.value)} />
                                                </Form.Group>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className="small fw-bold">Number / Counter</Form.Label>
                                                    <Form.Control size="sm" type="text" value={stat.number} onChange={(e) => handleStatChange(index, "number", e.target.value)} />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label className="small fw-bold">Label Text</Form.Label>
                                                    <Form.Control size="sm" type="text" value={stat.label} onChange={(e) => handleStatChange(index, "label", e.target.value)} />
                                                </Form.Group>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Tab>

                            <Tab eventKey="mission" title={<><i className="fas fa-bullseye me-2"></i> Mission & Vision</>} className="p-4">
                                <Row>
                                    <Col md={6}>
                                        <Card className="border p-4 shadow-sm border-2">
                                            <div className="d-flex align-items-center mb-3">
                                                <i className={`${missionVision.mission?.icon || 'fas fa-bullseye'} fa-2x text-danger me-3`}></i>
                                                <h5 className="mb-0 fw-bold">Our Mission</h5>
                                            </div>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small fw-bold">Mission Heading</Form.Label>
                                                <Form.Control type="text" value={missionVision.mission?.title} onChange={(e) => setMissionVision({ ...missionVision, mission: { ...missionVision.mission, title: e.target.value } })} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">Description Text</Form.Label>
                                                <Form.Control as="textarea" rows={4} value={missionVision.mission?.description} onChange={(e) => setMissionVision({ ...missionVision, mission: { ...missionVision.mission, description: e.target.value } })} />
                                            </Form.Group>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="border p-4 shadow-sm border-2">
                                            <div className="d-flex align-items-center mb-3">
                                                <i className={`${missionVision.vision?.icon || 'fas fa-eye'} fa-2x text-info me-3`}></i>
                                                <h5 className="mb-0 fw-bold">Our Vision</h5>
                                            </div>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small fw-bold">Vision Heading</Form.Label>
                                                <Form.Control type="text" value={missionVision.vision?.title} onChange={(e) => setMissionVision({ ...missionVision, vision: { ...missionVision.vision, title: e.target.value } })} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">Description Text</Form.Label>
                                                <Form.Control as="textarea" rows={4} value={missionVision.vision?.description} onChange={(e) => setMissionVision({ ...missionVision, vision: { ...missionVision.vision, description: e.target.value } })} />
                                            </Form.Group>
                                        </Card>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="values" title={<><i className="fas fa-star me-2"></i> Core Values</>} className="p-4">
                                <Row>
                                    {values.map((v, index) => (
                                        <Col md={6} key={index} className="mb-4">
                                            <Card className="border p-3 shadow-sm border-2 h-100">
                                                <div className="p-2 border-bottom mb-3 d-flex align-items-center">
                                                    <div className="bg-primary-soft p-2 rounded me-3"><i className={`${v.icon} text-primary`}></i></div>
                                                    <h6 className="mb-0 fw-bold">Value Card #{index + 1}</h6>
                                                </div>
                                                <Row>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label className="small fw-bold">Icon Class</Form.Label>
                                                            <Form.Control size="sm" type="text" value={v.icon} onChange={(e) => handleValueChange(index, "icon", e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label className="small fw-bold">Title</Form.Label>
                                                            <Form.Control size="sm" type="text" value={v.title} onChange={(e) => handleValueChange(index, "title", e.target.value)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Group>
                                                            <Form.Label className="small fw-bold">Detailed Description</Form.Label>
                                                            <Form.Control as="textarea" rows={3} size="sm" value={v.description} onChange={(e) => handleValueChange(index, "description", e.target.value)} />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Tab>

                            <Tab eventKey="cta" title={<><i className="fas fa-link me-2"></i> Join Section</>} className="p-4">
                                <Card className="p-4 border-2 bg-dark text-white rounded shadow text-center">
                                    <h4 className="fw-bold text-white mb-2">Call to Action Bar</h4>
                                    <p className="text-light-soft mb-4 border-bottom pb-2 border-secondary border-opacity-25">Featured at the bottom of the About page.</p>
                                    <Row className="text-start">
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small text-uppercase fw-bold text-warning">CTA Heading</Form.Label>
                                                <Form.Control className="bg-dark text-white border-secondary" type="text" value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} placeholder="e.g. আমাদের সাথে যুক্ত থাকুন" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small text-uppercase fw-bold text-warning">CTA Subtext</Form.Label>
                                                <Form.Control className="bg-dark text-white border-secondary" type="text" value={ctaSubtitle} onChange={(e) => setCtaSubtitle(e.target.value)} placeholder="সর্বশেষ সংবাদ ও আপডেটের জন্য..." />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card>
                            </Tab>
                        </Tabs>
                    </Card>
                </Col>
            </Row>

            <style jsx>{`
                .bg-light-soft { background-color: #f8fafc; }
                .bg-primary-soft { background-color: #eff6ff; }
                .text-light-soft { color: #cbd5e1; }
                .admin-tabs :global(.nav-item .nav-link) { 
                    padding: 15px 25px; 
                    font-weight: 600; 
                    color: #64748b;
                    border: none;
                    border-bottom: 3px solid transparent;
                }
                .admin-tabs :global(.nav-item .nav-link.active) { 
                    color: #0d6efd; 
                    background: white; 
                    border-bottom-color: #0d6efd; 
                }
            `}</style>
        </div>
    );
};

export default AboutListClient;
