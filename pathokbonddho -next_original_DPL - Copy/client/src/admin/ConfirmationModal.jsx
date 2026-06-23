import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({ show, onHide, onConfirm, title = "Confirm", body = "Are you sure?" }) => {
    return (
        <Modal show={show} onHide={onHide} centered className="custom-font-initial">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    No
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
