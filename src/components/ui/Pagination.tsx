import React from 'react';
import { cn } from '../../lib/utils';

interface PaginationProps {
    currentPage: number;    // Current page (1-based)
    totalPages: number;     // Total number of pages
    onPageChange: (page: number) => void; // Callback when page changes
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className,
}) => {

    // Helper to create an array of page numbers (e.g., [1, 2, 3, 4])
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (totalPages <= 1) return null; // No need to show pagination

    return (
        <nav className={cn("flex items-center justify-center gap-2 mt-8", className)}>
            <button
                className="px-3 py-1 rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200 disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            {getPageNumbers().map((num) => (
                <button
                    key={num}
                    className={cn(
                        "px-3 py-1 rounded-lg font-medium",
                        num === currentPage
                            ? "bg-accent-500 text-white shadow"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    )}
                    onClick={() => onPageChange(num)}
                >
                    {num}
                </button>
            ))}
            <button
                className="px-3 py-1 rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200 disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </nav>
    );
};

export default Pagination;