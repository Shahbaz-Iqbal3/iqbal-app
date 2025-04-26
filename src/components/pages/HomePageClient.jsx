"use client";
import { Hero, Card } from "@/components";
import { useEffect, useState } from "react";
import PoemLinks from "../ui/PoemLinks";

const HomePageClient = () => {
	const [books, setBooks] = useState([]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const getData = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/books");
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
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
		return Array(11)
			.fill(0)
			.map((_, index) => (
				<div key={`skeleton-${index}`}>
					<Card isLoading={true} />
				</div>
			));
	};

	return (
		<div className="">
			<Hero />
			<div className="p-3 w-full mt-6">
				<h2 className="text-center md:text-6xl text-4xl text-gray-800 dark:text-gray-200">
					Books
				</h2>
				<div className="container mx-auto mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
					{isLoading
						? renderSkeletonCards()
						: books.map((book, index) => (
								<div key={index} className="w-full sm:w-[300px]">
									<Card image={book.cover_image_url} link={`/books/${book.title_en}`} />
								</div>
						  ))}
				</div>
			</div>
			<PoemLinks />
		</div>
	);
};

export default HomePageClient;
