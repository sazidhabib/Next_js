'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Badge, Spinner, InputGroup } from 'react-bootstrap';
import { MdExpandMore, MdExpandLess, MdDelete, MdArrowUpward, MdArrowDownward, MdAddCircleOutline, MdMoreHoriz } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';
import api, { STATIC_URL } from "@/app/lib/api";
import { useAuth } from "@/app/providers/AuthProvider";
import WYSIWYGEditor from '../../../components/WYSIWYGEditor';

const PhotoNewsEdit = () => {
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
        leadImage: false, thumbImage: false, metaImage: false, editor: false, 
        format: false, gallery: false 
    });
    const [dropdowns, setDropdowns] = useState({ author: false, tag: false });
    const [searches, setSearches] = useState({ author: '', tag: '', image: '' });
    
    // Upload state
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadAlbumId, setUploadAlbumId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showUploadSection, setShowUploadSection] = useState(false);
    
    // Form and Media state
    const [formData, setFormData] = useState({
        newsHeadline: '', newsHeadlineBangla: '', highlight: '', alternativeHeadline: '',
        authorId: '', authorName: '', shortDescription: '', content: '',
        imageCaption: '', videoLink: '', newsSchedule: '', metaTitle: '',
        metaKeywords: '', metaDescription: '', status: 'draft',
        tagIds: [], tagNames: [], categoryIds: []
    });
    const [galleryItems, setGalleryItems] = useState([]);
    const [expandedGalleryItems, setExpandedGalleryItems] = useState({});
    const [files, setFiles] = useState({ leadImage: null, thumbImage: null, metaImage: null });
    const [selectedImages, setSelectedImages] = useState({ leadImage: null, thumbImage: null, metaImage: null });
    const [currentImages, setCurrentImages] = useState({ leadImage: '', thumbImage: '', metaImage: '' });
    
    // Editor context
    const [activeEditor, setActiveEditor] = useState(null);
    const [photoToFormat, setPhotoToFormat] = useState(null);
    const [editingElement, setEditingElement] = useState(null);
    const [selectedImageType, setSelectedImageType] = useState('');
    const [targetGalleryIndex, setTargetGalleryIndex] = useState(null);

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
                    imageCaption: n.imageCaption || '', videoLink: n.videoLink || '',
                    newsSchedule: n.newsSchedule || '', metaTitle: n.metaTitle || '',
                    metaKeywords: n.metaKeywords || '', metaDescription: n.metaDescription || '',
                    status: n.status || 'draft',
                    tagIds: (n.Tags || []).map(t => t.id.toString()),
                    tagNames: (n.Tags || []).map(t => t.name),
                    categoryIds: (n.Categories || []).map(c => c.id.toString())
                });
                setCurrentImages({ leadImage: n.leadImage, thumbImage: n.thumbImage, metaImage: n.metaImage });
                setGalleryItems(n.GalleryItems ? n.GalleryItems.sort((a,b) => a.sortOrder - b.sortOrder) : []);

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

    const fetchAllPhotos = async () => {
        try {
            const response = await api.get('/all/images', { params: { limit: 500 } });
            setPhotos((response.data.images || []).map(p => ({ ...p, imageUrl: p.imageUrl || p.image })));
        } catch (err) {
            console.warn('Failed to refresh images');
        }
    };

    const handleUploadImage = async () => {
        if (!uploadFile) { toast.error('Please select a file to upload'); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('images', uploadFile);
            if (uploadAlbumId) fd.append('albumId', uploadAlbumId);
            await api.post('/upload', fd);
            toast.success('Image uploaded successfully!');
            setUploadFile(null);
            setUploadAlbumId('');
            await fetchAllPhotos();
        } catch (err) {
            console.error('Upload error:', err);
            toast.error(err.response?.data?.message || 'Failed to upload image');
        } finally { setUploading(false); }
    };

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
        
        if (galleryItems.length === 0 && !currentImages.thumbImage && !files.thumbImage && !selectedImages.thumbImage) {
            toast.error("An image (Thumbnail or Gallery Photo) is required.");
            return;
        }

        const missingImages = galleryItems.some(item => !item.imageUrl);
        if (missingImages) {
            toast.error("Please select an image for all gallery blocks.");
            return;
        }

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
            submitData.append('newsType', 'photo');
            submitData.append('galleryItems', JSON.stringify(galleryItems));
            
            Object.keys(files).forEach(k => { if (files[k]) submitData.append(k, files[k]); });
            Object.keys(selectedImages).forEach(k => { if (selectedImages[k]) submitData.append(`${k}Path`, selectedImages[k].imageUrl); });

            await api.patch(`/news/${id}`, submitData);
            toast.success("Photo News updated successfully!");
            router.push('/admin/news');
        } catch (err) { toast.error(err.response?.data?.message || "Failed to update photo news"); }
        finally { setLoading(false); }
    };

    const handleGalleryImageSelect = (photo) => {
        if (targetGalleryIndex !== null) {
            const newItems = [...galleryItems];
            newItems[targetGalleryIndex].imageUrl = photo.imageUrl;
            setGalleryItems(newItems);
            setModals(prev => ({ ...prev, gallery: false }));
        }
    };

    const addGalleryItem = () => {
        const newItem = { imageUrl: '', caption: '', content: '' };
        setGalleryItems([...galleryItems, newItem]);
        setExpandedGalleryItems(prev => ({ ...prev, [galleryItems.length]: true }));
    };

    const removeGalleryItem = (index) => {
        const newItems = galleryItems.filter((_, i) => i !== index);
        setGalleryItems(newItems);
        const newExpanded = {};
        newItems.forEach((_, i) => { if (expandedGalleryItems[i] !== undefined) newExpanded[i] = expandedGalleryItems[i]; });
        setExpandedGalleryItems(newExpanded);
    };

    const moveGalleryItem = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === galleryItems.length - 1)) return;
        const newItems = [...galleryItems];
        const temp = newItems[index];
        newItems[index] = newItems[index + direction];
        newItems[index + direction] = temp;
        setGalleryItems(newItems);
        setExpandedGalleryItems(prev => ({
            ...prev,
            [index]: prev[index + direction],
            [index + direction]: prev[index]
        }));
    };

    const toggleGalleryExpand = (index) => {
        setExpandedGalleryItems(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const updateGalleryField = (index, field, value) => {
        const newItems = [...galleryItems];
        newItems[index][field] = value;
        setGalleryItems(newItems);
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
                <div className="card mb-4">
                    <div className="card-header p-0">
                        <Button variant="link text-decoration-none w-100 text-start p-3" onClick={() => setShowUploadSection(!showUploadSection)}>
                            {showUploadSection ? '▲' : '▼'} Upload New Image
                        </Button>
                    </div>
                    {showUploadSection && (
                        <div className="card-body">
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Select Image</Form.Label>
                                        <Form.Control type="file" accept="image/*" onChange={e => setUploadFile(e.target.files[0])} />
                                        {uploadFile && (
                                            <div className="mt-2">
                                                <img src={URL.createObjectURL(uploadFile)} alt="Upload Preview" className="img-thumbnail" style={{ maxHeight: '100px' }} />
                                                <div className="text-muted small">Ready to upload: {uploadFile.name}</div>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={4}><Form.Group className="mb-3"><Form.Label>Album (Optional)</Form.Label><Form.Select value={uploadAlbumId} onChange={e => setUploadAlbumId(e.target.value)}><option value="">Select Album</option>{albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Form.Select></Form.Group></Col>
                                <Col md={2} className="d-flex align-items-end"><Button className="w-100 mb-3" onClick={handleUploadImage} disabled={uploading || !uploadFile}>{uploading ? 'Uploading...' : 'Upload'}</Button></Col>
                            </Row>
                        </div>
                    )}
                </div>

                <Row className="mb-3">
                    <Col md={6}><Form.Select onChange={e => setSelectedAlbum(e.target.value)} value={selectedAlbum}><option value="all">All Albums</option>{albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Form.Select></Col>
                    <Col md={6}><Form.Control placeholder="Search images..." onChange={e => setImageSearch(e.target.value)} /></Col>
                </Row>
                <Row className="g-2">
                    {photos.filter(p => (selectedAlbum === 'all' || p.albumId == selectedAlbum) && (p.filename?.toLowerCase().includes(imageSearch.toLowerCase()) || p.caption?.toLowerCase().includes(imageSearch.toLowerCase()))).map(p => (
                        <Col md={3} key={p.id}>
                            <Card className="h-100 cursor-pointer" onClick={() => { 
                                if(type === 'editor') { setPhotoToFormat(p); setModals(prev => ({ ...prev, format: true, editor: false })); }
                                else if(type === 'gallery') handleGalleryImageSelect(p);
                                else { setSelectedImages({...selectedImages, [type]: p}); setFiles({...files, [type]: null}); onHide(); } 
                            }}>
                                <Card.Img src={getImageUrl(p.imageUrl)} style={{height: '140px', objectFit: 'cover'}} />
                                <Card.Body className="p-2 text-center"><small className="text-truncate d-block">{p.caption || p.filename}</small></Card.Body>
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
                    <h4>Edit Photo News</h4>
                    <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Update Photo News'}</Button>
                </div>

                <Row>
                    <Col md={8}>
                        <Card className="mb-3"><Card.Body>
                            <Form.Group className="mb-3"><Form.Label>Headline *</Form.Label><Form.Control required value={formData.newsHeadline} onChange={e => setFormData({...formData, newsHeadline: e.target.value})} /></Form.Group>
                            <Card className="mt-4 mb-3 border shadow-sm">
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-3 cursor-pointer">
                                        <MdExpandMore size={24} className="me-2 text-primary" />
                                        <h6 className="mb-0 fw-bold text-dark">Gallery images</h6>
                                    </div>

                                    {galleryItems.map((item, index) => (
                                        <div key={index} className="mb-4 border" style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
                                            {/* Header */}
                                            <div className="d-flex align-items-center justify-content-between p-2" style={{ borderBottom: '1px solid #dee2e6', backgroundColor: '#f8f9fa' }}>
                                                <div className="d-flex align-items-center cursor-pointer" onClick={() => toggleGalleryExpand(index)}>
                                                    {expandedGalleryItems[index] ? <MdExpandLess size={20} className="me-2 text-primary" /> : <MdExpandMore size={20} className="me-2 text-primary" />}
                                                    <span className="fw-semibold small text-dark">Gallery images {index + 1}</span>
                                                </div>
                                                <div className="d-flex gap-1">
                                                    <Button variant="link" size="sm" className="p-0 text-secondary" onClick={() => moveGalleryItem(index, -1)} disabled={index === 0}><MdArrowUpward size={18} /></Button>
                                                    <Button variant="link" size="sm" className="p-0 text-secondary" onClick={() => moveGalleryItem(index, 1)} disabled={index === galleryItems.length - 1}><MdArrowDownward size={18} /></Button>
                                                    <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => removeGalleryItem(index)}><MdDelete size={18} /></Button>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            {expandedGalleryItems[index] !== false && (
                                                <div className="p-3">
                                                    {/* Image Selection Block */}
                                                    <div className="mb-4">
                                                        <Form.Label className="small fw-bold text-secondary text-uppercase" style={{fontSize: '0.7rem'}}>Image <span className="text-danger">*</span></Form.Label>
                                                        <div className="d-flex align-items-center gap-3 p-2 rounded border" style={{ backgroundColor: '#fdfdfd' }}>
                                                            <div className="rounded border overflow-hidden bg-light d-flex align-items-center justify-content-center shadow-sm" style={{ width: '80px', height: '50px' }}>
                                                                {item.imageUrl ? (
                                                                    <img src={getImageUrl(item.imageUrl)} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <div className="text-muted" style={{fontSize: '0.6rem'}}>No Image</div>
                                                                )}
                                                            </div>
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <div className="text-truncate small text-primary mb-1 fw-medium" style={{fontSize: '0.75rem'}}>{item.imageUrl ? item.imageUrl.split('/').pop() : 'No image selected'}</div>
                                                                <Button variant="outline-primary" size="sm" className="py-0 px-2" style={{fontSize: '0.7rem'}} onClick={() => { setTargetGalleryIndex(index); setModals({...modals, gallery: true}); }}>Choose Photo</Button>
                                                            </div>
                                                            <Button variant="link" size="sm" className="text-muted"><MdMoreHoriz size={20} /></Button>
                                                        </div>
                                                    </div>

                                                    {/* Caption Block */}
                                                    <div className="mb-4">
                                                        <Form.Label className="small fw-bold text-secondary text-uppercase" style={{fontSize: '0.7rem'}}>Caption</Form.Label>
                                                        <Form.Control 
                                                            size="sm"
                                                            style={{ borderRadius: '6px' }}
                                                            value={item.caption} 
                                                            onChange={e => updateGalleryField(index, 'caption', e.target.value)} 
                                                            placeholder="Enter image caption..."
                                                        />
                                                    </div>

                                                    {/* Content Block */}
                                                    <div>
                                                        <Form.Label className="small fw-bold text-secondary text-uppercase" style={{fontSize: '0.7rem'}}>Content</Form.Label>
                                                        <Form.Control 
                                                            as="textarea"
                                                            rows={2}
                                                            size="sm"
                                                            style={{ borderRadius: '6px' }}
                                                            value={item.content || ''} 
                                                            onChange={e => updateGalleryField(index, 'content', e.target.value)} 
                                                            placeholder="Write something or type '/' to insert a block"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <Button variant="link" className="text-decoration-none p-0 d-flex align-items-center text-primary small fw-medium" onClick={addGalleryItem}>
                                        <MdAddCircleOutline size={18} className="me-2" />
                                        Add gallery images
                                    </Button>
                                </Card.Body>
                            </Card>

                            <Form.Group className="mb-3 mt-4"><Form.Label>Highlight</Form.Label><WYSIWYGEditor ref={editorRefs.highlight} value={formData.highlight} onChange={v => setFormData({...formData, highlight: v})} height={150} onImageClick={() => { setActiveEditor('highlight'); setModals({...modals, editor: true}); }} /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Main Content</Form.Label><WYSIWYGEditor ref={editorRefs.content} value={formData.content} onChange={v => setFormData({...formData, content: v})} height={300} onImageClick={() => { setActiveEditor('content'); setModals({...modals, editor: true}); }} /></Form.Group>
                        </Card.Body></Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-3"><Card.Body>
                            <h6>Metadata</h6><hr/>
                            <Form.Group className="mb-3"><Form.Label>Author *</Form.Label>
                                <InputGroup><Form.Control value={formData.authorName} readOnly placeholder="Select author" /><Button variant="outline-secondary" onClick={() => setDropdowns({...dropdowns, author: true})}>Find</Button></InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Thumbnail Image *</Form.Label>
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
            <ImageModal type="gallery" show={modals.gallery} onHide={() => setModals({...modals, gallery: false})} />
            
            <Modal show={modals.format} onHide={() => setModals({...modals, format: false})} centered>
                <Modal.Header closeButton><Modal.Title>Image Format</Modal.Title></Modal.Header>
                <Modal.Body className="text-center">
                    {photoToFormat && <img src={getImageUrl(photoToFormat.imageUrl)} alt="Format Preview" style={{maxHeight: '150px'}} className="mb-3" />}
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

export default PhotoNewsEdit;
