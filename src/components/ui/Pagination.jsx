import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from './Button';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false
}) => {
    // Don't render if there's only one page
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
            {/* Mobile View */}
            <div className="flex justify-between flex-1 sm:hidden">
                <Button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    variant="outline"
                    size="sm"
                >
                    Previous
                </Button>
                <Button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    variant="outline"
                    size="sm"
                >
                    Next
                </Button>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                        className="p-2"
                    >
                        <FiChevronLeft size={18} />
                    </Button>

                    <div className="flex gap-1">
                        {/* Simple logic for page numbers could go here if needed */}
                        <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                            {currentPage}
                        </span>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || isLoading}
                        className="p-2"
                    >
                        <FiChevronRight size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;