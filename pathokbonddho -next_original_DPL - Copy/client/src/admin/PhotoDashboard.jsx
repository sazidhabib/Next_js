import React, { useEffect, useState } from "react";
import { Button, Table, Spinner, Image, Badge, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import PhotoFormModal from "./PhotoFormModal";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../store/auth";

// Update API endpoints
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;


const PhotoDashboard = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [editPhoto, setEditPhoto] = useState(null);
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [deleteFromFS, setDeleteFromFS] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sourceFilter, setSourceFilter] = useState(""); // Add filter for source type
    const { token } = useAuth();

    const fetchAllImages = async () => {
        setLoading(true);
        try {
            const params = {
                page: page,
                limit: 20, // Reduced for better performance
            };

            if (sourceFilter) {
                params.sourceType = sourceFilter;
            }

            const res = await axios.get(`${API_BASE_URL}/all/images`, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("All Images Response:", res.data);

            const imagesData = res.data.images || [];

            setImages(imagesData);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setTotalCount(res.data.pagination?.totalCount || 0);
        } catch (err) {
            toast.error("Failed to fetch images");
            console.error("Fetch error:", err);
            console.error("Request URL:", `${API_BASE_URL}/all/images`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllImages();
    }, [page, sourceFilter]); // Add sourceFilter to dependencies

    const handleDelete = async () => {
        try {
            let deleteUrl;

            console.log('Image to delete:', imageToDelete);

            // ALWAYS use the registry endpoint for deletion
            // The registry endpoint handles both photos and other images
            deleteUrl = `${API_BASE_URL}/registry/${imageToDelete.id}`;

            console.log('Delete URL:', deleteUrl);

            const response = await axios.delete(deleteUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    deleteFromFS: deleteFromFS
                }
            });

            toast.success("Image deleted successfully");
            setConfirmModalShow(false);
            setDeleteFromFS(false);
            fetchAllImages();

        } catch (err) {
            console.error("Delete error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                url: err.config?.url
            });

            toast.error(err.response?.data?.message || "Failed to delete image");
        }
    };
    const handleAddToGallery = async (image) => {
        try {
            await axios.post(`${API_BASE_URL}/add-to-gallery`, {
                filename: image.filename,
                caption: image.caption || '',
                albumId: image.albumId || null
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Image added to gallery");
            fetchAllImages();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add image to gallery");
        }
    };

    const handleConvertToPhoto = async (image) => {
        try {
            await axios.post(`${API_BASE_URL}/convert-to-photo`, {
                registryId: image.id,
                caption: image.caption || '',
                albumId: image.albumId || null
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Image converted to photo");
            fetchAllImages();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to convert image");
        }
    };

    const handlePhotoSubmit = async (photoData) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (editPhoto) {
                await axios.patch(`${API_BASE_URL}/${editPhoto.id}`, photoData, config);
                toast.success("Photo updated successfully");
            } else {
                await axios.post(`${API_BASE_URL}/upload`, photoData, config);
                toast.success("Photo created successfully");
            }
            setModalShow(false);
            fetchAllImages();
        } catch (err) {
            console.error("Submit error details:", err.response?.data);
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    // Safe image URL construction
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        // Remove leading slash if present to avoid double slashes
        const cleanUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
        return `${import.meta.env.VITE_API_BASE_URL}/${cleanUrl}`;
    };

    const getSourceBadge = (source) => {
        const variants = {
            'photo': 'primary',
            'other': 'secondary',
            'blog': 'success',
            'article': 'info',
            'news': 'warning'
        };

        const labels = {
            'photo': 'Gallery',
            'other': 'Other',
            'blog': 'Blog',
            'article': 'Article',
            'news': 'News'
        };

        return (
            <Badge bg={variants[source] || 'secondary'}>
                {labels[source] || source}
            </Badge>
        );
    };

    const getSourceTitle = (image) => {
        if (image.relatedEntity) {
            if (image.relatedEntity.article) {
                return `Article: ${image.relatedEntity.article.title}`;
            }
            if (image.relatedEntity.blog) {
                return `Blog: ${image.relatedEntity.blog.title}`;
            }
            if (image.relatedEntity.news) {
                return `News: ${image.relatedEntity.news.title}`;
            }
            if (image.relatedEntity.photo) {
                return `Photo: ${image.relatedEntity.photo.caption || 'No caption'}`;
            }
        }
        return image.source === 'other' ? 'Orphaned Image' : 'Image';
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="container mt-4 custom-font-initial">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4>Image Management Dashboard</h4>
                    <p className="text-muted mb-0">
                        Total: {totalCount} images | Showing page {page} of {totalPages}
                    </p>
                </div>
                <Button onClick={() => { setEditPhoto(null); setModalShow(true); }}>
                    + Upload New Photo
                </Button>
            </div>

            {/* Filters */}
            <div className="row mb-3">
                <div className="col-md-3">
                    <Form.Select
                        value={sourceFilter}
                        onChange={(e) => {
                            setSourceFilter(e.target.value);
                            setPage(1); // Reset to first page when filter changes
                        }}
                    >
                        <option value="">All Sources</option>
                        <option value="article">Articles</option>
                        <option value="blog">Blogs</option>
                        <option value="news">News</option>
                        <option value="photo">Photo Gallery</option>
                        <option value="other">Other/Orphaned</option>
                    </Form.Select>
                </div>
                <div className="col-md-9 d-flex align-items-center justify-content-end">
                    <small className="text-muted">
                        Use filters to find images from specific sources
                    </small>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading images...</p>
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Preview</th>
                                <th>Filename</th>
                                <th>Source</th>
                                <th>Details</th>
                                <th>Size</th>
                                <th>Uploaded</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {images && images.length > 0 ? (
                                images.map((image, index) => (
                                    <tr key={image.id}>
                                        <td>{(page - 1) * 20 + index + 1}</td>
                                        <td>
                                            <Image
                                                src={getImageUrl(image.imageUrl)}
                                                thumbnail
                                                width={80}
                                                height={60}
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    if (e.target.nextSibling) {
                                                        e.target.nextSibling.style.display = 'inline';
                                                    }
                                                }}
                                            />
                                            {!image.imageUrl && <span className="text-muted">No Preview</span>}
                                        </td>
                                        <td>
                                            <div>
                                                <strong>{image.filename}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    {image.imageUrl}
                                                </small>
                                            </div>
                                        </td>
                                        <td>{getSourceBadge(image.source)}</td>
                                        <td>
                                            <div>
                                                <small>
                                                    {getSourceTitle(image)}
                                                </small>
                                                <br />
                                                {image.caption && (
                                                    <small className="text-muted">
                                                        Caption: {image.caption}
                                                    </small>
                                                )}
                                                {image.albumName && (
                                                    <small className="d-block text-muted">
                                                        Album: {image.albumName}
                                                    </small>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <small>
                                                {formatFileSize(image.fileSize)}
                                            </small>
                                        </td>
                                        <td>
                                            <small>
                                                {new Date(image.createdAt).toLocaleDateString()}
                                            </small>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column gap-1">
                                                {image.source === 'other' ? (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleConvertToPhoto(image)}
                                                        className="me-1"
                                                    >
                                                        Add to Gallery
                                                    </Button>
                                                ) : image.source === 'photo' ? (
                                                    <>
                                                        <Button
                                                            variant="warning"
                                                            size="sm"
                                                            onClick={() => { setEditPhoto(image); setModalShow(true); }}
                                                            className="me-1 mb-1"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            onClick={() => {
                                                                // Copy image URL to clipboard
                                                                navigator.clipboard.writeText(getImageUrl(image.imageUrl));
                                                                toast.info("Image URL copied to clipboard");
                                                            }}
                                                            className="me-1 mb-1"
                                                        >
                                                            Copy URL
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleAddToGallery(image)}
                                                        className="me-1"
                                                    >
                                                        Reuse in Gallery
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setImageToDelete(image);
                                                        setConfirmModalShow(true);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        {sourceFilter ?
                                            `No images found from ${sourceFilter} source` :
                                            "No images found. Upload some images to get started."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center mt-3">
                            <Button
                                variant="outline-primary"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="me-2"
                            >
                                ← Previous
                            </Button>
                            <span className="mx-3">
                                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                            </span>
                            <Button
                                variant="outline-primary"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next →
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <PhotoFormModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                onSubmit={handlePhotoSubmit}
                editPhoto={editPhoto}
            />

            <ConfirmationModal
                show={confirmModalShow}
                onHide={() => {
                    setConfirmModalShow(false);
                    setDeleteFromFS(false);
                }}
                onConfirm={handleDelete}
                title="Delete Image"
                message={
                    <div>
                        <p>Are you sure you want to delete this image?</p>
                        <p className="text-muted">
                            <strong>Filename:</strong> {imageToDelete?.filename}<br />
                            <strong>Source:</strong> {imageToDelete?.source}<br />
                            <strong>Path:</strong> {imageToDelete?.imageUrl}
                        </p>
                        <Form.Check
                            type="checkbox"
                            label="Also delete from filesystem"
                            checked={deleteFromFS}
                            onChange={(e) => setDeleteFromFS(e.target.checked)}
                        />
                        <small className="text-muted d-block mt-2">
                            {deleteFromFS
                                ? "⚠️ This will permanently remove the image file from the server"
                                : "This will only remove the image from the registry/gallery"
                            }
                        </small>
                    </div>
                }
            />
        </div>
    );
};

export default PhotoDashboard;