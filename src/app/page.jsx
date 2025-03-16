"use client";
import { Hero, Card } from "@/components";
import { useEffect, useState } from "react";

const HomePage = () => {
	const [books, setBooks] = useState([]);
	const [error, setError] = useState(null);

	const getData = async () => {
		try {
			const response = await fetch("/api/books");
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			setBooks(data.data);
			
		} catch (error) {
			setError(error.message);
		}
	};

	useEffect(() => {
		getData();
	}, []);
	// Display homepage content
	return (
		<div className="">
			<Hero />
			<div className="p-3 w-full mt-6">
				<h2 className=" text-center md:text-6xl text-4xl text-gray-800 dark:text-gray-200">Books</h2>
				<div className="flex container mx-auto mt-6 flex-wrap justify-center gap-5">
					{books.map((book, index) => (
						<div key={index}>
							<Card image={book.cover_image_url} link={`/books/${book.title_en}`} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
