// AlbumDashboard.jsx
import React, { useEffect, useState } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import AlbumFormModal from "./AlbumFormModal";
import ConfirmationModal from "./ConfirmationModal";
import axios from "axios";
import { useAuth } from "../store/auth";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/albums`;

const AlbumDashboard = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [editAlbum, setEditAlbum] = useState(null);
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { token } = useAuth();


    // Fetch albums
    const fetchAlbums = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL, {
                params: { page }
            });
            setAlbums(res.data);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error("Failed to fetch albums");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, [page]);

    const handleAlbumSubmit = async (albumData) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (editAlbum) {
                await axios.patch(`${API_URL}/${editAlbum._id}`, albumData, config);
                toast.success("Album updated successfully");
            } else {
                await axios.post(API_URL, albumData, config);
                toast.success("Album created successfully");
            }
            setModalShow(false);
            fetchAlbums();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
            console.error("Submit error:", err);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${albumToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Album deleted successfully");
            setConfirmModalShow(false);
            fetchAlbums();
        } catch (err) {
            toast.error("Failed to delete album");
            console.error("Delete error:", err);
        }
    };

    return (
        <div className="container custom-font-initial mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Album Dashboard</h4>
                <Button onClick={() => { setEditAlbum(null); setModalShow(true); }}>
                    + Add Album
                </Button>
            </div>

            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {albums.map((album, index) => (
                            <tr key={album._id}>
                                <td>{index + 1}</td>
                                <td>{album.name}</td>
                                <td>{album.status}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => { setEditAlbum(album); setModalShow(true); }}
                                        className="me-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => { setAlbumToDelete(album._id); setConfirmModalShow(true); }}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Pagination */}
            <div className="d-flex justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                        key={i}
                        variant={i + 1 === page ? "primary" : "light"}
                        onClick={() => setPage(i + 1)}
                        className="me-1"
                    >
                        {i + 1}
                    </Button>
                ))}
            </div>

            {/* Modals */}
            <AlbumFormModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                onSubmit={handleAlbumSubmit}
                editAlbum={editAlbum}
            />
            <ConfirmationModal
                show={confirmModalShow}
                onHide={() => setConfirmModalShow(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default AlbumDashboard;
