"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/hooks/useDebounce";

// Import components from the search folder
import {
	LoadingSpinner,
	ErrorDisplay,
	NoResults,
	ResultCard,
	Pagination,
	ResultsHeader,
	CompactFilterSection,
	EmptyState,
	DEFAULT_BOOKS,
	SearchResultsSkeleton,
} from "@/components/search";

// ========== Main Search Results Component ==========
export default function SearchResults() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Get URL params with defaults - support both "query" and "q" parameter names
	const initialQuery = searchParams.get("query") || searchParams.get("q") || "";
	const initialContentType = searchParams.get("contentType") || "all";
	const initialBookId = searchParams.get("bookId") || "";
	const initialPage = parseInt(searchParams.get("page") || "1");

	// State
	const [query, setQuery] = useState(initialQuery);
	const [contentType, setContentType] = useState(initialContentType);
	const [bookId, setBookId] = useState(initialBookId);
	const [page, setPage] = useState(initialPage);
	const [results, setResults] = useState([]);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
	});
	const [loading, setLoading] = useState(true);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [error, setError] = useState(null);

	// Toggle filter expansion
	const toggleFilters = useCallback(() => {
		setFiltersExpanded((prev) => !prev);
	}, []);

	// Use debounce to avoid too many API calls
	const debouncedQuery = useDebounce(query, 300);

	// Helper to update URL params and maintain search state
	const updateURLParams = useCallback(
		(params) => {
			const newParams = new URLSearchParams(searchParams);

			// Always use "query" as the parameter name for consistency
			if (params.query !== undefined) {
				if (params.query) {
					newParams.set("query", params.query);
					// Remove "q" parameter if it exists to avoid duplication
					newParams.delete("q");
				} else {
					newParams.delete("query");
					newParams.delete("q");
				}
				delete params.query; // Remove from params to avoid setting it twice
			}

			Object.entries(params).forEach(([key, value]) => {
				if (value) {
					newParams.set(key, value);
				} else {
					newParams.delete(key);
				}
			});

			router.push(`${pathname}?${newParams.toString()}`);
		},
		[pathname, router, searchParams]
	);

	// Modify the performSearch function to use performSearchWithPage
	const performSearch = useCallback(
		(resetPage = true, contentTypeParam, languageParam, bookIdParam) => {
			const searchPage = resetPage ? 1 : page;

			// Use parameters if provided, otherwise use state values
			const finalContentType = contentTypeParam !== undefined ? contentTypeParam : contentType;
			const finalBookId = bookIdParam !== undefined ? bookIdParam : bookId;

			// If we're on the search page, update the URL params
			if (pathname === "/search") {
				updateURLParams({
					query,
					contentType: finalContentType,
					bookId: finalBookId,
					page: searchPage.toString(),
				});
			}

			// Build search params for the API call
			const params = new URLSearchParams();
			params.append("query", query.trim());
			params.append("contentType", finalContentType);
			params.append("page", searchPage.toString());
			params.append("limit", "10"); // Fixed limit

			if (finalBookId) {
				params.append("bookId", finalBookId);
			}

			// Execute search with these parameters
			setLoading(true);
			setHasSearched(true);

			// Define an async function and immediately invoke it
			const fetchResults = async () => {
				try {
					// Fetch search results
					const response = await fetch(`/api/search?${params.toString()}`);

					if (!response.ok) {
						throw new Error(`Search failed: ${response.statusText}`);
					}

					const data = await response.json();
					// Update state with results
					setResults(data.results || []);
					setPagination(
						data.pagination || { page: searchPage, limit: 10, total: 0, totalPages: 0 }
					);
				} catch (err) {
					setError(err.message);
					setResults([]);
					setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
				} finally {
					setLoading(false);
				}
			};

			// Execute the async function
			fetchResults();
		},
		[query, contentType, bookId, page, pathname, updateURLParams]
	);

	// Handle page change
	const handlePageChange = (newPage) => {
		// First update the URL with the new page number
		updateURLParams({
			page: newPage.toString(),
		});

		// Then scroll to top for better UX
		window.scrollTo({ top: 0, behavior: "smooth" });

		// Update local state and perform search with the explicit new page number
		setPage(newPage);

		// Always clear previous errors
		setError(null);

		// Require at least 1 character for search
		if (!query.trim()) {
			setResults([]);
			setPagination({ page: newPage, limit: 10, total: 0, totalPages: 0 });
			setHasSearched(true);
			return;
		}

		setLoading(true);

		// Build search params for the API call
		const params = new URLSearchParams();
		params.append("query", query.trim());
		params.append("contentType", contentType);
		params.append("page", newPage.toString());
		params.append("limit", "10"); // Fixed limit

		if (bookId) {
			params.append("bookId", bookId);
		}

		// Define an async function and immediately invoke it
		const fetchResults = async () => {
			try {
				// Fetch search results
				const response = await fetch(`/api/search?${params.toString()}`);

				if (!response.ok) {
					throw new Error(`Search failed: ${response.statusText}`);
				}

				const data = await response.json();

				// Update state with results
				setResults(data.results || []);
				setPagination(
					data.pagination || { page: newPage, limit: 10, total: 0, totalPages: 0 }
				);
			} catch (err) {
				setError(err.message);
				setResults([]);
				setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
			} finally {
				setLoading(false);
			}
		};

		// Execute the async function
		fetchResults();
	};

	// If query changes, reset to page 1
	useEffect(() => {
		if (debouncedQuery !== initialQuery) {
			setPage(1);
		}
	}, [debouncedQuery, initialQuery]);

	// Auto-search when component mounts or URL parameters change
	useEffect(() => {
		if (initialQuery.trim()) {
			setQuery(initialQuery);
			setContentType(initialContentType);
			setBookId(initialBookId);

			// Always clear previous errors
			setError(null);

			// Use the explicit page number passed in
			const searchPage = initialPage;

			// Don't perform search if there's no query
			if (!initialQuery.trim()) {
				setResults([]);
				setPagination({ page: searchPage, limit: 10, total: 0, totalPages: 0 });
				setHasSearched(true);
				return;
			}

			setLoading(true);
			setHasSearched(true);

			// Build search params
			const params = new URLSearchParams();
			params.append("query", initialQuery.trim());
			params.append("contentType", initialContentType);
			params.append("page", searchPage.toString());
			params.append("limit", "10"); // Fixed limit

			if (initialBookId) {
				params.append("bookId", initialBookId);
			}

			// Define an async function and immediately invoke it
			const fetchResults = async () => {
				try {
					// Fetch search results
					const response = await fetch(`/api/search?${params.toString()}`);

					if (!response.ok) {
						throw new Error(`Search failed: ${response.statusText}`);
					}

					const data = await response.json();

					// Update state with results
					setResults(data.results || []);
					setPagination(
						data.pagination || { page: searchPage, limit: 10, total: 0, totalPages: 0 }
					);
				} catch (err) {
					setError(err.message);
					setResults([]);
					setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
				} finally {
					setLoading(false);
				}
			};

			// Execute the async function
			fetchResults();
		}
	}, [initialQuery, initialPage, initialContentType, initialBookId]);
   
	return (
		<div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-primary dark:bg-primary-dark transition-colors">
			{/* Loading State */}
			{loading && <SearchResultsSkeleton count={7} />}

			{/* Error State */}
			{error && !loading && <ErrorDisplay error={error} />}

			{/* Empty Query Notice */}
			{!initialQuery && !loading && <EmptyState />}

			{/* Search Results */}
			{!loading && !error && initialQuery && (
				<>
					{/* Filters Section (at the top) */}
					{initialQuery  && !error && (
						<CompactFilterSection
							contentType={contentType}
							setContentType={setContentType}					
							bookId={bookId}
							setBookId={setBookId}
							availableBooks={DEFAULT_BOOKS}
							performSearch={performSearch}
							isExpanded={filtersExpanded}
							toggleExpanded={toggleFilters}
						/>
					)}
					{/* Results Header */}
					{hasSearched && <ResultsHeader pagination={pagination} />}

					{/* Results Grid */}
					<div className="space-y-6">
						<AnimatePresence mode="wait">
							{results.length > 0 ? (
								<motion.div
									key="results"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="grid grid-cols-1 gap-2"
								>
									{results.map((item, index) => (
										<ResultCard
											key={`${item.id}-${index}`}
											item={item}
											index={index}
											query={initialQuery}
										/>
									))}
								</motion.div>
							) : (
								hasSearched && !loading && <NoResults />
							)}
						</AnimatePresence>
					</div>

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<Pagination pagination={pagination} handlePageChange={handlePageChange} />
					)}
				</>
			)}
		</div>
	);
}
