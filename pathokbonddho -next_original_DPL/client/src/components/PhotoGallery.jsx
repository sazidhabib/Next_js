import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Row, Col, Card, ListGroup, Spinner,
    Button, Pagination
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import PhotoModal from './PhotoModal';
import { useMenu } from '../store/MenuContext';
import ResponsivePagination from './ResponsivePagination';

// Skeleton Loading Component
const PhotoSkeleton = () => (
    <div className="skeleton-photo">
        <div className="skeleton-image"></div>
    </div>
);

const PhotoGallery = () => {
    const [albums, setAlbums] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [albumPhotoCounts, setAlbumPhotoCounts] = useState({});

    const { getMenuByOrder } = useMenu();
    const photoGalleryMenu = getMenuByOrder(7);

    // Pagination states
    const [currentAlbumPage, setCurrentAlbumPage] = useState(1);
    const [currentPhotoPage, setCurrentPhotoPage] = useState(1);
    const albumsPerPage = 12;
    const photosPerPage = 12;

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const ALBUM_API = `${API_BASE_URL}/api/albums`;
    const PHOTO_API = `${API_BASE_URL}/api/photos`;

    // Calculate pagination indexes
    const indexOfLastAlbum = currentAlbumPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum);
    const totalAlbumPages = Math.ceil(albums.length / albumsPerPage);

    const indexOfLastPhoto = currentPhotoPage * photosPerPage;
    const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
    const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);
    const totalPhotoPages = Math.ceil(photos.length / photosPerPage);

    // Fetch albums and photo counts with cache first strategy
    useEffect(() => {
        const fetchAlbums = async () => {
            setLoading(true);
            try {
                // Check cache first
                const cached = localStorage.getItem('prefetchedAlbums');
                let albumData;

                if (cached) {
                    albumData = JSON.parse(cached);
                    setAlbums(albumData);
                } else {
                    const res = await axios.get(`${ALBUM_API}?status=active`);
                    albumData = res.data;
                    setAlbums(albumData);
                    localStorage.setItem('prefetchedAlbums', JSON.stringify(albumData));
                }

                const counts = {};
                for (const album of albumData) {
                    try {
                        const photosRes = await axios.get(`${PHOTO_API}/${album.id}?limit=1`);
                        counts[album.id] = photosRes.data.length;

                        if (albumData.length > 0 && !selectedAlbumId) {
                            setSelectedAlbumId(albumData[0].id);
                            // Prefetch first album's photos
                            axios.get(`${PHOTO_API}/${albumData[0].id}`)
                                .then(res => {
                                    sessionStorage.setItem(`album_${albumData[0].id}`, JSON.stringify(res.data));
                                });
                        }
                    } catch (err) {
                        counts[album.id] = 0;
                        console.error(`Error fetching photos for album ${album.id}:`, err);
                    }
                }
                setAlbumPhotoCounts(counts);
            } catch (err) {
                toast.error('Failed to load albums');
                console.error('Error fetching albums:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbums();
    }, []);

    // Fetch photos when album is selected with cache first
    useEffect(() => {
        const fetchPhotos = async () => {
            if (selectedAlbumId) {
                setPhotoLoading(true);
                setPhotos([]);
                setCurrentPhotoPage(1);

                try {
                    // Check session cache first
                    const cached = sessionStorage.getItem(`album_${selectedAlbumId}`);
                    if (cached) {
                        setPhotos(JSON.parse(cached));
                        setPhotoLoading(false);
                    }

                    const res = await axios.get(`${PHOTO_API}/${selectedAlbumId}`);
                    setPhotos(res.data);
                    sessionStorage.setItem(`album_${selectedAlbumId}`, JSON.stringify(res.data));
                } catch (err) {
                    toast.error('Failed to load photos');
                    console.error('Error fetching photos:', err);
                } finally {
                    setPhotoLoading(false);
                }
            }
        };
        fetchPhotos();
    }, [selectedAlbumId]);

    const handlePhotoClick = (index) => {
        const actualIndex = indexOfFirstPhoto + index;
        setSelectedPhotoIndex(actualIndex);
        setShowModal(true);
    };

    const getSelectedAlbumTitle = () => {
        const album = albums.find(a => a.id === selectedAlbumId);
        return album ? album.name : 'Selected Album';
    };

    // Pagination controls



    return (
        <div className='custom-bgcolor photography' id={photoGalleryMenu?.path || 'photography'}>
            <Container>
                <Row>
                    {/* Album List */}
                    <Col md={3} className="mb-3">
                        <h2 className="subheading">{photoGalleryMenu?.name || "ফটোগ্রাফি"}</h2>
                        <h5 className="mainheading mb-3">অ্যালবাম</h5>
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="border" />
                            </div>
                        ) : (
                            <>
                                <ListGroup >
                                    {currentAlbums.map((album) => (
                                        <ListGroup.Item
                                            key={album.id}
                                            action
                                            active={selectedAlbumId === album.id}
                                            onClick={() => setSelectedAlbumId(album.id)}
                                            className="d-flex justify-content-between align-items-center "
                                        >
                                            {album.name}
                                            <span className="badge bg-green rounded-pill">
                                                {albumPhotoCounts[album.id] || 0}
                                            </span>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>

                                <ResponsivePagination
                                    currentPage={currentAlbumPage}
                                    totalPages={totalAlbumPages}
                                    onPageChange={setCurrentAlbumPage}
                                    maxVisible={3}
                                // Adjust based on your needs
                                />
                            </>
                        )}
                    </Col>

                    {/* Photo Grid */}
                    <Col md={9} className='margin-photo'>
                        {selectedAlbumId ? (
                            <>
                                {photoLoading ? (
                                    <Row>
                                        {[...Array(12)].map((_, i) => (
                                            <Col key={i} xs={6} sm={6} md={4} lg={3} className="mb-4">
                                                <PhotoSkeleton />
                                            </Col>
                                        ))}
                                    </Row>
                                ) : photos.length > 0 ? (
                                    <>
                                        <Row>
                                            {currentPhotos.map((photo, index) => (
                                                <Col
                                                    key={photo.id}
                                                    xs={6}
                                                    sm={6}
                                                    md={4}
                                                    lg={3}
                                                    className="mb-4"
                                                >
                                                    <Card className="h-100" onClick={() => handlePhotoClick(index)}>
                                                        <LazyLoadImage
                                                            src={`${API_BASE_URL}/${photo.imageUrl}`}
                                                            effect="blur"
                                                            placeholderSrc={`${API_BASE_URL}/placeholder.jpg`}
                                                            width="100%"
                                                            height="180px"
                                                            style={{ objectFit: 'cover', cursor: 'pointer' }}
                                                            wrapperClassName="lazy-wrapper"
                                                        />
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                        <ResponsivePagination
                                            currentPage={currentPhotoPage}
                                            totalPages={totalPhotoPages}
                                            onPageChange={setCurrentPhotoPage}
                                            maxVisible={3}
                                        />
                                    </>
                                ) : (
                                    <div className="text-center text-muted py-5">
                                        <p>No photos found in this album.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-muted py-5">
                                <p>Please select an album to view photos</p>
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Photo Modal */}
                <PhotoModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    photos={photos}
                    selectedIndex={selectedPhotoIndex}
                    onIndexChange={setSelectedPhotoIndex}
                    albumTitle={getSelectedAlbumTitle()}
                />
            </Container>
        </div>
    );
};

export default PhotoGallery;