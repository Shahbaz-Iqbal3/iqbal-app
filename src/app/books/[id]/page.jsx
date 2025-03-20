"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import { Suspense } from "react";

// Loading skeleton component
const SkeletonLoader = () => (
	<div className="animate-pulse">
		<div className="flex flex-col md:flex-row gap-6 p-4">
			<div className="bg-gray-700 rounded-xl h-[300px] w-full md:w-[250px]"></div>
			<div className="w-full space-y-4">
				<div className="h-8 bg-gray-700 rounded w-3/4"></div>
				<div className="h-4 bg-gray-700 rounded w-1/4"></div>
				<div className="h-4 bg-gray-700 rounded w-full"></div>
				<div className="h-4 bg-gray-700 rounded w-full"></div>
				<div className="h-4 bg-gray-700 rounded w-1/2"></div>
			</div>
		</div>
		<div className="mt-8">
			<div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{[...Array(13)].map((_, i) => (
					<div key={i} className="h-24 bg-gray-700 rounded"></div>
				))}
			</div>
		</div>
	</div>
);

// Error component
const ErrorDisplay = ({ message }) => (
	<div className="flex flex-col items-center justify-center p-10 text-center">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-12 w-12 text-red-500 mb-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		</svg>
		<h3 className="text-xl font-medium">Something went wrong</h3>
		<p className="text-gray-400 mt-2">
			{message || "Failed to load content. Please try again later."}
		</p>
		<button
			onClick={() => window.location.reload()}
			className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
		>
			Retry
		</button>
	</div>
);

// PoemCard component for better code organization
const PoemCard = ({ poem, book }) => (
	<div className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 flex flex-col h-full border border-gray-200 dark:border-gray-700/50 hover:shadow-md hover:shadow-blue-900/50">
		<div className="relative overflow">
			{/* Order number badge */}
			<div className="absolute top-3 left-3 z-10">
				<div className="bg-gray-100 dark:bg-gray-900/80 backdrop-blur-sm text-blue-600 dark:text-blue-400 rounded-lg px-4 w-7 h-7 flex justify-center items-center font-medium text-sm border border-gray-200 dark:border-gray-700/50 shadow-sm">
					{poem.content_order}
				</div>
				<div className="bg-gray-100 dark:bg-gray-900/80 backdrop-blur-sm text-blue-600 dark:text-blue-400 rounded-lg px-4 w-7 h-7 flex justify-center items-center font-medium text-sm border border-gray-200 dark:border-gray-700/50 shadow-sm group-hover:opacity-100 opacity-0 transition-opacity absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none">
					↗
				</div>
			</div>
		</div>
		<Link
			href={`/books/${book.title_en}/${poem.title_en?.replace(/ /g, "-").toLowerCase()}`}
			className="flex-1 p-4 block"
		>
			{/* Main heading */}
			<div className="">
				<h3 className="text-xl font-urdu leading-[3] pr-2 line-clamp-1 min-h-[4rem] text-gray-900 dark:text-white" dir="rtl">
					{poem.title_ur || "عنوان موجود نہیں"}
				</h3>
			</div>
			<p className="text-gray-600 dark:text-gray-300 font-medium line-clamp-1 capitalize">
				{poem.title_en.toLowerCase() || "Title not available"}
			</p>
		</Link>

		{/* Interactive hover effect */}
		<div className="group-hover:opacity-100 opacity-0 transition-opacity absolute inset-0 bg-gradient-to-b  dark:from-blue-900/10 to-transparent pointer-events-none"></div>
	</div>
);

const BookDetails = () => {
	const params = useParams();
	const { id } = params;
	const [bookContents, setBookContents] = useState([]);
	const [book, setBook] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	// Memoized filtered poems for better performance
	const filteredPoems = useCallback(() => {
		if (!bookContents?.length) return [];

		return bookContents.filter((poem) => {
			const searchLower = searchQuery.toLowerCase();
			return (
				poem.title_ur?.toLowerCase().includes(searchLower) ||
				poem.title_en?.toLowerCase().includes(searchLower)
			);
		});
	}, [bookContents, searchQuery]);

	// Fetch book data
	useEffect(() => {
		const fetchBookContents = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/books/listofpoem?book_id=${id}`);

				if (!response.ok) {
					throw new Error(`Failed to fetch book: ${response.status}`);
				}

				const data = await response.json();
				setBookContents(data.data || []);
				setBook(data.book || {});
				setError(null);
			} catch (error) {
				console.error("Error fetching book contents", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchBookContents();
	}, [id]);

	// For SEO
	const pageTitle = book?.title_en ? `${book.title_en} | Poetry Collection` : "Book Details";
	const pageDescription = book?.description || "Explore this beautiful collection of poems";

	const poemsToDisplay = filteredPoems();

	return (
		<>
			{/* SEO Metadata */}
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageDescription} />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={pageDescription} />
				{book?.cover_image_url && <meta property="og:image" content={book.cover_image_url} />}
				<meta name="twitter:card" content="summary_large_image" />
			</Head>

			<main className="bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 min-h-screen text-gray-900 dark:text-gray-100">
				<div className="container mx-auto px-4 py-6 max-w-6xl">
					{/* Error state */}
					{error && <ErrorDisplay message={error} />}

					{/* Loading state */}
					{loading && !error ? (
						<SkeletonLoader />
					) : (
						!error && (
							<>
								{/* Book details section */}
								<section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
									<div className="flex flex-col md:flex-row">
										{/* Book cover with responsive sizing */}
										<div className="relative w-full md:w-auto">
											<div className="md:h-[400px] md:w-[300px] h-[500px] relative">
												{book.cover_image_url ? (
													<Image
														src={book.cover_image_url}
														alt={book.title_en || "Book cover"}
														fill
														sizes="(max-width: 768px) 100vw, 300px"
														className="md:object-cover object-contain "
														priority={true}
														quality={80}
													/>
												) : (
													<div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
														<span className="text-gray-500">No cover image</span>
													</div>
												)}
											</div>
										</div>

										{/* Book details */}
										<div className="flex-1 p-6">
											<h1 className="text-3xl font-bold mb-2 tracking-tight text-gray-900 dark:text-gray-300">
												{book.title_ur && (
													<span className="font-urdu block mb-3">({book.title_ur})</span>
												)}
												{book.title_en}
											</h1>

											<div className="flex flex-wrap gap-2 mt-4">
												<span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
													{book.book_lang || "Unknown language"}
												</span>
												<span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
													{bookContents.length} poems
												</span>
											</div>

											<div className="mt-6">
												<h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">About this collection</h2>
												<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
													{book.description || "No description available for this book."}
												</p>
											</div>
										</div>
									</div>
								</section>

								{/* Poems section with search and filters */}
								<section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
									<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
										<h2 className="text-2xl font-bold text-gray-900 dark:text-white">Poems</h2>

										<div className="relative w-full md:w-64">
											<input
												type="text"
												placeholder="Search poems..."
												className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												aria-label="Search poems"
											/>
											<svg
												className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
												/>
											</svg>
										</div>
									</div>

									{/* Poems grid */}
									{poemsToDisplay.length > 0 ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
											{poemsToDisplay.map((poem) => (
												<PoemCard key={poem.id} poem={poem} book={book} />
											))}
										</div>
									) : (
										<div className="py-12 text-center">
											<svg
												className="mx-auto h-12 w-12 text-gray-400 mb-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
												/>
											</svg>
											<h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">No poems found</h3>
											<p className="text-gray-500 mt-2">
												Try adjusting your search or filters
											</p>
											{searchQuery && (
												<button
													onClick={() => setSearchQuery("")}
													className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
												>
													Clear search
												</button>
											)}
										</div>
									)}
								</section>
							</>
						)
					)}
				</div>
			</main>
		</>
	);
};

export default function PoemPage() {
	return (
		<Suspense fallback={<SkeletonLoader />}>
			<BookDetails />
		</Suspense>
	);
}
