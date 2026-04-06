import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../store/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form } from 'react-bootstrap';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/videos`;
console.log("Full API URL:", API_BASE_URL);

const VideoDashboard = () => {
    const [videos, setVideos] = useState([]);
    const [newVideo, setNewVideo] = useState({
        title: '',
        description: '',
        src: '',
        thumbnail: null
    });
    const [editId, setEditId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 8;
    const { token } = useAuth();

    // Pagination logic
    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);
    const totalPages = Math.ceil(videos.length / videosPerPage);

    // Fetch all videos
    const fetchVideos = async () => {
        try {
            const res = await axios.get(API_BASE_URL);
            console.log("Fetch response:", res); // full Axios response
            console.log("Fetched videos:", res.data); // response body

            if (res.data.success && Array.isArray(res.data.data)) {
                setVideos(res.data.data);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch videos');
            setVideos([]);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const handleInputChange = (e) => {
        setNewVideo({ ...newVideo, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setNewVideo({ ...newVideo, thumbnail: e.target.files[0] });
    };

    const resetForm = () => {
        setNewVideo({ title: '', description: '', src: '', thumbnail: null });
        setEditId(null);
    };

    // Create or update a video
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", newVideo);

        if (!newVideo.title.trim() || !newVideo.src.trim()) {
            toast.error("Title and YouTube URL are required!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', newVideo.title);
            formData.append('description', newVideo.description);
            formData.append('src', newVideo.src);
            if (newVideo.thumbnail) {
                formData.append('thumbnail', newVideo.thumbnail);
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            let response;
            if (editId) {
                response = await axios.patch(`${API_BASE_URL}/${editId}`, formData, config);
            } else {

                response = await axios.post(API_BASE_URL, formData, config);
                console.log("Creating video with formData...");
            }

            console.log("Create/Update response:", response);
            console.log("Create/Update response data:", response.data);

            toast.success(`Video ${editId ? 'updated' : 'added'} successfully`);
            await fetchVideos();
            resetForm();
        } catch (error) {
            console.error("Full error:", error);
            console.error("Error response:", error.response);
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        }
    };





    const handleEdit = (video) => {
        setNewVideo({
            title: video.title,
            description: video.description,
            src: video.src,
            thumbnail: null // Reset thumbnail on edit
        });
        setEditId(video._id);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Video deleted');
            fetchVideos();
        } catch (error) {
            toast.error('Failed to delete video');
        } finally {
            setShowConfirm(false);
            setDeleteId(null);
        }
    };

    // Extract YouTube ID for thumbnail
    const getYouTubeThumbnail = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ?
            `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg` :
            '/default-thumbnail.jpg';
    };

    return (
        <div className="container custom-font-initial mt-5">
            <h2 className="mb-4">{editId ? 'Edit Video' : 'Add New Video'}</h2>
            <Form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
            }}>
                <Form.Group className="mb-3">
                    <Form.Label>Title*</Form.Label>
                    <Form.Control
                        name="title"
                        value={newVideo.title}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={newVideo.description}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>YouTube URL*</Form.Label>
                    <Form.Control
                        name="src"
                        value={newVideo.src}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Thumbnail (Optional)</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Form.Group>

                <Button type="submit" variant="primary" className="me-2">
                    {editId ? 'Update' : 'Add'} Video
                </Button>
                {editId && (
                    <Button variant="secondary" onClick={resetForm}>
                        Cancel
                    </Button>
                )}
            </Form>

            <hr className="my-4" />

            <h3 className="mt-5">Video Library</h3>
            {videos.length === 0 ? (
                <p>No videos found</p>
            ) : (
                <>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Thumbnail</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentVideos.map((video) => (
                                <tr key={video._id}>
                                    <td>
                                        <img
                                            src={video.thumbnail || getYouTubeThumbnail(video.src)}
                                            alt={video.title}
                                            style={{ width: '120px', height: 'auto' }}
                                        />
                                    </td>
                                    <td>{video.title}</td>
                                    <td className="text-truncate" style={{ maxWidth: '300px' }}>
                                        {video.description}
                                    </td>
                                    <td>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={() => handleEdit(video)}
                                            className="me-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => confirmDelete(video._id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const page = i + 1;
                                    const isNear = Math.abs(currentPage - page) <= 1;
                                    const isFirst = page === 1;
                                    const isLast = page === totalPages;

                                    if (isFirst || isLast || isNear) {
                                        return (
                                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(page)}>
                                                    {page}
                                                </button>
                                            </li>
                                        );
                                    }

                                    if ((page === currentPage - 2 && page > 1) ||
                                        (page === currentPage + 2 && page < totalPages)) {
                                        return (
                                            <li key={`dots-${page}`} className="page-item disabled">
                                                <span className="page-link">…</span>
                                            </li>
                                        );
                                    }

                                    return null;
                                })}
                            </ul>
                        </nav>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this video?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VideoDashboard;