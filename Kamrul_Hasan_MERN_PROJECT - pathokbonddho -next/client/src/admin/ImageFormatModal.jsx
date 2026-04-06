import React, { useState } from 'react';

const ImageFormatModal = ({ show, onHide, onConfirm, photo }) => {
    const [format, setFormat] = useState(photo?.format || 'full-width');
    const [altText, setAltText] = useState(photo?.alt || '');
    const [caption, setCaption] = useState(photo?.caption || '');

    if (!show) return null;

    const handleConfirm = () => {
        onConfirm({ format, altText, caption });
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-dark text-white border-0">
                        <h5 className="modal-title">Choose a format</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
                    </div>
                    <div className="modal-body p-4 text-center">
                        <div className="mb-4">
                            <img 
                                src={photo ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/${photo.imageUrl}` : ''} 
                                alt="Preview" 
                                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }}
                            />
                        </div>
                        
                        <div className="text-start">
                            <label className="form-label fw-bold small text-muted text-uppercase mb-3">Format *</label>
                            <div className="d-flex flex-column gap-2 mb-4">
                                <label className="d-flex align-items-center gap-2 p-2 rounded hover-bg-light cursor-pointer" style={{ cursor: 'pointer' }}>
                                    <input 
                                        type="radio" 
                                        name="format" 
                                        value="full-width" 
                                        checked={format === 'full-width'} 
                                        onChange={(e) => setFormat(e.target.value)}
                                        className="form-check-input mt-0"
                                    />
                                    <span>Full width</span>
                                </label>
                                <label className="d-flex align-items-center gap-2 p-2 rounded hover-bg-light cursor-pointer" style={{ cursor: 'pointer' }}>
                                    <input 
                                        type="radio" 
                                        name="format" 
                                        value="left-aligned" 
                                        checked={format === 'left-aligned'} 
                                        onChange={(e) => setFormat(e.target.value)}
                                        className="form-check-input mt-0"
                                    />
                                    <span>Left-aligned</span>
                                </label>
                                <label className="d-flex align-items-center gap-2 p-2 rounded hover-bg-light cursor-pointer" style={{ cursor: 'pointer' }}>
                                    <input 
                                        type="radio" 
                                        name="format" 
                                        value="right-aligned" 
                                        checked={format === 'right-aligned'} 
                                        onChange={(e) => setFormat(e.target.value)}
                                        className="form-check-input mt-0"
                                    />
                                    <span>Right-aligned</span>
                                </label>
                                <label className="d-flex align-items-center gap-2 p-2 rounded hover-bg-light cursor-pointer" style={{ cursor: 'pointer' }}>
                                    <input 
                                        type="radio" 
                                        name="format" 
                                        value="full-width-captioned" 
                                        checked={format === 'full-width-captioned'} 
                                        onChange={(e) => setFormat(e.target.value)}
                                        className="form-check-input mt-0"
                                    />
                                    <span>Full width captioned</span>
                                </label>
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
                    </div>
                    <div className="modal-footer border-0 p-4">
                        <button type="button" className="btn btn-light px-4" onClick={onHide}>Cancel</button>
                        <button 
                            type="button" 
                            className="btn btn-teal px-4" 
                            style={{ backgroundColor: '#008080', color: 'white' }}
                            onClick={handleConfirm}
                        >
                            Insert image
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .hover-bg-light:hover { background-color: #f8f9fa; }
                .cursor-pointer { cursor: pointer; }
                .btn-teal:hover { background-color: #006666 !important; }
            `}</style>
        </div>
    );
};

export default ImageFormatModal;
