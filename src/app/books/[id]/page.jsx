"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

const PoemPage = () => {
	const params = useParams();
	const { id } = params;
	const [bookContents, setBookContents] = useState([]);
	const [book, setBook] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

const filteredPoems = bookContents.filter(poem => {
  const searchLower = searchQuery.toLowerCase();
  return (
    poem.title_ur?.toLowerCase().includes(searchLower) ||
    poem.title_en?.toLowerCase().includes(searchLower)
  );
}); 

	useEffect(() => {
		const fetchBookContents = async () => {
			try {
				const response = await fetch(`/api/books/listofpoem?book_id=${id}`);
				const data = await response.json();
				setBookContents(data.data);
				setBook(data.book);
				setLoading(false); // Set loading to false after data is fetched
				
			} catch (error) {
				console.error("Error fetching book contents", error);
			}
		};

		fetchBookContents();
	}, [id]);

	return (
		<div className="w-full md:bg-gray-600 min-h-svh">
			<div className="mx-auto container md:bg-gray-700 text-white m-6 p-6 rounded-lg md:shadow-lg flex  items-end">
				{loading ? (
					<div>Loading...</div>
				) : (
					<div className="flex flex-col md:flex-row">
						<div className="flex flex-col justify-center overflow-hidden rounded-xl h-[400px] w-[300px]">
							<Image
								src={book.cover_image_url}
								alt={book.title_en}
								width={600}
								height={900}
								priority={true}
							/>
						</div>
						<div className="w-full md:w-1/2 flex flex-col justify-center p-6 mb-8">
							<h2 className="text-2xl font-bold">
								{book.title_en} <span className=" font-urdu">({book.title_ur})</span>
							</h2>
							<p className="text-gray-300 mt-2">
								<span className="font-semibold">Language:</span> {book.book_lang}
							</p>
							<div className="mt-4">
								<p className="font-semibold">Description:</p>
								<p className="italic text-gray-300">{book.description}</p>
							</div>
							<div className="mt-4">
								<p className="">Number of poems: {bookContents.length}</p>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="mx-auto container bg-gray-700 text-white m-6 p-6 rounded-lg shadow-lg flex  items-end">
				{loading ? (
					<div>Loading...</div>
				) :(<div className="w-full">
				<div className="flex justify-between items-center mb-4">
				  <h2 className="text-2xl font-bold">Poems</h2>
				  <div className="w-64">
					<input
					  type="text"
					  placeholder="Search poems..."
					  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					  value={searchQuery}
					  onChange={(e) => setSearchQuery(e.target.value)}
					/>
				  </div>
				</div>
			
				<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" dir="rtl">
				  {filteredPoems.map((poem) => (
					<div key={poem.id} className="bg-gray-800 rounded-lg flex">
					  <div className="bg-gray-900 rounded-s-lg min-w-14 text-center flex 
						justify-center items-center font-semibold bg-opacity-40 ml-1">
						{poem.content_order}
					  </div>
					  <Link
						href={`/books/${book.title_en}/${poem.title_en?.replace(/ /g, "-").toLowerCase()}`}
						className="w-full hover:underline"
					  >
						<div className="flex p-2">
						  <div className="w-full ">
							<h3 className="text-xl font-urdu leading-[50px] line-clamp-1" dir="rtl">
							  {poem.title_ur}
							</h3>
							<p className="text-gray-400 mt-2 text-md line-clamp-1">{poem.title_en}</p>
						  </div>
						</div>
					  </Link>
					</div>
				  ))}
				  
				  {filteredPoems.length === 0 && (
					<div className="col-span-full text-center py-8 text-gray-400">
					  No poems found matching your search
					</div>
				  )}
				</div>
			  </div>
			)}
			</div>
		</div>
	);
};

export default PoemPage;
