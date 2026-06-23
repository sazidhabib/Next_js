import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../store/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form } from 'react-bootstrap';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/songs`;

const SongDashboard = () => {
    const [songs, setSongs] = useState([]);
    const [newSong, setNewSong] = useState({ title: '', youtubeUrl: '', position: '' });
    const [editId, setEditId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const songsPerPage = 8; // Show 8 per page

    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

    const totalPages = Math.ceil(songs.length / songsPerPage);

    // Fetch all songs
    const fetchSongs = async () => {
        try {
            const res = await axios.get(API_BASE_URL);
            console.log('Songs response:', res.data);
            if (Array.isArray(res.data)) {
                setSongs(res.data);
            } else {
                throw new Error('Expected array but got: ' + typeof res.data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch songs');
            setSongs([]);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const handleInputChange = (e) => {
        setNewSong({ ...newSong, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setNewSong({ title: '', youtubeUrl: '', position: '' });
        setEditId(null);
    };


    const { token } = useAuth();

    // Create or update a song
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newSong.title.trim() === "" || newSong.youtubeUrl.trim() === "") {
            alert("Title and YouTube URL are required!");
            return;
        }

        try {
            const payload = {
                title: newSong.title,
                youtubeUrl: newSong.youtubeUrl,
                position: newSong.position !== "" ? Number(newSong.position) : 9999,
            };


            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            if (editId) {
                await axios.patch(`${API_BASE_URL}/${editId}`, payload, config);
                toast.success("Song updated successfully");
            } else {
                await axios.post(API_BASE_URL, payload, config);
                toast.success("Song added successfully");
            }

            await fetchSongs(); // ✅ Refresh list
            resetForm(); // ✅ Clear form
        } catch (error) {
            if (error.response?.status === 409 || error.response?.status === 400) {
                toast.error(error.response.data.message || "Duplicate title not allowed!");
            } else if (error.response?.status === 401) {
                toast.error("Unauthorized! Please log in.");
            } else {
                console.error(error);
                toast.error("Something went wrong. Please try again.");
            }
        }
    };



    const handleEdit = (song) => {
        setNewSong({ title: song.title, youtubeUrl: song.youtubeUrl, position: song.position });
        setEditId(song.id);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Song deleted');
            fetchSongs();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete song');
        } finally {
            setShowConfirm(false);
            setDeleteId(null);
        }
    };


    return (
        <div className="container custom-font-initial mt-5">
            <h2 className="mb-4">{editId ? 'Edit Song' : 'Add New Song'}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control name="title" value={newSong.title} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>YouTube URL</Form.Label>
                    <Form.Control name="youtubeUrl" value={newSong.youtubeUrl} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Position (Optional)</Form.Label>
                    <Form.Control
                        type="number"
                        name="position"
                        value={newSong.position}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Button type="submit" variant="primary">
                    {editId ? 'Update' : 'Add'} Song
                </Button>
                {editId && (
                    <Button variant="secondary" onClick={resetForm} className="ms-2">
                        Cancel
                    </Button>
                )}
            </Form>

            <hr />

            <h3 className="mt-5">All Songs</h3>
            {songs.length === 0 ? (
                <p>No songs found</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Title</th>
                            <th>YouTube URL</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSongs.map((song) => (
                            <tr key={song.id}>
                                <td>{song.position}</td>
                                <td>{song.title}</td>
                                <td>
                                    <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer">
                                        Watch
                                    </a>
                                </td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleEdit(song)} className="me-2">
                                        Edit
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => confirmDelete(song.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            )}
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

                            if (
                                (page === currentPage - 2 && page > 1) ||
                                (page === currentPage + 2 && page < totalPages)
                            ) {
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

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this song?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SongDashboard;
