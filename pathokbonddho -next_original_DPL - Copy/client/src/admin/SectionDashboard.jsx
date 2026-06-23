import React, { useEffect, useState } from "react";
import { Button, Table, Spinner, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../store/auth";
import SectionFormModal from "./SectionFormModal";


const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/sections`;
const IMG_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/`;

const sectionTypes = [
    { type: "about", name: "About" },
    { type: "jetukuboliniage", name: "Jetukuboliniage" },
    { type: "bookreading", name: "Book Reading" },
    { type: "music", name: "Music" }
];

const SectionDashboard = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);



    const { token } = useAuth();

    // Fetch all sections
    const fetchSections = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setSections(res.data);
        } catch (err) {
            toast.error("Failed to fetch sections");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const handleSubmit = async (sectionData) => {
        try {
            const formData = new FormData();
            formData.append('type', sectionData.type);
            formData.append('title', sectionData.title);
            formData.append('description', sectionData.description);
            // Only append image if it exists (for updates)
            if (sectionData.image && typeof sectionData.image !== 'string') {
                formData.append('image', sectionData.image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };

            // Use PUT for existing sections, POST for new ones
            const response = currentSection?._id
                ? await axios.patch(`${API_URL}/${currentSection._id}`, formData, config)
                : await axios.post(API_URL, formData, config);

            toast.success(`Section ${currentSection?._id ? 'updated' : 'created'} successfully`);
            setModalShow(false);
            fetchSections(); // Refresh the data after successful submission
            return response.data;
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.response?.data?.error || 'Failed to save section');
            throw error;
        }
    };



    return (
        <div className="container custom-font-initial mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Sections Dashboard</h4>
            </div>

            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sectionTypes.map((sectionType, index) => {
                            const section = sections.find(s => s.type === sectionType.type);
                            return (
                                <tr key={sectionType.type}>
                                    <td>{index + 1}</td>
                                    <td>{sectionType.name}</td>
                                    <td>{section?.title || "Not created yet"}</td>
                                    <td>
                                        {section?.description
                                            ? `${section.description.substring(0, 50)}...`
                                            : "Not available"}
                                    </td>
                                    <td>
                                        {section?.imageUrl ? (
                                            <Image
                                                src={`${IMG_URL}${section.imageUrl.replace(/^\/+/, "")}`}
                                                alt={section.title}
                                                thumbnail
                                                style={{ maxWidth: "100px" }}
                                            />
                                        ) : (
                                            "No image"
                                        )}
                                    </td>
                                    <td>
                                        <Button
                                            variant={section ? "warning" : "primary"}
                                            size="sm"
                                            onClick={() => {
                                                setCurrentSection(section || { type: sectionType.type });
                                                setModalShow(true);
                                            }}
                                        >
                                            {section ? "Edit" : "Create"}
                                        </Button>

                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}

            {/* Modals */}
            <SectionFormModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                onSubmit={handleSubmit}
                section={currentSection}
                sectionTypes={sectionTypes}
            />

        </div>
    );
};

export default SectionDashboard;