import React from "react";
import { Modal, Button } from "react-bootstrap";


const BookReadingModal = ({ show, handleClose, item }) => {
    if (!item) return null;

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="xl"
            className="custom-detail-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title as="h4" className="w-100 post-title text-center">
                    {item.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {item.image && (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="img-fluid mb-3 rounded"
                    />
                )}
                <pre className="modal-description custom-font text-start" style={{ whiteSpace: "pre-wrap" }}>{item.description}</pre>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="secondary" onClick={handleClose}>
                    বন্ধ করুন
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BookReadingModal;
