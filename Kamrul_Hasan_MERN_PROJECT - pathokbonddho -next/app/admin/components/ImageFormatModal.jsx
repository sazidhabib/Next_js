import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { STATIC_URL } from "@/app/lib/api";

const ImageFormatModal = ({ show, onHide, onConfirm, photo }) => {
    const [format, setFormat] = useState('full-width');
    const [altText, setAltText] = useState('');
    const [caption, setCaption] = useState('');

    React.useEffect(() => {
        if (show && photo) {
            setFormat(photo.format || 'full-width');
            setAltText(photo.alt || photo.caption || '');
            setCaption(photo.caption || '');
        } else if (!show) {
            setFormat('full-width');
            setAltText('');
            setCaption('');
        }
    }, [show, photo]);

    const handleConfirm = () => {
        onConfirm({ format, altText, caption });
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>Choose a format</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 text-center">
                <div className="mb-4">
                    <img 
                        src={photo?.imageUrl ? (photo.imageUrl.startsWith('http') ? photo.imageUrl : `${STATIC_URL}/${photo.imageUrl.replace(/^\/+/, '')}`) : null} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }}
                    />
                </div>
                
                <div className="text-start">
                    <label className="form-label fw-bold small text-muted text-uppercase mb-3">Format *</label>
                    <div className="d-flex flex-column gap-2 mb-4">
                        {['full-width', 'left-aligned', 'right-aligned', 'full-width-captioned'].map(f => (
                            <label key={f} className="d-flex align-items-center gap-2 p-2 rounded cursor-pointer" style={{ cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="format" 
                                    value={f} 
                                    checked={format === f} 
                                    onChange={(e) => setFormat(e.target.value)}
                                    className="form-check-input mt-0"
                                />
                                <span>{f.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                            </label>
                        ))}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold small text-muted text-uppercase">Alt text</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={altText} 
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Enter image description"
                        />
                    </div>

                    {format === 'full-width-captioned' && (
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-muted text-uppercase">Caption</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={caption} 
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Enter image caption"
                            />
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 p-4">
                <Button variant="light" onClick={onHide}>Cancel</Button>
                <Button variant="info" onClick={handleConfirm}>Insert image</Button>
            </Modal.Footer>
            <style>{`.cursor-pointer { cursor: pointer; }`}</style>
        </Modal>
    );
};

export default ImageFormatModal;
