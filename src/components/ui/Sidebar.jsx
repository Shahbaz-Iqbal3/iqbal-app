"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Sidebar Skeleton Loader
export function SidebarSkeleton() {
  return (
    <div className="w-64 h-screen bg-gray-200 dark:bg-gray-700 animate-pulse p-4">
      <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
      <div className="mb-4">
        <div className="h-8 w-full bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-6 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
        ))}
      </div>
    </div>
  );
}

const Sidebar = ({ isOpen, onToggle, bookId, poems, slug }) => {
  const activeLinkRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (activeLinkRef.current && isOpen) {
      activeLinkRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [slug, isOpen]);

  const filteredPoems = poems?.filter(poem => 
    poem.title_ur.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poem.title_en.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <div className={`md:sticky md:top-1 fixed top-20 flex h-svh z-[49] ${isOpen ? "border-l border-gray-500" : ""}`}>
      <div 
        className={`h-full bg-primary dark:bg-primary-dark text-gray-800 dark:text-white transition-all duration-300 ease-in-out 
          ${isOpen ? 'w-48 md:w-64' : 'w-0 md:w-64'} overflow-hidden`}
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
            {filteredPoems?.map((poem) => {
              const normalizedTitle = poem.title_en.toLowerCase().replace(/ /g, "-");
              const normalizedSlug = slug.toLowerCase();
              return (
                <Link
                  key={poem.title_en}
                  href={`/books/${bookId}/${normalizedTitle}`}
                  ref={normalizedTitle === normalizedSlug ? activeLinkRef : null}
                  className={`block p-2 rounded-lg transition-colors duration-200
                    ${normalizedTitle === normalizedSlug
                      ? 'bg-blue-600/80 dark:bg-blue-400/30 text-white dark:text-blue-100 font-bold shadow-md'
                      : 'hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200'}
                  `}
                >
                  <div className="block text-sm font-bold truncate font-nastaliq" aria-description={poem.title_en + poem.title_ur}>
                    {poem.title_ur}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Sidebar; 