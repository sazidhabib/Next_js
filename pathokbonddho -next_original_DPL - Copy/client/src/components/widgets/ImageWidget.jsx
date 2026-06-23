import React from 'react';
import { Image } from 'react-bootstrap';

const ImageWidget = ({ cell }) => {
    // Check if cell has contentId (which might be the image ID) or just image URL stored
    // For now assuming we need to fetch or construct URL. 
    // In admin, we selected an image -> we saved contentId.

    // Simplification for this step: 
    // If the backend `updateCellContent` stored the full image object or URL, it would be easier.
    // If it only stored ID, we might need to fetch it.
    // However, for "image" type, usually we might want just display.

    // Let's assume for now we might need to fetch or use a placeholder if implementation details vary.
    // Ideally, the PageLayout fetch should populate this, or we fetch individually.

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Temporary: simple render assuming we might have data or just placeholder
    return (
        <div className="image-widget h-100">
            <Image
                src={`${API_BASE_URL}/uploads/${cell.contentId}`} // Naive assumption, likely need fetching
                fluid
                className="w-100 h-100 object-fit-cover rounded"
                onError={(e) => {
                    // Try to fetch image details if src fails? 
                    // Or keep placeholder
                    e.target.src = 'https://placehold.co/600x400?text=Image+Widget';
                }}
            />
            {cell.title && <div className="text-center small mt-1 text-muted">{cell.title}</div>}
        </div>
    );
};

export default ImageWidget;
