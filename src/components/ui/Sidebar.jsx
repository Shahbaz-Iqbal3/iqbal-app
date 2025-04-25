"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Sidebar = ({ isOpen, onToggle, bookId, poems, currentPoemId }) => {
  const activeLinkRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (activeLinkRef.current && isOpen) {
      activeLinkRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [currentPoemId, isOpen]);

  const filteredPoems = poems?.filter(poem => 
    poem.title_ur.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poem.title_en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`md:sticky md:top-1 fixed top-20 flex h-svh z-[49] ${isOpen ? "border-l border-gray-500" : ""}`}>
      <div 
        className={`h-full bg-primary dark:bg-primary-dark text-gray-800 dark:text-white transition-all duration-300 ease-in-out 
          ${isOpen ? 'w-48 md:w-64' : 'w-0'} overflow-hidden`}
      >
        {/* Sidebar Content */}
        <div className="p-1">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white pl-2 pt-2">{bookId}</h2>
          
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search poems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[calc(100%-8px)] mx-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Book List */}
          <div className="space-y-2 p-1 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {filteredPoems?.map((poem) => (
              <Link
                key={poem.title_en}
                href={`/books/${bookId}/${poem.title_en.toLowerCase().replace(/ /g, "-")}`}
                ref={poem.title_en === currentPoemId ? activeLinkRef : null}
                className={`block p-2 rounded-lg transition-colors ${
                  poem.title_en === currentPoemId
                    ? 'bg-blue-500/10 dark:bg-blue-500/30 text-blue-900 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                }`}
              >
                <div className="block text-sm font-bold truncate font-nastaliq" aria-description={poem.title_en + poem.title_ur}>
                  {poem.title_ur.toProperCase()}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="h-12 absolute right-0 px-2 gap-2 bg-primary dark:bg-primary-dark text-gray-800 dark:text-white flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? "" : <h2 className="sm:text-md font-bold text-sm text-nowrap ">{bookId}</h2>}
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-90'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default Sidebar; 