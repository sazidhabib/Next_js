'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Badge, Spinner, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';
import api, { STATIC_URL } from "@/app/lib/api";
import { useAuth } from "@/app/providers/AuthProvider";
import WYSIWYGEditor from '@/app/admin/components/WYSIWYGEditor';
import ImageFormatModal from '@/app/admin/components/ImageFormatModal';
import HomepageLeadPositionSelector from '@/app/admin/components/HomepageLeadPositionSelector';
import MediaPickerModal from '@/app/admin/components/MediaPickerModal';
import { assignContentToHomepageSection1 } from '@/app/lib/homepageSection1Sync';



const NewsEdit = () => {
    const router = useRouter();
    const { id } = useParams();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.isAdmin;
    const canEdit = user?.role === 'superadmin' || !!user?.permissions?.news?.edit;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [leadPosition, setLeadPosition] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showThumbSection, setShowThumbSection] = useState(false);

    const [authorSearch, setAuthorSearch] = useState('');
    const [tagSearch, setTagSearch] = useState('');
    const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
    const [showTagDropdown, setShowTagDropdown] = useState(false);

    const [showImageModal, setShowImageModal] = useState({
        leadImage: false, thumbImage: false, metaImage: false, editor: false
    });
    const [selectedImageType, setSelectedImageType] = useState('');
    const [currentEditor, setCurrentEditor] = useState(null);
    const [showFormatModal, setShowFormatModal] = useState(false);
    const [photoToFormat, setPhotoToFormat] = useState(null);
    const [editingElement, setEditingElement] = useState(null);

    const editorRefs = {
        highlight: useRef(null), shortDescription: useRef(null), content: useRef(null)
    };

    const [formData, setFormData] = useState({
        newsHeadline: '', newsHeadlineBangla: '', highlight: '', alternativeHeadline: '',
        authorId: '', authorName: '', shortDescription: '', content: '',
        imageCaption: '', videoLink: '', newsSchedule: '', metaTitle: '',
        metaKeywords: '', metaDescription: '', status: 'draft',
        tagIds: [], tagNames: [], categoryIds: []
    });

    const [files, setFiles] = useState({ leadImage: null, thumbImage: null, metaImage: null });
    const [selectedImages, setSelectedImages] = useState({ leadImage: null, thumbImage: null, metaImage: null });
    const [currentImages, setCurrentImages] = useState({ leadImage: '', thumbImage: '', metaImage: '' });

    const IMG_BASE = STATIC_URL || 'http://localhost:5000';

    useEffect(() => {
        if (!isAdmin || !id) return;
        const fetchData = async () => {
            try {
                const [newsRes, authRes, tagRes, menuRes] = await Promise.all([
                    api.get(`/news/${id}`),
                    api.get('/authors', { params: { limit: 1000 } }),
                    api.get('/tags'),
                    api.get('/menus')
                ]);

                const n = newsRes.data.data || newsRes.data.news || newsRes.data;
                let scheduleValue = '';
                if (n.newsSchedule) {
                    const d = new Date(n.newsSchedule);
                    if (!isNaN(d.getTime())) {
                        const pad = (v) => v.toString().padStart(2, '0');
                        scheduleValue = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                    }
                }
                setFormData({
                    newsHeadline: n.newsHeadline || '', newsHeadlineBangla: n.newsHeadlineBangla || '',
                    highlight: n.highlight || '', alternativeHeadline: n.alternativeHeadline || '',
                    authorId: n.authorId?.toString() || '', authorName: n.Author?.name || n.author?.name || '',
                    shortDescription: n.shortDescription || '', content: n.content || '',
                    imageCaption: n.imageCaption || '', videoLink: n.videoLink || '',
                    newsSchedule: scheduleValue, metaTitle: n.metaTitle || '',
                    metaKeywords: n.metaKeywords || '', metaDescription: n.metaDescription || '',
                    status: n.status || 'draft',
                    tagIds: (n.Tags || []).map(t => t.id.toString()),
                    tagNames: (n.Tags || []).map(t => t.name),
                    categoryIds: (n.Categories || []).map(c => c.id.toString())
                });
                setAuthorSearch(n.Author?.name || n.author?.name || '');
                setCurrentImages({ leadImage: n.leadImage, thumbImage: n.thumbImage, metaImage: n.metaImage });
                if (n.thumbImage) setShowThumbSection(true);

                setAuthors(authRes.data.authors || authRes.data || []);
                setTags(tagRes.data.tags || tagRes.data || []);
                setCategories(processCategories(menuRes.data.data || menuRes.data || []));
            } catch (err) { 
                console.error('Error fetching data:', err);
                toast.error("Failed to load news data"); 
            }
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

    const renderCategoryOptions = (cats, level = 0) => (
        cats.map(cat => (
            <React.Fragment key={cat.id}>
                <option value={cat.id}>{'-'.repeat(level * 2)} {cat.name || cat.title}</option>
                {cat.children?.length > 0 && renderCategoryOptions(cat.children, level + 1)}
            </React.Fragment>
        ))
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files: fileList } = e.target;
        setFiles(prev => ({ ...prev, [name]: fileList[0] }));
        setSelectedImages(prev => ({ ...prev, [name]: null }));
    };

    const handleMultiSelect = (e, field) => {
        const selectedOptions = Array.from(e.target.selectedOptions, o => o.value);
        setFormData(prev => ({ ...prev, [field]: selectedOptions }));
    };

    const handleAuthorSelect = (author) => {
        setFormData(prev => ({ ...prev, authorId: author.id, authorName: author.name }));
        setAuthorSearch(author.name);
        setShowAuthorDropdown(false);
    };

    const handleTagSelect = (tag) => {
        if (!formData.tagIds.includes(tag.id.toString())) {
            setFormData(prev => ({
                ...prev, tagIds: [...prev.tagIds, tag.id.toString()], tagNames: [...prev.tagNames, tag.name]
            }));
        }
        setTagSearch('');
        setShowTagDropdown(false);
    };

    const removeTag = (tagId) => {
        const idStr = tagId.toString();
        const index = formData.tagIds.indexOf(idStr);
        if (index > -1) {
            const newIds = [...formData.tagIds];
            const newNames = [...formData.tagNames];
            newIds.splice(index, 1);
            newNames.splice(index, 1);
            setFormData(prev => ({ ...prev, tagIds: newIds, tagNames: newNames }));
        }
    };

    const openImageModal = (imageType) => {
        setSelectedImageType(imageType);
        setShowImageModal(prev => ({ ...prev, [imageType]: true }));
    };

    const closeImageModal = () => {
        setShowImageModal({ leadImage: false, thumbImage: false, metaImage: false, editor: false });
        setSelectedImageType('');
        setCurrentEditor(null);
    };

    const handleImageSelect = (photo) => {
        setSelectedImages(prev => ({ ...prev, [selectedImageType]: photo }));
        setFiles(prev => ({ ...prev, [selectedImageType]: null }));
        closeImageModal();
    };

    const openEditorImageModal = (editorType) => {
        setCurrentEditor(editorType);
        setShowImageModal(prev => ({ ...prev, editor: true }));
    };

    const handleEditorImageSelect = (photo) => {
        setPhotoToFormat(photo);
        setEditingElement(null);
        setShowFormatModal(true);
    };

    const handleEditImage = (imageData, editorType) => {
        setCurrentEditor(editorType);
        setPhotoToFormat({ imageUrl: imageData.imageUrl, caption: imageData.caption, alt: imageData.alt, format: imageData.format });
        setEditingElement(imageData.element);
        setShowFormatModal(true);
    };

    const handleFormatConfirm = ({ format, altText, caption }) => {
        const imageUrl = photoToFormat.imageUrl ? (photoToFormat.imageUrl.startsWith('http') ? photoToFormat.imageUrl : `${IMG_BASE}/${photoToFormat.imageUrl.replace(/^\/+/, '')}`) : '';
        let html = '';
        const altAttr = altText ? ` alt="${altText}"` : '';
        const baseImgStyle = 'width: 100%; height: auto; border-radius: 0.375rem;';

        let outerStyle = '';
        if (format === 'full-width') outerStyle = 'width: 100%; margin: 1em 0; display: block;';
        else if (format === 'left-aligned') outerStyle = 'float: left; margin: 0 1.5em 1em 0; max-width: 50%;';
        else if (format === 'right-aligned') outerStyle = 'float: right; margin: 0 0 1em 1.5em; max-width: 50%;';

        if (caption) {
            html = `<figure style="${outerStyle} text-align: center;"><img src="${imageUrl}"${altAttr} style="${baseImgStyle}" /><figcaption style="font-size: 0.9em; color: #666; margin-top: 0.5em; font-style: italic;">${caption}</figcaption></figure><p></p>`;
        } else {
            if (format === 'full-width') html = `<img src="${imageUrl}"${altAttr} style="${baseImgStyle} ${outerStyle}" /><p></p>`;
            else if (format === 'left-aligned') html = `<img src="${imageUrl}"${altAttr} style="${baseImgStyle} ${outerStyle}" />`;
            else if (format === 'right-aligned') html = `<img src="${imageUrl}"${altAttr} style="${baseImgStyle} ${outerStyle}" />`;
        }

        if (editingElement) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html.trim();
            editingElement.parentNode.replaceChild(tempDiv.firstChild, editingElement);
            if (editorRefs[currentEditor]?.current?.syncContent) editorRefs[currentEditor].current.syncContent();
            if (editorRefs[currentEditor]?.current) editorRefs[currentEditor].current.focus();
        } else {
            if (editorRefs[currentEditor]?.current) editorRefs[currentEditor].current.insertHTML(html);
            else {
                const currentContent = formData[currentEditor] || '';
                setFormData(prev => ({ ...prev, [currentEditor]: currentContent + (currentContent ? '<br>' : '') + html }));
            }
        }
        setShowFormatModal(false);
        setPhotoToFormat(null);
        setEditingElement(null);
        closeImageModal();
    };

    const handleAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (!['tagIds', 'categoryIds', 'authorName', 'tagNames'].includes(key)) {
                    submitData.append(key, formData[key] || '');
                }
            });
            submitData.append('tagIds', JSON.stringify(formData.tagIds));
            submitData.append('categoryIds', JSON.stringify(formData.categoryIds.map(id => parseInt(id))));
            Object.keys(files).forEach(k => { if (files[k]) submitData.append(k, files[k]); });
            Object.keys(selectedImages).forEach(k => { if (selectedImages[k]) submitData.append(`${k}Path`, selectedImages[k].imageUrl); });

            await api.patch(`/news/${id}`, submitData);

            if (leadPosition !== null && id) {
                try {
                    await assignContentToHomepageSection1({
                        contentId: id,
                        contentTitle: formData.newsHeadline || 'Untitled News',
                        contentType: 'news',
                        targetPosition: leadPosition
                    });
                } catch (syncErr) {
                    console.error("Homepage Section 1 sync error:", syncErr);
                }
            }

            toast.success("News updated successfully!");
            router.push('/admin/news');
        } catch (err) { 
            console.error('Update error:', err);
            toast.error(err.response?.data?.message || "Failed to update news"); 
        }
        finally { setLoading(false); }
    };

    if (fetching) return <div className="p-4 text-center"><Spinner animation="border" /></div>;
    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    const filteredAuthors = authors.filter(a => a.name?.toLowerCase().includes(authorSearch.toLowerCase()));
    const filteredTags = tags.filter(t => t.name?.toLowerCase().includes(tagSearch.toLowerCase()));

    const ImagePreview = ({ imageType }) => {
        const file = files[imageType];
        const selImg = selectedImages[imageType];
        const curImg = currentImages[imageType];
        
        if (file) return <div className="mt-2"><img src={URL.createObjectURL(file)} alt="Preview" className="img-thumbnail" style={{ maxHeight: '100px' }} /><div className="text-muted small">New upload</div></div>;
        if (selImg && selImg.imageUrl) {
            const imgSrc = selImg.imageUrl.startsWith('http') ? selImg.imageUrl : `${IMG_BASE}/${selImg.imageUrl.replace(/^\/+/, '')}`;
            return <div className="mt-2"><img src={imgSrc} alt="Selected" className="img-thumbnail" style={{ maxHeight: '100px' }} /><div className="text-muted small">From gallery</div></div>;
        }
        if (curImg) {
            const imgSrc = curImg.startsWith('http') ? curImg : `${IMG_BASE}/${curImg.replace(/^\/+/, '')}`;
            return <div className="mt-2"><img src={imgSrc} alt="Current" className="img-thumbnail" style={{ maxHeight: '100px' }} /><div className="text-muted small">Current image</div></div>;
        }
        return null;
    };



    if (!isAdmin || !canEdit) {
        return <div className="p-4 text-center"><h4>Access Denied: You do not have permission to edit news.</h4></div>;
    }

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between mb-3">
                <h4>Edit News Post</h4>
                <Button type="submit" form="news-form" disabled={loading}>{loading ? 'Saving...' : 'Update News'}</Button>
            </div>

            <Form id="news-form" onSubmit={handleAction}>
                <Row>
                    <Col md={8}>
                        <Card className="mb-3">
                            <Card.Body>
                                <h5 className="border-bottom pb-2 mb-3">Basic Information</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>News Headline *</Form.Label>
                                    <Form.Control required value={formData.newsHeadline} name="newsHeadline" onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Alternative Headline</Form.Label>
                                    <Form.Control value={formData.alternativeHeadline} name="alternativeHeadline" onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Highlight</Form.Label>
                                    <WYSIWYGEditor ref={editorRefs.highlight} value={formData.highlight} onChange={v => setFormData({...formData, highlight: v})} height={200} onImageClick={() => openEditorImageModal('highlight')} onEditImage={(data) => handleEditImage(data, 'highlight')} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Short Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={formData.shortDescription} name="shortDescription" onChange={handleInputChange} placeholder="Brief summary of the news (plain text)..." style={{ resize: 'vertical' }} maxLength={150} />
                                    <div className="text-muted small mt-1">
                                        Short description accepts a maximum of 150 characters. ({(formData.shortDescription || '').length}/150 characters)
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Content *</Form.Label>
                                    <WYSIWYGEditor ref={editorRefs.content} value={formData.content} onChange={v => setFormData({...formData, content: v})} height={400} onImageClick={() => openEditorImageModal('content')} onEditImage={(data) => handleEditImage(data, 'content')} />
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <Card className="mb-3">
                            <Card.Body>
                                <h5 className="border-bottom pb-2 mb-3">Categories & Tags</h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Categories</Form.Label>
                                            <Form.Select multiple value={formData.categoryIds} onChange={e => handleMultiSelect(e, 'categoryIds')} style={{ height: '150px' }}>
                                                {categories.length > 0 ? renderCategoryOptions(categories) : <option>No categories available</option>}
                                            </Form.Select>
                                            <small className="text-muted">Hold Ctrl to select multiple</small>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tags</Form.Label>
                                            <div className="position-relative">
                                                <Form.Control placeholder="Search tags..." value={tagSearch} onChange={e => { setTagSearch(e.target.value); setShowTagDropdown(true); }} onFocus={() => setShowTagDropdown(true)} onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)} />
                                                {showTagDropdown && filteredTags.length > 0 && (
                                                    <div className="dropdown-menu show w-100" style={{ zIndex: 1060, maxHeight: '300px', overflowY: 'auto' }}>
                                                        {filteredTags.map(tag => <button key={tag.id} type="button" className="dropdown-item" onMouseDown={(e) => { e.preventDefault(); handleTagSelect(tag); }}>{tag.name}</button>)}
                                                    </div>
                                                )}
                                            </div>
                                            {formData.tagNames?.length > 0 && (
                                                <div className="mt-2">
                                                    {formData.tagNames.map((tagName, i) => (
                                                        <Badge key={formData.tagIds[i]} bg="primary" className="me-1 mb-1">{tagName} <button type="button" className="btn-close btn-close-white ms-1" style={{ fontSize: '0.6rem' }} onClick={() => removeTag(formData.tagIds[i])} /></Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <HomepageLeadPositionSelector
                            value={leadPosition}
                            onChange={setLeadPosition}
                            currentContentId={id}
                            currentContentType="news"
                        />

                        <Card className="mb-3">
                            <Card.Body>
                                <h5 className="border-bottom pb-2 mb-3">Author & Status</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Author *</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control required value={authorSearch} placeholder="Search author..." onChange={e => { setAuthorSearch(e.target.value); setShowAuthorDropdown(true); }} onFocus={() => setShowAuthorDropdown(true)} onBlur={() => setTimeout(() => setShowAuthorDropdown(false), 200)} />
                                        {showAuthorDropdown && filteredAuthors.length > 0 && (
                                            <div className="dropdown-menu show w-100" style={{ zIndex: 1060, maxHeight: '300px', overflowY: 'auto' }}>
                                                {filteredAuthors.map(a => <button key={a.id} type="button" className="dropdown-item" onMouseDown={(e) => { e.preventDefault(); handleAuthorSelect(a); }}>{a.name}</button>)}
                                            </div>
                                        )}
                                    </div>
                                    {formData.authorName && <small className="text-success">Selected: {formData.authorName}</small>}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select name="status" value={formData.status} onChange={handleInputChange}>
                                        <option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option>
                                    </Form.Select>
                                </Form.Group>
                                {formData.status === 'scheduled' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Schedule Date & Time</Form.Label>
                                        <Form.Control type="datetime-local" name="newsSchedule" value={formData.newsSchedule} onChange={handleInputChange} />
                                    </Form.Group>
                                )}
                            </Card.Body>
                        </Card>

                        <Card className="mb-3">
                            <Card.Body>
                                <h5 className="border-bottom pb-2 mb-3">Media</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Lead Image</Form.Label>
                                    <div className="d-flex gap-2 mb-2">
                                        <Form.Control type="file" name="leadImage" accept="image/*" onChange={handleFileChange} />
                                        <Button variant="outline-secondary" onClick={() => openImageModal('leadImage')}>Choose</Button>
                                    </div>
                                    <ImagePreview imageType="leadImage" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <Form.Label className="mb-0">Thumbnail Image</Form.Label>
                                        <Button
                                            variant={showThumbSection ? 'outline-danger' : 'outline-primary'}
                                            size="sm"
                                            onClick={() => setShowThumbSection(!showThumbSection)}
                                            className="d-inline-flex align-items-center justify-content-center p-0"
                                            style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                                            title={showThumbSection ? 'Close thumbnail section' : 'Add thumbnail image'}
                                        >
                                            {showThumbSection ? <i className="fas fa-minus small" style={{ fontSize: '0.8rem' }}></i> : <i className="fas fa-plus small" style={{ fontSize: '0.8rem' }}></i>}
                                        </Button>
                                        {(files.thumbImage || selectedImages.thumbImage || currentImages.thumbImage) && !showThumbSection && (
                                            <Badge bg="success" className="ms-1">✓ Added</Badge>
                                        )}
                                    </div>
                                    {showThumbSection && (
                                        <>
                                            <div className="d-flex gap-2 mb-2">
                                                <Form.Control type="file" name="thumbImage" accept="image/*" onChange={handleFileChange} />
                                                <Button variant="outline-secondary" onClick={() => openImageModal('thumbImage')}>Choose</Button>
                                            </div>
                                            <ImagePreview imageType="thumbImage" />
                                        </>
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Image Caption</Form.Label>
                                    <Form.Control value={formData.imageCaption} name="imageCaption" onChange={handleInputChange} />
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <Card className="mb-3">
                            <Card.Body>
                                <h5 className="border-bottom pb-2 mb-3">SEO Settings</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meta Image</Form.Label>
                                    <div className="d-flex gap-2 mb-2">
                                        <Form.Control type="file" name="metaImage" accept="image/*" onChange={handleFileChange} />
                                        <Button variant="outline-secondary" onClick={() => openImageModal('metaImage')}>Choose</Button>
                                    </div>
                                    <ImagePreview imageType="metaImage" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meta Title</Form.Label>
                                    <Form.Control value={formData.metaTitle} name="metaTitle" onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meta Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={formData.metaDescription} name="metaDescription" onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meta Keywords</Form.Label>
                                    <Form.Control as="textarea" rows={2} value={formData.metaKeywords} name="metaKeywords" onChange={handleInputChange} placeholder="keyword1, keyword2, keyword3" />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>

            <MediaPickerModal show={showImageModal.editor} onClose={closeImageModal} onSelect={handleEditorImageSelect} title="Select Image for Editor" />
            <MediaPickerModal show={showImageModal.leadImage} onClose={closeImageModal} onSelect={handleImageSelect} title="Select Lead Image" />
            <MediaPickerModal show={showImageModal.thumbImage} onClose={closeImageModal} onSelect={handleImageSelect} title="Select Thumbnail Image" />
            <MediaPickerModal show={showImageModal.metaImage} onClose={closeImageModal} onSelect={handleImageSelect} title="Select Meta Image" />
            <ImageFormatModal show={showFormatModal} onHide={() => setShowFormatModal(false)} onConfirm={handleFormatConfirm} photo={photoToFormat} />
        </Container>
    );
};

export default NewsEdit;
