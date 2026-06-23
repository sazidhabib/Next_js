import React from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';

const PhotoModal = ({
    show,
    onHide,
    photos,
    selectedIndex,
    onIndexChange,
    albumTitle
}) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            centered
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="text-center post-title w-100">{albumTitle}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center p-0" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                <Carousel
                    activeIndex={selectedIndex}
                    onSelect={onIndexChange}
                    interval={null}
                    prevIcon={<span aria-hidden="true" style={{ color: '#41ad47', fontSize: '2rem' }}>‹</span>}
                    nextIcon={<span aria-hidden="true" style={{ color: '#41ad47', fontSize: '2rem' }}>›</span>}
                >
                    {photos.map((photo) => (
                        <Carousel.Item key={photo._id}>
                            <img
                                className="img-fluid d-block mx-auto"
                                src={`${import.meta.env.VITE_API_BASE_URL}/${photo.imageUrl}`}
                                alt=""
                                style={{
                                    maxHeight: '70vh',
                                    objectFit: 'contain',
                                    width: '100%',
                                    padding: '1rem'
                                }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Modal.Body>

            <Modal.Footer className="border-0 pt-0 d-flex flex-column">
                {/* Caption Section */}
                <div className="w-100 text-center mb-2 custom-font">
                    <p className="mb-0 fw-bold">
                        {photos[selectedIndex]?.caption || photos[selectedIndex]?.title || ''}
                    </p>
                </div>

                {/* Footer Controls */}
                <div className="w-100 d-flex justify-content-between align-items-center">
                    <div>{selectedIndex + 1} of {photos.length}</div>
                    <Button variant="secondary" onClick={onHide}>
                        বন্ধ করুন
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default PhotoModal;