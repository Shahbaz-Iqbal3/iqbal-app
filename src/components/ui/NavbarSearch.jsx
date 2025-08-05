"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';

const NavbarSearch = () => {
  // Next.js navigation and URL helpers
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';
  const initialQuery = searchParams.get('query') || searchParams.get('q') || '';

  // UI state
  const [expanded, setExpanded] = useState(isSearchPage || !!initialQuery); // Controls expanded/collapsed state
  const [isMobile, setIsMobile] = useState(false); // Tracks mobile view
  const [isSearching, setIsSearching] = useState(false); // Shows loading spinner
  const [query, setQuery] = useState(initialQuery); // Search input value
  const [isInputFocused, setIsInputFocused] = useState(false); // Tracks if input is focused
  const inputRef = useRef(null); // Ref for input focus

  // Sync input with URL query param, unless user is typing
  useEffect(() => {
    const newQuery = searchParams.get('query') || searchParams.get('q') || '';
    if (newQuery !== query && !isInputFocused) {
      setQuery(newQuery);
    }
    // Expand search on search page (mobile only)
    if (isSearchPage && isMobile) {
      setExpanded(true);
    }
  }, [searchParams, isSearchPage, isMobile, query, isInputFocused]);

  // Keep search expanded on search page (mobile view)
  useEffect(() => {
    if (isSearchPage && isMobile) {
      setExpanded(true);
    }
  }, [expanded, isMobile]);

  // Update mobile state on screen resize
  useEffect(() => {
    const checkScreenSize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      if (isSearchPage && newIsMobile) {
        setExpanded(true);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isSearchPage]);

  // Auto-focus input when expanded on mobile
  useEffect(() => {
    if (expanded && inputRef.current && isMobile) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [expanded, isMobile]);

  // Handle search form submit
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery && !isSearching) {
      setIsSearching(true);
      const encodedQuery = encodeURIComponent(trimmedQuery);
      // Navigate to search page with query
      router.push(`/search?q=${encodedQuery}&contentType=all&page=1`);
      // Show spinner briefly
      setTimeout(() => {
        setIsSearching(false);
      }, 500);
    }
  }, [query, router, isSearching]);

  // Toggle search bar on mobile
  const toggleSearch = useCallback(() => {
    if (isMobile) {
      setExpanded(prev => !prev);
      if (!expanded && inputRef.current) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 150);
      }
    }
  }, [isMobile, expanded]);

  // Update input value as user types
  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  // Track input focus/blur for sync logic
  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);
  const handleInputBlur = useCallback(() => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 100);
  }, []);

  // Clear input and URL query param
  const clearQuery = useCallback(() => {
    setQuery('');
    if (isSearchPage) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('q');
      newParams.delete('query');
      const newPathname = pathname + (newParams.toString() ? `?${newParams.toString()}` : '');
      router.replace(newPathname, { scroll: false });
    }
  }, [isSearchPage, searchParams, pathname, router]);

  return (
    <div className="relative w-full">
      {/* Mobile overlay/backdrop for expanded search */}
      {expanded && isMobile && (
        <div 
          className="fixed w-full h-16 inset-0 bg-white dark:bg-secondary-dark z-10 md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}
      <div className={`
        flex items-center transition-all duration-300 ease-in-out gap-1 
        ${(expanded && isMobile) ? 'fixed right-0 top-0 left-0 z-20' : 'relative'}
        ${(expanded || !isMobile) ? 'calc(100%-20px) m-4 md:m-0 xs:w-[300px] md:w-[450px]' : 'w-auto'}
      `}>
        {/* Search form */}
        {(expanded || !isMobile) && (
          <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-white dark:bg-gray-700 rounded-full border-[1px] dark:border-gray-500 border-gray-300 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Search poetry..."
              className="w-full bg-transparent inset-1 outline-none px-4 text-base text-gray-800 dark:text-gray-100 placeholder-gray-400"
              autoComplete="off"
              disabled={isSearching}
            />
            {/* Clear button */}
            {query && !isSearching && (
              <button 
                type="button" 
                onClick={clearQuery}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            {/* Search button with spinner */}
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="p-2 px-6 rounded-e-full border-s-[1px] dark:border-gray-500 border-gray-300 text-primary-500 dark:text-primary-400 hover:bg-slate-200 bg-slate-100 dark:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              aria-label={isSearching ? "Searching..." : "Submit search"}
            >
              {isSearching ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Search size={18} />
              )}
            </button>
          </form>
        )}
        {/* Mobile search toggle button */}
        {isMobile && (
          <button 
            type="button"
            onClick={toggleSearch}
            className="rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label={expanded ? "Close search" : "Open search"}
          >
            {expanded ? <X size={24} className='font-bold'/> : <Search size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default NavbarSearch; 