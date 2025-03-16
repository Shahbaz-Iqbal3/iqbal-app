"use client";
import React from 'react';

const ErrorDisplay = ({ error }) => (
    <div className="py-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Search Error</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">Please try a different search or adjust your filters.</p>
    </div>
);

export default ErrorDisplay; 