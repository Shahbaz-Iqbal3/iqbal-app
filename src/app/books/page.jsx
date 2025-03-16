"use client";

import { Card } from "@/components";
import { useEffect, useState } from "react";

const BooksPage = () => {
	const [books, setBooks] = useState([]);
	const [error, setError] = useState(null);

	// Fetch Books Data
	const getData = async () => {
		try {
			const response = await fetch("/api/books");
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();
			setBooks(data.data);
		} catch (error) {
			setError(error.message);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
			<div className="p-3 w-full mt-6">
				<h2 className="text-center text-6xl font-serif dark:text-gray-200">Books</h2>
				{error ? (
					<p className="text-center text-red-500 dark:text-red-400">{error}</p>
				) : (
					<div className="flex container mx-auto mt-6 flex-wrap justify-center gap-5">
						{books.map((book, index) => (
							<div key={index}>
								<Card image={book.cover_image_url} link={`/books/${book.title_en}`} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default BooksPage;
