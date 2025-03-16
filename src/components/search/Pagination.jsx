"use client";
import React from 'react';

const Pagination = ({ pagination, handlePageChange }) => (
    <div className="mt-8 flex justify-center">
        <nav className="flex items-center">
            {/* Previous Page Button */}
            <button
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page <= 1}
                className={`p-2 mr-2 rounded-md ${
                    pagination.page <= 1
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            {/* Page Numbers */}
            <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    // Logic to show 5 page numbers around current page
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                    } else {
                        pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded-md ${
                                pagination.page === pageNum
                                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
                
                {/* Add ellipsis if needed */}
                {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                    <span className="px-3 py-1 text-gray-600 dark:text-gray-400">...</span>
                )}
                
                {/* Last page if we're not near it */}
                {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                    <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className={`px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}
                    >
                        {pagination.totalPages}
                    </button>
                )}
            </div>
            
            {/* Next Page Button */}
            <button
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page >= pagination.totalPages}
                className={`p-2 ml-2 rounded-md ${
                    pagination.page >= pagination.totalPages
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </nav>
    </div>
);

export default Pagination; 