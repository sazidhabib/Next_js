import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/auth';
import { toast } from 'react-toastify';
import WYSIWYGEditor from './WYSIWYGEditor';
import ImageFormatModal from './ImageFormatModal';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const VideoNewsEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [authors, setAuthors] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [filteredPhotos, setFilteredPhotos] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState('all');
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadAlbumId, setUploadAlbumId] = useState('');

    // State for image selection
    const [showImageModal, setShowImageModal] = useState({
        leadImage: false,
        thumbImage: false,
        metaImage: false,
        editor: false
    });
    // State for searchable dropdowns
    const [authorSearch, setAuthorSearch] = useState('');
    const [tagSearch, setTagSearch] = useState('');
    const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
    const [showTagDropdown, setShowTagDropdown] = useState(false);

    const [selectedImageType, setSelectedImageType] = useState('');
    const [currentEditor, setCurrentEditor] = useState(null);
    const [showFormatModal, setShowFormatModal] = useState(false);
    const [photoToFormat, setPhotoToFormat] = useState(null);
    const [editingElement, setEditingElement] = useState(null);

    // Refs for editor instances
    const highlightEditorRef = useRef(null);
    const shortDescriptionEditorRef = useRef(null);
    const contentEditorRef = useRef(null);

    const [formData, setFormData] = useState({
        newsHeadline: '',
        highlight: '',
        alternativeHeadline: '',
        authorId: '',
        shortDescription: '',
        content: '',
        imageCaption: '',
        videoLink: '',
        newsSchedule: '',
        metaTitle: '',
        metaKeywords: '',
        metaDescription: '',
        status: 'draft',
        tagIds: [],
        tagNames: [],
        categoryIds: []
    });

    const [files, setFiles] = useState({
        leadImage: null,
        thumbImage: null,
        metaImage: null
    });

    const [selectedImages, setSelectedImages] = useState({
        leadImage: null,
        thumbImage: null,
        metaImage: null
    });

    const [currentImages, setCurrentImages] = useState({
        leadImage: '',
        thumbImage: '',
        metaImage: ''
    });

    const handleAlbumChange = (e) => {
        const value = e.target.value;
        setSelectedAlbum(value);

        if (value === 'all') {
            setFilteredPhotos(photos);
        } else if (['article', 'blog', 'news', 'photo', 'other'].includes(value)) {
            // Filter by source type
            const filtered = photos.filter(photo =>
                photo.source && photo.source.toLowerCase() === value.toLowerCase()
            );
            setFilteredPhotos(filtered);
            console.log(`Filtered by ${value}: ${filtered.length} images`);
        } else {
            // Filter by album ID
            const albumId = parseInt(value);
            const filtered = photos.filter(photo =>
                photo.albumId === albumId ||
                (photo.albumId && photo.albumId.toString() === value)
            );
            setFilteredPhotos(filtered);
            console.log(`Filtered by album ${albumId}: ${filtered.length} images`);
        }
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            console.log('getImageUrl: No image URL provided');
            return '';
        }
        const cleanUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
        const finalUrl = `${API_URL}/${cleanUrl}`;
        console.log(`getImageUrl input: "${imageUrl}", cleaned: "${cleanUrl}", final: "${finalUrl}"`);
        return finalUrl;
    };

    const handleEditorImageSelect = (photo) => {
        setPhotoToFormat(photo);
        setEditingElement(null);
        setShowFormatModal(true);
    };

    const handleEditImage = (imageData) => {
        setPhotoToFormat({
            imageUrl: imageData.imageUrl,
            caption: imageData.caption,
            alt: imageData.alt,
            format: imageData.format
        });
        setEditingElement(imageData.element);
        setShowFormatModal(true);
    };

    const handleFormatConfirm = ({ format, altText, caption }) => {
        const photo = photoToFormat;
        const imageUrl = getImageUrl(photo.imageUrl); // Use getImageUrl for consistency
        
        let htmlImage = '';
        if (format === 'full-width') {
            htmlImage = `<img src="${imageUrl}" alt="${altText}" style="width: 100%; height: auto; display: block; margin: 1em 0; border-radius: 0.375rem;" />`;
        } else if (format === 'left-aligned') {
            htmlImage = `<img src="${imageUrl}" alt="${altText}" style="float: left; margin: 0 1.5em 1em 0; max-width: 50%; height: auto; border-radius: 0.375rem;" />`;
        } else if (format === 'right-aligned') {
            htmlImage = `<img src="${imageUrl}" alt="${altText}" style="float: right; margin: 0 0 1em 1.5em; max-width: 50%; height: auto; border-radius: 0.375rem;" />`;
        } else if (format === 'full-width-captioned') {
            htmlImage = `
                <figure style="width: 100%; margin: 1em 0; text-align: center; display: inline-block;">
                    <img src="${imageUrl}" alt="${altText}" style="width: 100%; height: auto; border-radius: 0.375rem;" />
                    <figcaption style="font-size: 0.9em; color: #666; margin-top: 0.5em; font-style: italic;">${caption}</figcaption>
                </figure>
                <p></p>
            `;
        }

        if (editingElement) {
            // Update existing element
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlImage.trim();
            const newElement = tempDiv.firstChild;
            editingElement.parentNode.replaceChild(newElement, editingElement);
            
            // Trigger content update
            if (highlightEditorRef.current) highlightEditorRef.current.focus();
            const event = new Event('input', { bubbles: true });
            newElement.parentElement.dispatchEvent(event);
            
            toast.success('Image updated');
        } else {
            // Determine which editor ref to use
            let editorRef = null;
            switch (currentEditor) {
                case 'highlight': editorRef = highlightEditorRef; break;
                case 'shortDescription': editorRef = shortDescriptionEditorRef; break;
                case 'content': editorRef = contentEditorRef; break;
                default: break;
            }

            if (editorRef && editorRef.current) {
                editorRef.current.insertHTML(htmlImage);
                toast.success('Image inserted');
            } else {
                // Fallback if ref is not available (e.g., editor not mounted yet)
                const currentEditorField = currentEditor;
                const currentContent = formData[currentEditorField] || '';
                const newContent = currentContent + (currentContent ? '<br>' : '') + htmlImage;
                setFormData(prev => ({ ...prev, [currentEditorField]: newContent }));
                toast.success('Image inserted');
            }
        }

        setShowFormatModal(false);
        setPhotoToFormat(null);
        setEditingElement(null);
        setShowImageModal(prev => ({ ...prev, editor: false }));
        setCurrentEditor(null);
    };

    useEffect(() => {
        fetchNewsData();
        fetchDropdownData();
        fetchAlbums();
        fetchAllPhotos();
    }, [id]);

    useEffect(() => {
        filterPhotosByAlbum();
    }, [selectedAlbum, photos]);

    // Image handling functions
    const openEditorImageModal = (editorType) => {
        setCurrentEditor(editorType);
        setShowImageModal(prev => ({
            ...prev,
            editor: true
        }));
    };

    const openImageModal = (imageType) => {
        setSelectedImageType(imageType);
        setShowImageModal(prev => ({
            ...prev,
            [imageType]: true
        }));
    };

    // Common Modal Component for Image Selection
    const ImageSelectionModal = ({ show, onClose, onSelect, title }) => {
        const [imageSearch, setImageSearch] = useState('');
        const [showUploadSection, setShowUploadSection] = useState(false);

        if (!show) return null;

        // Filter photos based on search
        const searchedPhotos = imageSearch ? filteredPhotos.filter(photo =>
            photo.filename.toLowerCase().includes(imageSearch.toLowerCase()) ||
            (photo.caption && photo.caption.toLowerCase().includes(imageSearch.toLowerCase())) ||
            (photo.source && photo.source.toLowerCase().includes(imageSearch.toLowerCase()))
        ) : filteredPhotos;

        return (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            {/* Upload Section */}
                            <div className="card mb-4">
                                <div className="card-header">
                                    <button
                                        className="btn btn-link text-decoration-none"
                                        onClick={() => setShowUploadSection(!showUploadSection)}
                                    >
                                        {showUploadSection ? '▲' : '▼'} Upload New Image
                                    </button>
                                </div>
                                {showUploadSection && (
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Select Image</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                                    />
                                                    {uploadFile && (
                                                        <small className="text-muted">
                                                            Selected: {uploadFile.name}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Album (Optional)</label>
                                                    <select
                                                        className="form-control"
                                                        value={uploadAlbumId}
                                                        onChange={(e) => setUploadAlbumId(e.target.value)}
                                                    >
                                                        <option value="">Select Album</option>
                                                        {albums.map(album => (
                                                            <option key={album.id} value={album.id}>
                                                                {album.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-2 d-flex align-items-end">
                                                <button
                                                    className="btn btn-primary w-100"
                                                    onClick={handleUploadImage}
                                                    disabled={uploading || !uploadFile}
                                                >
                                                    {uploading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            Uploading...
                                                        </>
                                                    ) : 'Upload'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search and Filter Section */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Filter Images</label>
                                    <select
                                        className="form-control"
                                        value={selectedAlbum}
                                        onChange={handleAlbumChange}
                                    >
                                        <option value="all">All Images ({photos.length})</option>
                                        <optgroup label="By Source">
                                            <option value="article">Articles ({photos.filter(p => p.source === 'article').length})</option>
                                            <option value="blog">Blogs ({photos.filter(p => p.source === 'blog').length})</option>
                                            <option value="news">News ({photos.filter(p => p.source === 'news').length})</option>
                                            <option value="photo">Gallery Photos ({photos.filter(p => p.source === 'photo').length})</option>
                                            <option value="other">Orphaned/Other ({photos.filter(p => p.source === 'other').length})</option>
                                        </optgroup>
                                        <optgroup label="By Album">
                                            {albums.map(album => {
                                                const albumImageCount = photos.filter(p => p.albumId === album.id || p.albumId === album.id.toString()).length;
                                                return (
                                                    <option key={album.id} value={album.id}>
                                                        {album.name} ({albumImageCount})
                                                    </option>
                                                );
                                            })}
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Search Images</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by filename, caption, or source..."
                                        value={imageSearch}
                                        onChange={(e) => setImageSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Image Count */}
                            <div className="mb-3">
                                <small className="text-muted">
                                    Showing {searchedPhotos.length} of {photos.length} total images
                                    {selectedAlbum !== 'all' &&
                                        ` • Filtered: ${getSourceLabel(selectedAlbum)}`
                                    }
                                    {imageSearch && ` • Search: "${imageSearch}"`}
                                </small>
                            </div>

                            {/* Images Grid */}
                            {searchedPhotos.length === 0 ? (
                                <div className="text-center text-muted py-4">
                                    {imageSearch ?
                                        `No images found matching "${imageSearch}"` :
                                        'No images found. Try uploading some images!'}
                                </div>
                            ) : (
                                <div className="row">
                                    {searchedPhotos.map(photo => (
                                        <div key={photo.id} className="col-md-3 mb-3">
                                            <div
                                                className="card cursor-pointer h-100"
                                                onClick={() => onSelect(photo)}
                                                style={{ cursor: 'pointer' }}
                                                title={`Click to select\nSource: ${getSourceLabel(photo.source)}\n${photo.caption || 'No caption'}`}
                                            >
                                                <div className="position-relative">
                                                    <img
                                                        src={getImageUrl(photo.imageUrl)}
                                                        className="card-img-top"
                                                        alt={photo.caption || 'Photo'}
                                                        style={{ height: '150px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.jpg';
                                                            e.target.onerror = null;
                                                        }}
                                                    />
                                                    <span className={`badge position-absolute top-0 end-0 m-1 ${getSourceBadgeClass(photo.source)}`}>
                                                        {getSourceLabel(photo.source)}
                                                    </span>
                                                </div>
                                                <div className="card-body p-2">
                                                    <small className="card-text d-block text-truncate" title={photo.caption}>
                                                        {photo.caption || 'No caption'}
                                                    </small>
                                                    {photo.albumId && (
                                                        <small className="text-muted d-block">
                                                            Album: {albums.find(a => a.id === photo.albumId)?.name || 'Unknown'}
                                                        </small>
                                                    )}
                                                    <small className="text-muted d-block text-truncate" title={photo.filename}>
                                                        {photo.filename}
                                                    </small>
                                                    <small className="text-muted d-block">
                                                        Added: {new Date(photo.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const closeImageModal = () => {
        setShowImageModal({
            leadImage: false,
            thumbImage: false,
            metaImage: false,
            editor: false
        });
        setSelectedImageType('');
        setCurrentEditor(null);
    };

    const handleImageSelect = (photo) => {
        setSelectedImages(prev => ({
            ...prev,
            [selectedImageType]: photo
        }));
        setFiles(prev => ({
            ...prev,
            [selectedImageType]: null
        }));
        closeImageModal();
    };

    const fetchNewsData = async () => {
        try {
            setFetching(true);
            console.log(`Fetching news with ID: ${id} from ${API_URL}/api/news/${id}`);

            const response = await axios.get(`${API_URL}/api/news/${id}`);
            console.log('News data received:', response.data);

            const news = response.data;

            // Debug: Check what data we're getting
            console.log('News object keys:', Object.keys(news));
            console.log('News.Tags:', news.Tags);
            console.log('News.Categories:', news.Categories);

            setFormData({
                newsHeadline: news.newsHeadline || '',
                highlight: news.highlight || '',
                alternativeHeadline: news.alternativeHeadline || '',
                authorId: news.authorId?.toString() || '',
                shortDescription: news.shortDescription || '',
                content: news.content || '',
                imageCaption: news.imageCaption || '',
                videoLink: news.videoLink || '',
                newsSchedule: news.newsSchedule || '',
                metaTitle: news.metaTitle || '',
                metaKeywords: news.metaKeywords || '',
                metaDescription: news.metaDescription || '',
                status: news.status || 'draft',
                tagIds: (news.Tags || []).map(tag => tag.id?.toString()).filter(Boolean),
                tagNames: (news.Tags || []).map(tag => tag.name).filter(Boolean),
                categoryIds: (news.Categories || []).map(cat => cat.id?.toString()).filter(Boolean)
            });

            setAuthorSearch(news.authorId?.name || news.Authors?.name || '');

            setCurrentImages({
                leadImage: news.leadImage || '',
                thumbImage: news.thumbImage || '',
                metaImage: news.metaImage || ''
            });

        } catch (error) {
            console.error('Error fetching news:', error);
            console.error('Error response:', error.response?.data);
            toast.error('Failed to load news data');
            navigate('/admin/news');
        } finally {
            setFetching(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [authorsRes, tagsRes, categoriesRes] = await Promise.all([
                axios.get(`${API_URL}/api/authors`, { params: { limit: 1000 } }),
                axios.get(`${API_URL}/api/tags`),
                axios.get(`${API_URL}/api/menus`)
            ]);

            // Handle different response formats
            setAuthors(extractArrayFromResponse(authorsRes.data, 'authors'));
            setTags(extractArrayFromResponse(tagsRes.data, 'tags'));

            let categoriesData = [];
            if (categoriesRes.data && categoriesRes.data.data) {
                categoriesData = categoriesRes.data.data;
            } else if (Array.isArray(categoriesRes.data)) {
                categoriesData = categoriesRes.data;
            }
            const processedCategories = processCategories(categoriesData);
            setCategories(processedCategories);

        } catch (error) {
            console.error('Error fetching dropdown data:', error);
            toast.error('Failed to load dropdown data');
        }
    };

    // Image handling functions from NewsCreate.jsx
    const getSourceBadgeClass = (source) => {
        const classes = {
            'article': 'bg-info',
            'blog': 'bg-success',
            'news': 'bg-warning',
            'photo': 'bg-primary',
            'other': 'bg-secondary'
        };
        return classes[source] || 'bg-secondary';
    };

    const getSourceLabel = (source) => {
        const labels = {
            'article': 'Article',
            'blog': 'Blog',
            'news': 'News',
            'photo': 'Gallery',
            'other': 'Other'
        };
        return labels[source] || source;
    };

    // Upload handler
    const handleUploadImage = async () => {
        if (!uploadFile) {
            toast.error('Please select a file to upload');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('images', uploadFile);

            if (uploadAlbumId) {
                formData.append('albumId', uploadAlbumId);
            }

            const response = await axios.post(`${API_URL}/api/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Image uploaded successfully!');

            // Reset upload state
            setUploadFile(null);
            setUploadAlbumId('');

            // Refresh the photos list
            await fetchAllPhotos();

        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    // Fetch albums
    const fetchAlbums = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/albums`);
            const albumsData = response.data.albums || response.data || [];
            setAlbums(albumsData);
        } catch (error) {
            console.error('Error fetching albums:', error);
            toast.error('Failed to load albums');
        }
    };

    // Fetch all photos
    const fetchAllPhotos = async () => {
        try {
            // First, get total count
            const countResponse = await axios.get(`${API_URL}/api/all/images`, {
                params: { limit: 1 }, // Just to get total count
                headers: { Authorization: `Bearer ${token}` }
            });

            const totalCount = countResponse.data.pagination?.totalCount || 0;
            console.log(`Total images available: ${totalCount}`);

            // Calculate how many pages we need to fetch
            const limit = 100; // Fetch 100 per request
            const totalPages = Math.ceil(totalCount / limit);

            // Fetch all pages
            const allImages = [];

            for (let page = 1; page <= totalPages; page++) {
                try {
                    const response = await axios.get(`${API_URL}/api/all/images`, {
                        params: {
                            page: page,
                            limit: limit
                        },
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (response.data.images && Array.isArray(response.data.images)) {
                        allImages.push(...response.data.images);
                    }
                    console.log(`Fetched page ${page}/${totalPages}: ${response.data.images?.length || 0} images`);
                } catch (pageError) {
                    console.error(`Error fetching page ${page}:`, pageError);
                }
            }

            console.log(`Total images fetched: ${allImages.length}`);

            // Filter out invalid images
            const validPhotos = allImages.filter(photo =>
                photo &&
                (photo.imageUrl || photo.image) &&
                photo.filename
            ).map(photo => ({
                id: photo.id,
                filename: photo.filename,
                imageUrl: photo.imageUrl || photo.image,
                caption: photo.caption || '',
                albumId: photo.albumId || null,
                source: photo.source || 'other',
                isManaged: photo.isManaged !== undefined ? photo.isManaged : false,
                createdAt: photo.createdAt
            }));

            // Sort by creation date (newest first)
            validPhotos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setPhotos(validPhotos);
            setFilteredPhotos(validPhotos);
            console.log(`Loaded ${validPhotos.length} valid images`);

        } catch (error) {
            console.error('Error fetching photos:', error);
            toast.error('Failed to load photos from centralized registry');
            setPhotos([]);
            setFilteredPhotos([]);
        }
    };

    // Filter photos by album
    const filterPhotosByAlbum = () => {
        if (selectedAlbum === 'all') {
            setFilteredPhotos(photos);
        } else if (['article', 'blog', 'news', 'photo', 'other'].includes(selectedAlbum)) {
            // Filter by source type
            const filtered = photos.filter(photo =>
                photo.source && photo.source.toLowerCase() === selectedAlbum.toLowerCase()
            );
            setFilteredPhotos(filtered);
        } else {
            // Filter by album ID
            const albumId = parseInt(selectedAlbum);
            const filtered = photos.filter(photo =>
                photo.albumId === albumId ||
                (photo.albumId && photo.albumId.toString() === selectedAlbum)
            );
            setFilteredPhotos(filtered);
        }
    };

    // Add these functions in NewsEdit component

    const processCategories = (categories) => {
        if (!Array.isArray(categories)) return [];
        const categoryMap = {};
        const rootCategories = [];

        categories.forEach(category => {
            categoryMap[category.id] = { ...category, children: [] };
        });

        categories.forEach(category => {
            if (category.parentId && categoryMap[category.parentId]) {
                categoryMap[category.parentId].children.push(categoryMap[category.id]);
            } else {
                rootCategories.push(categoryMap[category.id]);
            }
        });

        return rootCategories;
    };

    const renderCategoryOptions = (categories, level = 0) => {
        return categories.map(category => (
            <React.Fragment key={category.id}>
                <option value={category.id}>
                    {'-'.repeat(level * 2)} {category.name || category.title}
                </option>
                {category.children && category.children.length > 0 &&
                    renderCategoryOptions(category.children, level + 1)
                }
            </React.Fragment>
        ));
    };

    // Helper function to extract array from different response formats
    const extractArrayFromResponse = (data, key) => {
        console.log(`Extracting ${key} from:`, data);

        if (Array.isArray(data)) {
            return data;
        } else if (data && Array.isArray(data[key])) {
            return data[key];
        } else if (data && data.data && Array.isArray(data.data)) {
            return data.data;
        } else if (data && data[key] && Array.isArray(data[key])) {
            return data[key];
        }
        console.warn(`No array found in response for ${key}:`, data);
        return [];
    };

    const handleAuthorSelect = (author) => {
        setFormData(prev => ({
            ...prev,
            authorId: author.id
        }));
        setAuthorSearch(author.name);
        setShowAuthorDropdown(false);
    };

    const handleTagSelect = (tag) => {
        if (!formData.tagIds.includes(tag.id.toString())) {
            setFormData(prev => ({
                ...prev,
                tagIds: [...prev.tagIds, tag.id.toString()],
                tagNames: [...prev.tagNames, tag.name]
            }));
        }
        setTagSearch('');
        setShowTagDropdown(false);
    };

    const removeTag = (tagId) => {
        const tagIdStr = tagId.toString();
        setFormData(prev => {
            const index = prev.tagIds.indexOf(tagIdStr);
            if (index === -1) return prev;
            
            const newTagIds = [...prev.tagIds];
            const newTagNames = [...prev.tagNames];
            newTagIds.splice(index, 1);
            newTagNames.splice(index, 1);
            
            return {
                ...prev,
                tagIds: newTagIds,
                tagNames: newTagNames
            };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditorChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files: fileList } = e.target;
        setFiles(prev => ({
            ...prev,
            [name]: fileList[0]
        }));
        setSelectedImages(prev => ({
            ...prev,
            [name]: null
        }));
    };

    const handleMultiSelect = (e, field) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            [field]: selectedOptions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();

            // Append form data
            Object.keys(formData).forEach(key => {
                if (key === 'tagIds' || key === 'categoryIds') {
                    // Send as JSON string
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (key === 'tagNames') {
                    // Skip display-only field
                    return;
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            // Append files or selected image paths
            Object.keys(files).forEach(key => {
                if (files[key]) {
                    submitData.append(key, files[key]);
                }
            });

            Object.keys(selectedImages).forEach(key => {
                if (selectedImages[key]) {
                    submitData.append(`${key}Path`, selectedImages[key].imageUrl);
                }
            });

            submitData.append('newsType', 'video');

            const response = await axios.patch(`${API_URL}/api/news/${id}`, submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('News updated successfully!');
            navigate('/admin/news');

        } catch (error) {
            console.error('Error updating news:', error);
            toast.error(error.response?.data?.message || 'Failed to update news');
        } finally {
            setLoading(false);
        }
    };

    // Image preview component
    const ImagePreview = ({ imageType }) => {
        const file = files[imageType];
        const selectedImage = selectedImages[imageType];
        const currentImage = currentImages[imageType];

        if (file) {
            return (
                <div className="mt-2">
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxHeight: '100px' }}
                    />
                    <div className="text-muted small">New upload</div>
                </div>
            );
        }

        if (selectedImage) {
            return (
                <div className="mt-2">
                    <img
                        src={getImageUrl(selectedImage.imageUrl)}
                        alt="Selected"
                        className="img-thumbnail"
                        style={{ maxHeight: '100px' }}
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                        }}
                    />
                    <div className="text-muted small">From gallery</div>
                </div>
            );
        }

        if (currentImage) {
            return (
                <div className="mt-2">
                    <img
                        src={getImageUrl(currentImage)}
                        alt="Current"
                        className="img-thumbnail"
                        style={{ maxHeight: '100px' }}
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                        }}
                    />
                    <div className="text-muted small">Current image</div>
                </div>
            );
        }

        return null;
    };

    if (fetching) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid custom-font-initial">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Edit Video News Post</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Basic Information */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <h5>Basic Information</h5>
                                        <hr />
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">News Headline *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="newsHeadline"
                                                value={formData.newsHeadline}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Alternative Headline</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="alternativeHeadline"
                                                value={formData.alternativeHeadline}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Highlight with WYSIWYGEditor */}
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="form-label">Highlight</label>
                                            <WYSIWYGEditor
                                                ref={highlightEditorRef}
                                                value={formData.highlight}
                                                onChange={(value) => handleEditorChange('highlight', value)}
                                                onEditImage={handleEditImage}
                                                placeholder="Enter highlight text..."
                                                height={200}
                                                onImageClick={() => openEditorImageModal('highlight')}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Author *</label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search author..."
                                                    value={authorSearch}
                                                    onChange={(e) => {
                                                        setAuthorSearch(e.target.value);
                                                        setShowAuthorDropdown(true);
                                                    }}
                                                    onFocus={() => setShowAuthorDropdown(true)}
                                                    onBlur={() => setTimeout(() => setShowAuthorDropdown(false), 200)}
                                                    required
                                                />
                                                {showAuthorDropdown && (
                                                    <div className="dropdown-menu show w-100" style={{ maxHeight: '300px', overflowY: 'auto', zIndex: 1060 }}>
                                                        {authors.filter(a => a.name.toLowerCase().includes(authorSearch.toLowerCase())).length > 0 ? (
                                                            authors.filter(a => a.name.toLowerCase().includes(authorSearch.toLowerCase())).map(author => (
                                                                <button
                                                                    key={author.id}
                                                                    type="button"
                                                                    className="dropdown-item"
                                                                    onClick={() => handleAuthorSelect(author)}
                                                                >
                                                                    {author.name}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="dropdown-item disabled">No authors found</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <h5>Content</h5>
                                        <hr />
                                    </div>

                                    {/* Short Description with WYSIWYGEditor */}
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="form-label">Short Description</label>
                                            <WYSIWYGEditor
                                                ref={shortDescriptionEditorRef}
                                                value={formData.shortDescription}
                                                onChange={(value) => handleEditorChange('shortDescription', value)}
                                                onEditImage={handleEditImage}
                                                placeholder="Enter short description..."
                                                height={200}
                                                onImageClick={() => openEditorImageModal('shortDescription')}
                                            />
                                        </div>
                                    </div>

                                    {/* Main Content with WYSIWYGEditor */}
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="form-label">Content *</label>
                                            <WYSIWYGEditor
                                                ref={contentEditorRef}
                                                value={formData.content}
                                                onChange={(value) => handleEditorChange('content', value)}
                                                onEditImage={handleEditImage}
                                                placeholder="Start writing your news content..."
                                                height={400}
                                                onImageClick={() => openEditorImageModal('content')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Media Section */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <h5>Media</h5>
                                        <hr />
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Lead Image</label>
                                            <div className="d-flex gap-2 mb-2">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    name="leadImage"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => openImageModal('leadImage')}
                                                >
                                                    Choose
                                                </button>
                                            </div>
                                            <ImagePreview imageType="leadImage" />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Thumbnail Image</label>
                                            <div className="d-flex gap-2 mb-2">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    name="thumbImage"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => openImageModal('thumbImage')}
                                                >
                                                    Choose
                                                </button>
                                            </div>
                                            <ImagePreview imageType="thumbImage" />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Image Caption</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="imageCaption"
                                                value={formData.imageCaption}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="form-label">YouTube Video Link</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                name="videoLink"
                                                value={formData.videoLink}
                                                onChange={handleInputChange}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Categories & Tags */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <h5>Categories & Tags</h5>
                                        <hr />
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Categories</label>
                                            <select
                                                className="form-control"
                                                multiple
                                                value={formData.categoryIds}
                                                onChange={(e) => handleMultiSelect(e, 'categoryIds')}
                                                size="6"
                                            >
                                                {categories.length > 0 ? (
                                                    renderCategoryOptions(categories)
                                                ) : (
                                                    <option value="">No categories available</option>
                                                )}
                                            </select>
                                            <small className="text-muted">Hold Ctrl to select multiple categories</small>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Tags</label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search tags..."
                                                    value={tagSearch}
                                                    onChange={(e) => {
                                                        setTagSearch(e.target.value);
                                                        setShowTagDropdown(true);
                                                    }}
                                                    onFocus={() => setShowTagDropdown(true)}
                                                    onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                                                />
                                                {showTagDropdown && (
                                                    <div className="dropdown-menu show w-100" style={{ maxHeight: '300px', overflowY: 'auto', zIndex: 1060 }}>
                                                        {tags.filter(t => t.name.toLowerCase().includes(tagSearch.toLowerCase())).length > 0 ? (
                                                            tags.filter(t => t.name.toLowerCase().includes(tagSearch.toLowerCase())).map(tag => (
                                                                <button
                                                                    key={tag.id}
                                                                    type="button"
                                                                    className="dropdown-item"
                                                                    onClick={() => handleTagSelect(tag)}
                                                                >
                                                                    {tag.name}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="dropdown-item disabled">No tags found</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {formData.tagNames.length > 0 && (
                                                <div className="mt-2">
                                                    {formData.tagNames.map((tagName, index) => (
                                                        <span key={formData.tagIds[index]} className="badge bg-primary me-1 mb-1">
                                                            {tagName}
                                                            <button
                                                                type="button"
                                                                className="btn-close btn-close-white ms-1"
                                                                style={{ fontSize: '0.7rem' }}
                                                                onClick={() => removeTag(formData.tagIds[index])}
                                                            ></button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* SEO Section */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <h5>SEO Settings</h5>
                                        <hr />
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Meta Image</label>
                                            <div className="d-flex gap-2 mb-2">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    name="metaImage"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => openImageModal('metaImage')}
                                                >
                                                    Choose
                                                </button>
                                            </div>
                                            <ImagePreview imageType="metaImage" />
                                        </div>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="mb-3">
                                            <label className="form-label">Meta Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="metaTitle"
                                                value={formData.metaTitle}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="form-label">Meta Description</label>
                                            <textarea
                                                className="form-control"
                                                name="metaDescription"
                                                rows="3"
                                                value={formData.metaDescription}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="form-label">Meta Keywords</label>
                                            <textarea
                                                className="form-control"
                                                name="metaKeywords"
                                                rows="2"
                                                value={formData.metaKeywords}
                                                onChange={handleInputChange}
                                                placeholder="keyword1, keyword2, keyword3"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-control"
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                                <option value="scheduled">Scheduled</option>
                                            </select>
                                        </div>
                                    </div>

                                    {formData.status === 'scheduled' && (
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Schedule Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    name="newsSchedule"
                                                    value={formData.newsSchedule}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary me-2"
                                            disabled={loading}
                                        >
                                            {loading ? 'Updating...' : 'Update News Post'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/admin/news')}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Image Selection Modals */}
            <ImageSelectionModal
                show={showImageModal.editor}
                onClose={closeImageModal}
                onSelect={handleEditorImageSelect}
                title="Select Image for Editor"
            />

            <ImageSelectionModal
                show={showImageModal.leadImage}
                onClose={closeImageModal}
                onSelect={handleImageSelect}
                title="Select Lead Image"
            />

            <ImageSelectionModal
                show={showImageModal.thumbImage}
                onClose={closeImageModal}
                onSelect={handleImageSelect}
                title="Select Thumbnail Image"
            />

            <ImageSelectionModal
                show={showImageModal.metaImage}
                onClose={closeImageModal}
                onSelect={handleImageSelect}
                title="Select Meta Image"
            />
            
            {/* Image Format Modal */}
            <ImageFormatModal 
                show={showFormatModal}
                onHide={() => setShowFormatModal(false)}
                onConfirm={handleFormatConfirm}
                photo={photoToFormat}
            />
        </div>
    );
};

export default VideoNewsEdit;