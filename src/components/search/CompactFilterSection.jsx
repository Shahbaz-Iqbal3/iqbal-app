"use client";
import React from 'react';
import { DEFAULT_BOOKS } from './utils';

const CompactFilterSection = ({ 
    contentType, 
    setContentType, 
    bookId, 
    setBookId, 
    availableBooks = DEFAULT_BOOKS,
    performSearch,
    isExpanded,
    toggleExpanded
}) => {
    // Modified to always return all books regardless of selected language
    const getFilteredBooks = () => {
        // Return all books without filtering by language
        return availableBooks;
    };

    // Check if any filters are applied
    const hasActiveFilters = contentType !== 'all'  || bookId !== '';

    const handleFilterChange = (filterType, value) => {
        // Create copies of current filter values
        let newContentType = contentType;
        let newBookId = bookId;
        
        // Update the appropriate filter
        if (filterType === 'contentType') {
            newContentType = value;
            setContentType(value);
        } else if (filterType === 'bookId') {
            newBookId = value;
            setBookId(value);
        }
        
        // Directly call performSearch with the updated filter values
        // This ensures we're using the latest values and not waiting for state updates
        setTimeout(() => {
            // Calling the parent's performSearch function with immediate values
            // instead of relying on state updates
            performSearch(true, newContentType, 'all', newBookId);
        }, 0);
    };

    return (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-300 " >
            {/* Filter Header with Toggle */}
            <div 
                className="p-3 flex items-center justify-between cursor-pointer bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                onClick={toggleExpanded}
            >
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h2>
                    {hasActiveFilters && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-green-700 dark:bg-blue-900/50 dark:text-blue-300">
                           Active<span className="w-2 h-2 bg-green-500 rounded-full ml-1 "></span>
                        </span>
                    )}
                </div>
                <button 
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                    aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            
            {/* Filter Content - Collapsible */}
            {isExpanded && (
                <div className="p-4">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Refine results:</h2>
                        
                        {/* Content Type Filter */}
                        <div className="flex items-center">
                            <select
                                value={contentType}
                                onChange={(e) => handleFilterChange('contentType', e.target.value)}
                                className="text-sm p-1.5 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                aria-label="Filter by content type"
                            >
                                <option value="all">All Content</option>
                                <option value="poem">Poems Only</option>
                                <option value="stanza">Stanzas Only</option>
                            </select>
                        </div>
                        
                        {/* Language Filter */}
                       
                        
                        {/* Book Filter */}
                        <div className="flex items-center">
                            <select
                                value={bookId}
                                onChange={(e) => handleFilterChange('bookId', e.target.value)}
                                className="text-sm p-1.5 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                aria-label="Filter by book"
                                disabled={!getFilteredBooks().length}
                            >
                                <option value="">All Books</option>
                                {getFilteredBooks().map(book => (
                                    <option key={book.id} value={book.id}>
                                        {book.title_en}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Clear Filters Button (only shown when filters are active) */}
                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    setContentType("all");
                                    setLanguage("all");
                                    setBookId("");
                                    // Clear all filters and perform search with cleared values
                                    setTimeout(() => performSearch(true, "all", "all", ""), 0);
                                }}
                                className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                    
                    {/* Active Filter Pills */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2">
                            {contentType !== 'all' && (
                                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                    <span>{contentType === 'poem' ? 'Poems' : 'Stanzas'}</span>
                                    <button 
                                        onClick={() => handleFilterChange('contentType', 'all')}
                                        className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                                        aria-label={`Remove ${contentType} filter`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                           
                            {bookId && (
                                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                    <span>{availableBooks.find(b => b.id === bookId)?.title_en || 'Book'}</span>
                                    <button 
                                        onClick={() => handleFilterChange('bookId', '')}
                                        className="ml-1 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200"
                                        aria-label="Remove book filter"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompactFilterSection; 