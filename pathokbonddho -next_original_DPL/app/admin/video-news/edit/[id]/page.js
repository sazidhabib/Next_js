'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Badge, Spinner, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';
import api, { STATIC_URL } from "@/app/lib/api";
import { useAuth } from "@/app/providers/AuthProvider";
import WYSIWYGEditor from '../../../components/WYSIWYGEditor';

const VideoNewsEdit = () => {
    const router = useRouter();
    const { id } = useParams();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.isAdmin;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [authors, setAuthors] = useState([]);
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState('all');
    const [imageSearch, setImageSearch] = useState('');
    
    // UI state
    const [modals, setModals] = useState({ 
        thumbImage: false, metaImage: false, editor: false, 
        format: false 
    });
    const [dropdowns, setDropdowns] = useState({ author: false, tag: false });
    const [searches, setSearches] = useState({ author: '', tag: '', image: '' });
    
    // Form and Media state
    const [formData, setFormData] = useState({
        newsHeadline: '', newsHeadlineBangla: '', highlight: '', alternativeHeadline: '',
        authorId: '', authorName: '', shortDescription: '', content: '',
        videoLink: '', newsSchedule: '', metaTitle: '',
        metaKeywords: '', metaDescription: '', status: 'draft',
        tagIds: [], tagNames: [], categoryIds: []
    });
    const [files, setFiles] = useState({ thumbImage: null, metaImage: null });
    const [selectedImages, setSelectedImages] = useState({ thumbImage: null, metaImage: null });
    const [currentImages, setCurrentImages] = useState({ thumbImage: '', metaImage: '' });
    
    // Editor context
    const [activeEditor, setActiveEditor] = useState(null);
    const [photoToFormat, setPhotoToFormat] = useState(null);
    const [editingElement, setEditingElement] = useState(null);
    const [selectedImageType, setSelectedImageType] = useState('');

    const editorRefs = {
        highlight: useRef(null), shortDescription: useRef(null), content: useRef(null)
    };
    const IMG_BASE = STATIC_URL || 'http://localhost:5000';
    const getImageUrl = (url) => (!url || url.startsWith('http')) ? url : `${IMG_BASE}/${url.replace(/^\/+/, '')}`;

    useEffect(() => {
        if (!isAdmin || !id) return;
        const fetchData = async () => {
            try {
                const [newsRes, authRes, tagRes, menuRes, albumRes, photoRes] = await Promise.all([
                    api.get(`/news/${id}`),
                    api.get('/authors', { params: { limit: 1000 } }),
                    api.get('/tags'),
                    api.get('/menus'),
                    api.get('/albums'),
                    api.get('/all/images', { params: { limit: 500 } })
                ]);

                const n = newsRes.data;
                setFormData({
                    newsHeadline: n.newsHeadline || '', newsHeadlineBangla: n.newsHeadlineBangla || '',
                    highlight: n.highlight || '', alternativeHeadline: n.alternativeHeadline || '',
                    authorId: n.authorId?.toString() || '', authorName: n.Author?.name || n.author?.name || '',
                    shortDescription: n.shortDescription || '', content: n.content || '',
                    videoLink: n.videoLink || '',
                    newsSchedule: n.newsSchedule || '', metaTitle: n.metaTitle || '',
                    metaKeywords: n.metaKeywords || '', metaDescription: n.metaDescription || '',
                    status: n.status || 'draft',
                    tagIds: (n.Tags || []).map(t => t.id.toString()),
                    tagNames: (n.Tags || []).map(t => t.name),
                    categoryIds: (n.Categories || []).map(c => c.id.toString())
                });
                setCurrentImages({ thumbImage: n.thumbImage, metaImage: n.metaImage });

                setAuthors(authRes.data.authors || authRes.data || []);
                setTags(tagRes.data.tags || tagRes.data || []);
                setCategories(processCategories(menuRes.data.data || menuRes.data || []));
                setAlbums(albumRes.data.albums || albumRes.data || []);
                setPhotos((photoRes.data.images || []).map(p => ({ ...p, imageUrl: p.imageUrl || p.image })));
            } catch (err) { toast.error("Failed to load dependency data"); }
            finally { setFetching(false); }
        };
        fetchData();
    }, [isAdmin, id]);

    const processCategories = (cats) => {
        const map = {}, root = [];
        cats.forEach(c => map[c.id] = { ...c, children: [] });
        cats.forEach(c => {
            if (c.parentId && map[c.parentId]) map[c.parentId].children.push(map[c.id]);
            else root.push(map[c.id]);
        });
        return root;
    };

    const handleAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (!['tagIds', 'categoryIds', 'authorName', 'tagNames'].includes(key)) {
                    submitData.append(key, formData[key]);
                }
            });
            submitData.append('tagIds', JSON.stringify(formData.tagIds));
            submitData.append('categoryIds', JSON.stringify(formData.categoryIds.map(id => parseInt(id))));
            submitData.append('newsType', 'video');
            
            Object.keys(files).forEach(k => { if (files[k]) submitData.append(k, files[k]); });
            Object.keys(selectedImages).forEach(k => { if (selectedImages[k]) submitData.append(`${k}Path`, selectedImages[k].imageUrl); });

            await api.put(`/news/${id}`, submitData);
            toast.success("Video News updated successfully!");
            router.push('/admin/news');
        } catch (err) { toast.error(err.response?.data?.message || "Failed to update video news"); }
        finally { setLoading(false); }
    };

    const handleFormatConfirm = ({ format, altText, caption }) => {
        const imageUrl = getImageUrl(photoToFormat.imageUrl);
        let html = '';
        if (format === 'full-width') html = `<img src="${imageUrl}" alt="${altText}" style="width: 100%; height: auto; display: block; margin: 1em 0; border-radius: 0.375rem;" />`;
        else if (format === 'left-aligned') html = `<img src="${imageUrl}" alt="${altText}" style="float: left; margin: 0 1.5em 1em 0; max-width: 50%; height: auto; border-radius: 0.375rem;" />`;
        else if (format === 'right-aligned') html = `<img src="${imageUrl}" alt="${altText}" style="float: right; margin: 0 0 1em 1.5em; max-width: 50%; height: auto; border-radius: 0.375rem;" />`;
        else if (format === 'full-width-captioned') {
            html = `<figure style="width: 100%; margin: 1em 0; text-align: center; display: inline-block;"><img src="${imageUrl}" alt="${altText}" style="width: 100%; height: auto; border-radius: 0.375rem;" /><figcaption style="font-size: 0.9em; color: #666; margin-top: 0.5em; font-style: italic;">${caption}</figcaption></figure><p></p>`;
        }

        if (editingElement) editingElement.parentNode.replaceChild(new DOMParser().parseFromString(html, 'text/html').body.firstChild, editingElement);
        else if (editorRefs[activeEditor]?.current) editorRefs[activeEditor].current.insertHTML(html);
        
        setModals(prev => ({ ...prev, format: false }));
    };

    if (fetching) return <div className="p-4 text-center"><Spinner animation="border" /></div>;
    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    const ImageModal = ({ type, show, onHide }) => (
        <Modal show={show} onHide={onHide} size="xl" scrollable centered>
            <Modal.Header closeButton><Modal.Title>Select Image</Modal.Title></Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col md={6}><Form.Select onChange={e => setSelectedAlbum(e.target.value)} value={selectedAlbum}><option value="all">All Albums</option>{albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Form.Select></Col>
                    <Col md={6}><Form.Control placeholder="Search images..." onChange={e => setImageSearch(e.target.value)} /></Col>
                </Row>
                <Row className="g-2">
                    {photos.filter(p => (selectedAlbum === 'all' || p.albumId == selectedAlbum) && (p.filename.toLowerCase().includes(imageSearch.toLowerCase()))).map(p => (
                        <Col md={3} key={p.id}>
                            <Card className="h-100 cursor-pointer" onClick={() => { 
                                if(type === 'editor') { setPhotoToFormat(p); setModals(prev => ({ ...prev, format: true, editor: false })); }
                                else { setSelectedImages({...selectedImages, [type]: p}); setFiles({...files, [type]: null}); onHide(); } 
                            }}>
                                <Card.Img src={getImageUrl(p.imageUrl)} style={{height: '120px', objectFit: 'cover'}} />
                                <Card.Body className="p-1 text-center"><small className="text-truncate d-block">{p.filename}</small></Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Modal.Body>
        </Modal>
    );

    return (
        <Container fluid className="py-4">
            <Form onSubmit={handleAction}>
                <div className="d-flex justify-content-between mb-3">
                    <h4>Edit Video News</h4>
                    <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Update Video News'}</Button>
                </div>

                <Row>
                    <Col md={8}>
                        <Card className="mb-3"><Card.Body>
                            <Form.Group className="mb-3"><Form.Label>Headline *</Form.Label><Form.Control required value={formData.newsHeadline} onChange={e => setFormData({...formData, newsHeadline: e.target.value})} /></Form.Group>
                            
                            <Form.Group className="mb-3"><Form.Label>Video Link (YouTube/Vimeo) *</Form.Label><Form.Control required placeholder="https://www.youtube.com/watch?v=..." value={formData.videoLink} onChange={e => setFormData({...formData, videoLink: e.target.value})} /></Form.Group>

                            <Form.Group className="mb-3"><Form.Label>Highlight</Form.Label><WYSIWYGEditor ref={editorRefs.highlight} value={formData.highlight} onChange={v => setFormData({...formData, highlight: v})} height={150} onImageClick={() => { setActiveEditor('highlight'); setModals({...modals, editor: true}); }} /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Short Description</Form.Label><WYSIWYGEditor ref={editorRefs.shortDescription} value={formData.shortDescription} onChange={v => setFormData({...formData, shortDescription: v})} height={200} onImageClick={() => { setActiveEditor('shortDescription'); setModals({...modals, editor: true}); }} /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Main Content *</Form.Label><WYSIWYGEditor ref={editorRefs.content} value={formData.content} onChange={v => setFormData({...formData, content: v})} height={300} onImageClick={() => { setActiveEditor('content'); setModals({...modals, editor: true}); }} /></Form.Group>
                        </Card.Body></Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-3"><Card.Body>
                            <h6>Metadata</h6><hr/>
                            <Form.Group className="mb-3"><Form.Label>Author *</Form.Label>
                                <InputGroup><Form.Control value={formData.authorName} readOnly placeholder="Select author" /><Button variant="outline-secondary" onClick={() => setDropdowns({...dropdowns, author: true})}>Find</Button></InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Thumbnail Image (Optional)</Form.Label>
                                <div className="border p-2 text-center mb-2" style={{minHeight: '100px'}}>
                                    {selectedImages.thumbImage ? <img src={getImageUrl(selectedImages.thumbImage.imageUrl)} alt="Preview" style={{maxWidth: '100%'}} /> : 
                                     currentImages.thumbImage ? <img src={getImageUrl(currentImages.thumbImage)} alt="Current" style={{maxWidth: '100%'}} /> : 'No image'}
                                </div>
                                <Button size="sm" className="w-100" onClick={() => { setSelectedImageType('thumbImage'); setModals({...modals, thumbImage: true}); }}>Choose from Gallery</Button>
                            </Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Status</Form.Label><Form.Select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option value="draft">Draft</option><option value="published">Published</option></Form.Select></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Categories</Form.Label><Form.Select multiple value={formData.categoryIds} onChange={e => setFormData({...formData, categoryIds: Array.from(e.target.selectedOptions, o => o.value)})} style={{height: '150px'}}>{categories.map(c => <option key={c.id} value={c.id}>-- {c.name}</option>)}</Form.Select></Form.Group>
                        </Card.Body></Card>
                    </Col>
                </Row>
            </Form>

            <ImageModal type="editor" show={modals.editor} onHide={() => setModals({...modals, editor: false})} />
            <ImageModal type="thumbImage" show={modals.thumbImage} onHide={() => setModals({...modals, thumbImage: false})} />
            
            <Modal show={modals.format} onHide={() => setModals({...modals, format: false})} centered>
                <Modal.Header closeButton><Modal.Title>Image Format</Modal.Title></Modal.Header>
                <Modal.Body className="text-center">
                    {photoToFormat && <img src={getImageUrl(photoToFormat.imageUrl)} alt="Preview" style={{maxHeight: '150px'}} className="mb-3" />}
                    <div className="d-flex flex-column gap-2">
                        <Button variant="outline-primary" onClick={() => handleFormatConfirm({format: 'full-width', altText: photoToFormat.filename || ''})}>Full Width</Button>
                        <Button variant="outline-primary" onClick={() => handleFormatConfirm({format: 'left-aligned', altText: photoToFormat.filename || ''})}>Left Aligned</Button>
                        <Button variant="outline-primary" onClick={() => handleFormatConfirm({format: 'right-aligned', altText: photoToFormat.filename || ''})}>Right Aligned</Button>
                        <Button variant="outline-primary" onClick={() => handleFormatConfirm({format: 'full-width-captioned', altText: photoToFormat.filename || '', caption: 'Image caption'})}>Captioned</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={dropdowns.author} onHide={() => setDropdowns({...dropdowns, author: false})} centered>
                <Modal.Header closeButton><Modal.Title>Select Author</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Control className="mb-3" placeholder="Search..." onChange={e => setSearches({...searches, author: e.target.value})} />
                    <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                        {authors.filter(a => a.name.toLowerCase().includes(searches.author.toLowerCase())).map(a => (
                            <div key={a.id} className="p-2 border-bottom cursor-pointer text-dark" onClick={() => { setFormData({...formData, authorId: a.id, authorName: a.name}); setDropdowns({...dropdowns, author: false}); }}>{a.name}</div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default VideoNewsEdit;
