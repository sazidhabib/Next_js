// components/Pagination.js
import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
    const { page, totalPages, totalCount } = pagination;

    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
                <p className="text-muted mb-0">
                    Showing page {page} of {totalPages} ({totalCount} total ads)
                </p>
            </div>
            <nav>
                <ul className="pagination mb-0">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                    </li>

                    {startPage > 1 && (
                        <>
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => onPageChange(1)}
                                >
                                    1
                                </button>
                            </li>
                            {startPage > 2 && (
                                <li className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            )}
                        </>
                    )}

                    {pages.map(pageNum => (
                        <li
                            key={pageNum}
                            className={`page-item ${pageNum === page ? 'active' : ''}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => onPageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        </li>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <li className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            )}
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => onPageChange(totalPages)}
                                >
                                    {totalPages}
                                </button>
                            </li>
                        </>
                    )}

                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;