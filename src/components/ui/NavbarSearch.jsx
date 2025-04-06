"use client";
import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Search, X, Book, Hash, FileText, BookOpen, History, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDebounce } from "@/app/hooks/useDebounce";
import { DEFAULT_BOOKS } from '../search';

// Custom hook for detecting language from text
const useLanguageClass = (text, explicitLanguage) => {
  return useMemo(() => {
    // If explicitly specified language, use that
    if (explicitLanguage === 'ur') return 'font-nastaliq text-lg';
    if (explicitLanguage === 'en') return '';
    if (explicitLanguage === 'ro') return 'font-normal';
    
    // Otherwise detect from text
    if (text && /[\u0600-\u06FF]/.test(text)) return 'font-nastaliq text-lg';
    return '';
  }, [text, explicitLanguage]);
};

// Custom hook for managing recent searches
const useRecentSearches = (maxSearches = 10) => {
  const [recentSearches, setRecentSearches] = useState([]);
  
  // Load searches on mount
  useEffect(() => {
    try {
      const storedSearches = localStorage.getItem('recentSearches');
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
      setRecentSearches([]);
    }
  }, []);
  
  // Update localStorage when state changes
  const saveToStorage = useCallback((searches) => {
    try {
      localStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  }, []);
  
  // Add a search term to history
  const addSearch = useCallback((term) => {
    if (!term || term.trim().length === 0) return;
    
    const cleanTerm = term.trim();
    
    setRecentSearches(prev => {
      // Create new array with the new term at the beginning
      const updatedSearches = [cleanTerm];
      
      // Add existing terms that aren't the same as the new one
      prev.forEach(existingTerm => {
        if (existingTerm.toLowerCase() !== cleanTerm.toLowerCase() && updatedSearches.length < maxSearches) {
          updatedSearches.push(existingTerm);
        }
      });
      
      // Save to localStorage
      saveToStorage(updatedSearches);
      
      return updatedSearches;
    });
  }, [maxSearches, saveToStorage]);
  
  // Remove a specific search
  const removeSearch = useCallback((term) => {
    setRecentSearches(prev => {
      const updatedSearches = prev.filter(
        existingTerm => existingTerm !== term
      );
      
      saveToStorage(updatedSearches);
      return updatedSearches;
    });
  }, [saveToStorage]);
  
  // Clear all searches
  const clearSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('recentSearches');
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  }, []);
  
  return { recentSearches, addSearch, removeSearch, clearSearches };
};

// Helper for rendering suggestion icons
const SuggestionIcon = memo(({ type }) => {
  switch (type) {
    case 'book':
      return <Book size={16} className="text-blue-500 dark:text-blue-400" />;
    case 'poem':
      return <BookOpen size={16} className="text-green-500 dark:text-green-400" />;
    case 'content':
      return <FileText size={16} className="text-amber-500 dark:text-amber-400" />;
    default:
      return <Hash size={16} className="text-purple-500 dark:text-purple-400" />;
  }
});

// Move useLanguageClass outside of render method
const SuggestionItem = memo(({ suggestion, onSuggestionClick }) => {
  const languageClass = useLanguageClass(suggestion.text || '', suggestion.language);
  const bookTitle = suggestion.type === 'poem' && suggestion.book_id
    ? DEFAULT_BOOKS.find(book => book.id === suggestion.book_id)?.title_en
    : null;

  return (
    <li 
      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      onClick={(e) => onSuggestionClick(suggestion, e)}
    >
      <div className="flex items-center gap-2">
        <SuggestionIcon type={suggestion.type} />
        <div className="flex flex-col">
          <span className={`text-gray-800 dark:text-gray-200 line-clamp-1 capitalize ${languageClass}`}>
            {(suggestion.text || '').toLowerCase()}
          </span>
          {bookTitle && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              from {bookTitle}
            </span>
          )}
        </div>
      </div>
    </li>
  );
});

// SearchSuggestions component
const SearchSuggestions = memo(({ 
  isLoading,
  query,
  suggestions, 
  recentSearches,
  onSuggestionClick,
  onRecentSearchClick,
  onRemoveSearch,
  onClearSearches,
  suggestionsRef,
  isMobile
}) => {
  if (!suggestionsRef) return null;
  
  return (
    <div 
      ref={suggestionsRef}
      className={`
        absolute left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 
        border border-gray-200 dark:border-gray-700 overflow-y-auto
        ${isMobile ? 'fixed top-[60px] max-h-[calc(100vh-120px)]' : 'top-full mt-1 max-h-80'} 
        rounded-md
      `}
    >
      {/* Loading state */}
      {isLoading && query.length >= 2 && (
        <SuggestionLoadingState />
      )}

      {/* Recent searches */}
      {!query && recentSearches.length > 0 && !isLoading && (
        <RecentSearchesList 
          searches={recentSearches}
          onSearchClick={onRecentSearchClick}
          onRemoveSearch={onRemoveSearch} 
          onClearAll={onClearSearches}
        />
      )}
      
      {/* Regular suggestions */}
      {suggestions.length > 0 && !isLoading && query.length >= 2 && (
        <SuggestionsList 
          suggestions={suggestions} 
          onSuggestionClick={onSuggestionClick} 
        />
      )}

      {/* No results */}
      {query.length >= 2 && suggestions.length === 0 && !isLoading && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No suggestions found for "{query}"
        </div>
      )}
      
      {/* No recent searches */}
      {!query && recentSearches.length === 0 && !isLoading && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No recent searches
        </div>
      )}
    </div>
  );
});

// Loading state component
const SuggestionLoadingState = memo(() => (
  <ul className="py-1">
    {Array.from({ length: 6 }).map((_, index) => (
      <li 
        key={`skeleton-${index}`}
        className="px-4 py-2 flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
        <div className="flex-1">
          <div className="h-8 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      </li>
    ))}
  </ul>
));

// Recent searches list component
const RecentSearchesList = memo(({ searches, onSearchClick, onRemoveSearch, onClearAll }) => (
  <>
    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <History size={12} />
        <span>Recent searches</span>
      </div>
      <button 
        onClick={onClearAll}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 text-xs"
        aria-label="Clear all recent searches"
      >
        <Trash2 size={12} />
        <span>Clear all</span>
      </button>
    </div>
    <ul className="py-1">
      {searches.map((term, index) => (
        <li 
          key={`recent-${index}`}
          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
          onClick={() => onSearchClick(term)}
        >
          <span className="text-gray-800 dark:text-gray-200 flex-1">{term}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveSearch(term);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label={`Remove ${term} from recent searches`}
          >
            <X size={14} />
          </button>
        </li>
      ))}
    </ul>
  </>
));

// Update SuggestionsList to use the new SuggestionItem component
const SuggestionsList = memo(({ suggestions, onSuggestionClick }) => (
  <ul className="py-1">
    {suggestions.map((suggestion, index) => (
      <SuggestionItem
        key={`${suggestion.type}-${index}`}
        suggestion={suggestion}
        onSuggestionClick={onSuggestionClick}
      />
    ))}
  </ul>
));

const NavbarSearch = () => {
  // Router and path state
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';
  const initialQuery = searchParams.get('query') || searchParams.get('q') || '';

  // UI state
  const [expanded, setExpanded] = useState(isSearchPage || !!initialQuery);
  const [isMobile, setIsMobile] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  
  // Input state
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  
  // Data state
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Refs
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigationTimeoutRef = useRef(null);
  
  // Custom hooks
  const { recentSearches, addSearch, removeSearch, clearSearches } = useRecentSearches(10);

  // Hide suggestions on navigation
  useEffect(() => {
    setShowSuggestions(false);
    setInputFocused(false);

    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  }, [pathname]);
  
  // Update suggestions visibility based on focus state and query
  useEffect(() => {
    // Don't show suggestions during navigation timeout
    if (navigationTimeoutRef.current) {
      setShowSuggestions(false);
      return;
    }

    // Don't show suggestions if not focused
    if (!inputFocused) {
      setShowSuggestions(false);
      return;
    }

    // Show loading state
    if (loading && query.length >= 2) {
      setShowSuggestions(true);
      return;
    }

    // Show suggestions based on conditions
    if (query.length >= 2) {
      setShowSuggestions(true);
    } else if (!query && recentSearches.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [inputFocused, query, loading, recentSearches.length, navigationTimeoutRef.current]);
  
  // Handle URL parameter changes
  useEffect(() => {
    const newQuery = searchParams.get('query') || searchParams.get('q') || '';
    setQuery(newQuery);
    
    // Reset internal state based on URL parameters
    if (searchParams.get('selected') !== 'true') {
      // Only reset loading state
      if (newQuery && newQuery.length >= 2) {
        setLoading(false);
      }
    } else {
      // Keep suggestions hidden when selected=true
    setShowSuggestions(false);
    }
    
    // Expand search on search page (mobile only)
    if (isSearchPage && isMobile) {
      setExpanded(true);
    }
  }, [searchParams, isSearchPage, isMobile]);
  
  // Keep search expanded on search page (mobile view)
  useEffect(() => {
    if (isSearchPage && isMobile) {
      setExpanded(true);
    }
  }, [pathname, isMobile, isSearchPage]);

  // Handle screen size changes
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

  // Focus input when search is expanded on mobile
  useEffect(() => {
    if (expanded && inputRef.current && isMobile) {
      // Use a short delay to avoid focus during navigation
      setTimeout(() => {
        if (inputRef.current) {
      inputRef.current.focus();
        }
      }, 100);
    }
  }, [expanded, isMobile]);

  // Handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target)
      ) {
        // Always hide suggestions on outside click
        setShowSuggestions(false);
        setInputFocused(false);

        // Only collapse search on mobile (except on search page)
        if (expanded && isMobile && !isSearchPage) {
          setExpanded(false);
          setQuery('');
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded, isMobile, isSearchPage]);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      
      // Don't fetch if selected=true (coming from a selection)
      if (searchParams.get('selected') === 'true') {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(debouncedQuery)}`);
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        
        // Only show suggestions if input is still focused
        if (inputFocused) {
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [debouncedQuery, searchParams, inputFocused]);

  // Handler functions - wrapped in useCallback for stability
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      // Ensure suggestions are hidden immediately
      setShowSuggestions(false);
      setInputFocused(false);
      
      // Save to recent searches
      addSearch(trimmedQuery);
      
      // Set navigation timeout to prevent immediate focus events
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      navigationTimeoutRef.current = setTimeout(() => {
        navigationTimeoutRef.current = null;
      }, 500);
      
      const encodedQuery = encodeURIComponent(trimmedQuery);
      router.push(`/search?q=${encodedQuery}&contentType=all&language=all&page=1&selected=true`);
      
      // Only collapse on mobile if not on search page
      if (isMobile && !isSearchPage) {
        setExpanded(false);
      }
    }
  }, [query, addSearch, router, isMobile, isSearchPage]);

  const handleSuggestionClick = useCallback((suggestion, e) => {
    // Prevent default form submission if event exists
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Clear any existing navigation timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Update query state first
    setQuery(suggestion.text);
    
    // Add to recent searches
    addSearch(suggestion.text);
    
    // Hide suggestions and reset focus state
    setShowSuggestions(false);
    setInputFocused(false);
    
    // Set a navigation timeout to prevent immediate focus events
    navigationTimeoutRef.current = setTimeout(() => {
      navigationTimeoutRef.current = null;
      
      // Determine the target URL based on suggestion type
      const encodedQuery = encodeURIComponent(suggestion.text);
      const targetUrl = suggestion.type === 'book' && suggestion.id
        ? `/books/${suggestion.text}`
        : `/search?q=${encodedQuery}&contentType=all&language=all&page=1&selected=true`;
      
      // Navigate to the target URL
      router.push(targetUrl);
      
      // Handle mobile view collapse
      if (isMobile) {
        // Only collapse if not navigating to search page
        const isNavigatingToSearch = targetUrl.startsWith('/search');
        if (!isNavigatingToSearch) {
          setExpanded(false);
        }
      }
    }, 100); // Reduced timeout for better responsiveness
  }, [addSearch, router, isMobile]);

  const handleRecentSearchClick = useCallback((term) => {
    // Ensure suggestions are hidden immediately
    setShowSuggestions(false);
    setInputFocused(false);
    
    // Set navigation timeout to prevent immediate focus events
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    navigationTimeoutRef.current = setTimeout(() => {
      navigationTimeoutRef.current = null;
    }, 500);
    
    setQuery(term);
    addSearch(term);
    
    const encodedQuery = encodeURIComponent(term);
    router.push(`/search?q=${encodedQuery}&contentType=all&language=all&page=1&selected=true`);
    
    if (isMobile && !isSearchPage) {
      setExpanded(false);
    }
  }, [addSearch, router, isMobile, isSearchPage]);

  const handleRemoveSearch = useCallback((term, e) => {
    // Prevent the click from propagating to parent elements
    e.stopPropagation();
    
    removeSearch(term);
  }, [removeSearch]);

  const handleClearSearches = useCallback((e) => {
    // Prevent the click from propagating
    e.stopPropagation();
    
    clearSearches();
  }, [clearSearches]);

  const toggleSearch = useCallback(() => {
    if (isMobile) {
      setExpanded(prev => !prev);
      setShowSuggestions(false);
      
      if (!expanded && inputRef.current) {
        setTimeout(() => {
          if (inputRef.current) {
          inputRef.current.focus();
          }
        }, 150);
      }
    }
  }, [isMobile, expanded]);

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
    
    // Clear the "selected" parameter
    if (searchParams.get('selected') === 'true') {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('selected');
      const newPathname = pathname + (newParams.toString() ? `?${newParams.toString()}` : '');
      router.replace(newPathname, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const handleInputFocus = useCallback(() => {
    // Set focused state
    setInputFocused(true);
    
    // If we're in a navigation timeout, don't show suggestions
    if (navigationTimeoutRef.current) {
      return;
    }
    
    // Reset "selected" parameter
    if (searchParams.get('selected') === 'true') {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('selected');
      const newPathname = pathname + (newParams.toString() ? `?${newParams.toString()}` : '');
      router.replace(newPathname, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const handleInputBlur = useCallback(() => {
    // Use a shorter delay for better responsiveness
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setInputFocused(false);
        setShowSuggestions(false);
      }
    }, 100);
  }, []);

  const clearQuery = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      {/* Mobile overlay/backdrop */}
      {expanded && isMobile && (
        <div 
          className="fixed w-full h-16 inset-0 bg-white dark:bg-secondary-dark z-10 md:hidden"
          onClick={() => {
            setExpanded(false);
            setShowSuggestions(false);
          }}
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
            />
            
            {/* Clear button */}
            {query && (
              <button 
                type="button" 
                onClick={clearQuery}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
           
            {/* Search button */}
            <button
              type="submit"
              className="p-2 px-6 rounded-e-full border-s-[1px] dark:border-gray-500 border-gray-300 text-primary-500 dark:text-primary-400 hover:bg-slate-200 bg-slate-100 dark:bg-gray-600"
              aria-label="Submit search"
            >
               <Search size={18} />
            </button>
            
            {/* Suggestions dropdown */}
            {showSuggestions && (
              <SearchSuggestions
                isLoading={loading}
                query={query}
                suggestions={suggestions}
                recentSearches={recentSearches}
                onSuggestionClick={handleSuggestionClick}
                onRecentSearchClick={handleRecentSearchClick}
                onRemoveSearch={handleRemoveSearch}
                onClearSearches={handleClearSearches}
                suggestionsRef={suggestionsRef}
                isMobile={isMobile}
              />
            )}
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