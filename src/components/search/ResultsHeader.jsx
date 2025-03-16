"use client";
import React from 'react';

const ResultsHeader = ({ pagination }) => (
    <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {pagination.total > 0 
                ? `${pagination.total} result${pagination.total !== 1 ? 's' : ''} found` 
                : 'No results found'}
        </h2>
        {pagination.total > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
            </div>
        )}
    </div>
);

export default ResultsHeader; 