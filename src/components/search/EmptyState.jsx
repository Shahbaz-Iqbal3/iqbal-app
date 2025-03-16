"use client";
import React from 'react';
import { Search } from "lucide-react";

const EmptyState = () => (
    <div className="text-center py-10">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">Use the search bar in the navbar to search for poems and verses</p>
        </div>
    </div>
);

export default EmptyState; 