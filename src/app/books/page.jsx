"use client";

import { Card } from "@/components";
import { useEffect, useState } from "react";

const BooksPage = () => {
	const [books, setBooks] = useState([]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch Books Data
	const getData = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/books");
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();
			setBooks(data.data);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	// Generate skeleton cards for loading state
	const renderSkeletonCards = () => {
		return Array(11).fill(0).map((_, index) => (
			<div key={`skeleton-${index}`}>
				<Card isLoading={true} />
			</div>
		));
	};

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
			<div className="p-3 w-full mt-6">
				<h2 className="text-center text-6xl font-serif dark:text-gray-200">Books</h2>
				{error ? (
					<p className="text-center text-red-500 dark:text-red-400">{error}</p>
				) : (
					<div className="container mx-auto mt-6 grid grid-cols-2 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{isLoading ? (
							renderSkeletonCards()
						) : (
							books.map((book, index) => (
								<div key={index}>
									<Card image={book.cover_image_url} link={`/books/${book.title_en}`} />
								</div>
							))
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default BooksPage;
