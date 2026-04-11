import React, { useState, useEffect, useRef } from "react";

import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import DatePicker from "react-datepicker";
import moment from "moment";
import 'moment/locale/bn';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import bn from 'date-fns/locale/bn'; // Import Bengali locale from date-fns

// Register the Bengali locale
registerLocale('bn', bn);

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/articles`;



const ArticleDashboard = () => {
    const [articles, setArticles] = useState([]);
    const [newArticle, setNewArticle] = useState({
        title: "",
        description: "",
        status: false,
        image: null,
        publishDate: null, // 🆕 added default to today.
    });
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // added for image preview
    const fileInputRef = useRef(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 10;

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const formatDateBangla = (dateString) => {
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString("bn-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };


    const getPaginationButtons = () => {
        const pages = [];

        // Always show the first page
        pages.push(1);

        // Show dots if current page is not adjacent to first page
        if (currentPage > 2) {
            pages.push("...");
        }

        // Show current page if it's not first or last
        if (currentPage > 1 && currentPage < totalPages) {
            pages.push(currentPage);
        }

        // Show dots if current page is not adjacent to last page
        if (currentPage < totalPages - 1) {
            pages.push("...");
        }

        // Always show the last page if different from first
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };




    // ✅ Fetch Articles from Backend
    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                //console.log("API response:", response.data); // 👀 Check this
                setArticles(response.data);
            })
            .catch(error => console.error("Error fetching articles:", error));
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [articles, totalPages, currentPage]);

    useEffect(() => {
        axios.get(API_URL, {
            params: {
                sort: '-publishDate'  // Add this to sort by publishDate descending
            }
        })
            .then(response => {
                setArticles(response.data);
            })
            .catch(error => console.error("Error fetching articles:", error));
    }, []);

    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setArticles(prev => prev.filter(article => article.id !== deleteId));
            toast.success("Article deleted successfully.");
        } catch (error) {
            console.error("Error deleting article:", error);
            toast.error("Failed to delete article.");
        } finally {
            setShowConfirm(false);
            setDeleteId(null);
        }
    };


    // Handle Input Change
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "file") {
            const file = files[0];
            if (file) {
                setNewArticle(prev => ({ ...prev, image: file }));

                // Clean up old URL before setting a new one
                if (imagePreview?.startsWith("blob:")) {
                    URL.revokeObjectURL(imagePreview);
                }

                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setNewArticle({
                ...newArticle,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };



    const { token } = useAuth();

    // Add or Edit Article
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newArticle.title.trim() === "" || newArticle.description.trim() === "") {
            alert("Title and Description are required!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", newArticle.title);
            formData.append("publishDate", moment(newArticle.publishDate).format("YYYY-MM-DD"));

            formData.append("description", newArticle.description);
            formData.append("status", newArticle.status);
            if (newArticle.image) {
                formData.append("image", newArticle.image); // 🆕
            }

            if (editingId !== null) {
                const response = await axios.patch(
                    `${API_URL}/${editingId}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                // In handleSubmit, after updating articles:
                setArticles(prevArticles => {
                    const updated = editingId
                        ? prevArticles.map(article => article.id === editingId ? response.data.article : article)
                        : [...prevArticles, response.data.article];

                    // Sort by publishDate descending
                    return updated.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
                });
                setEditingId(null);
                toast.success("Article updated successfully");
            } else {
                const response = await axios.post(API_URL, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setArticles([...articles, response.data.article]);
                toast.success("Article added successfully");
            }

            // Reset
            setNewArticle({ title: "", description: "", status: false, image: null });
            setImagePreview(null); // 🆕 reset preview
            setEditingId(null);
            fileInputRef.current.value = ""; // ✅ clears the file input manually
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error(error.response.data.message || "Duplicate article title!");
            } else {
                console.error("Error saving article:", error);
                toast.error("Something went wrong. Please try again.");
            }
        }
    };



    // Edit Article
    const handleEdit = (article) => {
        setNewArticle({
            title: article.title,
            description: article.description,
            status: article.status,
            image: null,
            publishDate: article.publishDate ? new Date(article.publishDate) : null, // We'll reset this, the image is not a File object
        });

        setImagePreview(article.image
            ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${article.image}`
            : null
        );
        setEditingId(article.id);
    };




    // Toggle Status
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const response = await axios.patch(
                `${API_URL}/${id}`,
                { status: !currentStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            setArticles(articles.map(article =>
                article.id === id ? response.data.article : article
            ));
        } catch (error) {
            console.error("Error updating article status:", error);
        }
    };


    return (
        <div className="container custom-font-initial mt-4">
            <h2 className="mb-3">📝 Article Dashboard</h2>

            {/* Article Input Form */}
            <Form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-light">
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={newArticle.title}
                        onChange={handleChange}
                        placeholder="Enter article title"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Article Date</Form.Label>
                    <DatePicker
                        selected={newArticle.publishDate}
                        onChange={(date) => setNewArticle({ ...newArticle, publishDate: date })}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        placeholderText="Enter date (yyyy-mm-dd)"
                        locale="bn"
                        isClearable
                    />
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={newArticle.description}
                        onChange={handleChange}
                        placeholder="Enter article description"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        ref={fileInputRef} // added ref for file input
                    />
                </Form.Group>

                {/* Image Preview */}
                {imagePreview && (
                    <div className="mb-3">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ width: "150px", height: "100px" }}
                        />
                    </div>
                )}

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Show on Homepage"
                        name="status"
                        checked={newArticle.status}
                        onChange={handleChange}
                    />
                </Form.Group>



                <Button variant={editingId !== null ? "warning" : "primary"} type="submit">
                    {editingId !== null ? "Update Article" : "Add Article"}
                </Button>

                {/* Add a Cancel button to reset */}
                {editingId !== null && <Button variant="secondary" className="mx-2" onClick={() => {
                    setNewArticle({ title: "", description: "", status: false, image: null });
                    setEditingId(null);
                    setImagePreview(null);
                }}>
                    Cancel
                </Button>}
            </Form>

            {/* Articles Table */}
            <Table striped bordered hover>
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentArticles.map((article, index) => (

                        <tr key={article.id}>
                            <td>{indexOfFirstArticle + index + 1}</td>
                            <td>
                                {formatDateBangla(article.publishDate)}
                            </td>


                            <td>
                                {article.image && (
                                    <img
                                        src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${article.image}`}
                                        alt="Article"
                                        width="60"
                                        height="60"
                                        style={{ objectFit: "cover", borderRadius: "5px" }}
                                    />
                                )}
                            </td>
                            <td>{article.title}</td>
                            <td>{article.description.length > 200 ? `${article.description.slice(0, 200)}...` : article.description}</td>
                            <td>
                                <Form.Check
                                    type="switch"
                                    checked={article.status}
                                    onChange={() => handleToggleStatus(article.id, article.status)}
                                    label={article.status ? "Visible" : "Hidden"}
                                />
                            </td>
                            <td>
                                <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(article)}>
                                    ✏️ Edit
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => { setDeleteId(article.id); setShowConfirm(true); }}>
                                    🗑️ Delete
                                </Button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
            <div className="d-flex justify-content-center my-3">
                <Button
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="me-2"
                >
                    Previous
                </Button>

                {getPaginationButtons().map((page, idx) =>
                    page === "..." ? (
                        <span key={idx} className="mx-2 align-self-center">...</span>
                    ) : (
                        <Button
                            key={page}
                            variant={page === currentPage ? "primary" : "outline-primary"}
                            onClick={() => handlePageChange(page)}
                            className="me-2"
                        >
                            {page}
                        </Button>
                    )
                )}

                <Button
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>


            <ConfirmationModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Article"
                body="Are you sure you want to delete this article?"
            />

        </div>
    );
};

export default ArticleDashboard;
