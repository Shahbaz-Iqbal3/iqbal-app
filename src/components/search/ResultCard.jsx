"use client";
import React from 'react';
import { motion } from "framer-motion";
import Link from "next/link";
import { highlightText, getItemLink, DEFAULT_BOOKS } from './utils';


const ResultCard = ({ item, index, query }) => (
    <motion.div
        key={`${item.id}-${index}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        className="p-5 border dark:border-gray-700 bg-slate-50/40 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all"
    >
        {/* Content Type Badge */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    item.stanza_order 
                        ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300' 
                        : 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300'
                }`}>
                    {item.stanza_order ? 'Stanza' : 'Poem'}
                </span>
                {item.poem_details?.title_en && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        Poem: {item.poem_details.title_en.toLowerCase()} <br />
                        Book: {DEFAULT_BOOKS.find(book => book.id === item.poem_details.book_id)?.title_en}  
                    </span>
                )}
                {!item.poem_details && item.title_en && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                         From: {DEFAULT_BOOKS.find(book => book.id === item.book_id)?.title_en}
                    </span>
                )}
            </div>
            
            <Link 
                href={getItemLink(item)}  
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
            >
                <span>View</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </Link>
        </div>
        
        {/* Urdu Content */}
        {item.content_ur && (
            <div className="mb-3 flex flex-col">
                <p 
                    dangerouslySetInnerHTML={{ __html: highlightText(item.content_ur.split("|")[0], query) }}
                    className="sm:text-3xl text-lg text-gray-900 dark:text-white text-right font-nastaliq my-1 sm:mb-8 mb-3 w-full"
                />
                <p 
                    dangerouslySetInnerHTML={{ __html: highlightText(item.content_ur.split("|")[1], query) }}
                    className="sm:text-3xl text-lg text-gray-900 dark:text-white text-right font-nastaliq my-1 sm:mb-8 mb-3 w-full"
                />
            </div>
        )}
        
        {/* Poem title if it's a poem */}
        {!item.content_ur && item.title_ur && (
            <div className="mb-3">
                <p 
                    dangerouslySetInnerHTML={{ __html: highlightText(item.title_ur, query) }}
                    className="sm:text-3xl text-lg text-gray-900 dark:text-white text-right font-nastaliq my-1 sm:mb-8 mb-3 w-full"
                />
            </div>
        )}
        
        {/* English Content */}
        {item.content_en && (
            <div className="mb-2">
                <p 
                    dangerouslySetInnerHTML={{ __html: highlightText(item.content_en.split("|")[0], query) }}
                    className="sm:text-lg text-sm text-gray-700 dark:text-gray-200 mt-2"
                />
                <p 
                    dangerouslySetInnerHTML={{ __html: highlightText(item.content_en.split("|")[1], query) }}
                    className="sm:text-lg text-sm text-gray-700 dark:text-gray-200 mt-2"
                />
            </div>
        )}
        
        {/* Poem title in English if it's a poem */}
        {!item.content_en && item.title_en && (
            <div className="mb-2">
                <p 
                    dangerouslySetInnerHTML={{ __html: highlightText(item.title_en, query) }}
                    className="sm:text-lg text-sm text-gray-700 dark:text-gray-200 mt-2"
                />
            </div>
        )}
        
        {/* Roman Content (if available) */}
        {item.content_ro && (
            <div>
                <p 
                    dangerouslySetInnerHTML={{ __html: highlightText(item.content_ro.split("|")[0], query) }}
                    className="sm:text-base text-xs text-gray-600 dark:text-gray-400 italic"
                />
                <p 
                    dangerouslySetInnerHTML={{ __html: highlightText(item.content_ro.split("|")[1], query) }}
                    className="sm:text-base text-xs text-gray-600 dark:text-gray-400 italic"
                />
            </div>
        )}
    </motion.div>
);

export default ResultCard; 