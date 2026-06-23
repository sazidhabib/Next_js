import React from 'react';
import { Pagination } from 'react-bootstrap';

const ResponsivePagination = ({
    currentPage,
    totalPages,
    onPageChange,
    maxVisible = 5,
    alwaysShowFirstLast = true
}) => {
    if (totalPages <= 1) return null;

    const getPageItems = () => {
        const items = [];
        const leftBound = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const rightBound = Math.min(totalPages, leftBound + maxVisible - 1);

        // Always show first page
        if (alwaysShowFirstLast && leftBound > 1) {
            items.push(
                <Pagination.Item
                    key={1}
                    active={1 === currentPage}
                    onClick={() => onPageChange(1)}
                >
                    {1}
                </Pagination.Item>
            );

            if (leftBound > 2) {
                items.push(<Pagination.Ellipsis key="left-ellipsis" />);
            }
        }

        // Visible pages range
        for (let page = Math.max(1, leftBound); page <= rightBound; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Pagination.Item>
            );
        }

        // Always show last page
        if (alwaysShowFirstLast && rightBound < totalPages) {
            if (rightBound < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="right-ellipsis" />);
            }

            items.push(
                <Pagination.Item
                    key={totalPages}
                    active={totalPages === currentPage}
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    };

    return (
        <Pagination className="d-flex justify-content-center flex-wrap mt-3">
            <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            />
            {getPageItems()}
            <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            />
        </Pagination>
    );
};

export default ResponsivePagination;