"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PoemDisplay from "@/components/ui/PoemDisplay";
import { AudioPlayer } from "@/components";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";
import { useSession } from "next-auth/react";
import PlayButton from "@/components/ui/PlayButton";
import CopyButton from "@/components/ui/CopyPoemButton";
import ShareButton from "@/components/ui/ShareButton";
import CommentsPopup from "@/components/ui/CommentButton";
import Sidebar from "@/components/ui/Sidebar";
import "./style.css";

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
// Loading Skeleton Component
const PoemSkeleton = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-1 flex relative flex-row-reverse">
				{/* Sidebar Skeleton */}
				<div className="w-64 h-screen bg-gray-200 dark:bg-gray-700 animate-pulse">
					<div className="p-4">
						<div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
						<div className="space-y-2">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="h-6 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
							))}
						</div>
					</div>
				</div>

				{/* Main Content Skeleton */}
				<div className="flex-1 transition-all duration-300 overflow-hidden">
					<div className="w-full container p-2 sm:p-6 bg-primary dark:bg-primary-dark text-gray-800 dark:text-white rounded-lg shadow-sm dark:shadow-gray-800 animate-pulse">
						{/* Title Skeleton */}
						<div className="h-16 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto w-3/4 mb-3"></div>
						<div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto w-1/2 mb-6"></div>
						
						{/* Action Buttons Skeleton */}
						<div className="mt-3 flex items-center justify-center sm:gap-5 gap-3 w-full">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							))}
						</div>
						
						{/* Book Info Skeleton */}
						<div className="flex justify-between w-full mt-4">
							<div>
								<div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
								<div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
							<div>
								<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1 ml-auto"></div>
								<div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
							</div>
						</div>
						
						{/* Stanzas Skeleton */}
						<div className="sm:mt-8 space-y-6">
							{[1, 2, 3].map((i) => (
								<div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
									<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
									<div className="space-y-3">
										<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
										<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
										<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
									</div>
								</div>
							))}
						</div>
						
						{/* Audio Player Skeleton */}
						<div className="flex flex-col items-center justify-center mt-6 mb-4">
							<div className="w-full max-w-md h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
						</div>
						
						{/* Navigation Skeleton */}
						<div className="flex justify-center items-center mt-8 mb-4">
							<div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mx-2"></div>
							<div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mx-2"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const PoemPage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const params = useParams();
	const { id, slug } = params;
	const [loading, setLoading] = useState(true);
	const [poem, setPoem] = useState(null);
	const [error, setError] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [initialPoemBookmarked, setInitialPoemBookmarked] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [bookPoems, setBookPoems] = useState([]);

	const handlePlayStateChange = (newState) => {
		setIsPlaying(newState);
	};

	useEffect(() => {
		const fetchPoem = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(`/api/poems?poem_id=${slug}`);
				if (!response.ok) {
					throw new Error("Failed to fetch poem");
				}

				const data = await response.json();
				setPoem(data);
				if (data.bookmark && data.bookmark.length > 0) {
					setInitialPoemBookmarked(data.bookmark.some((b) => b.stanza_id === null));
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (slug) {
			fetchPoem();
		}
	}, [slug, id]);
	
	useEffect(() => {
		const handleHashScroll = () => {
			const hash = window.location.hash.substring(1);
			if (hash) {
				// Wait for poem data and DOM rendering
				setTimeout(() => {
					const element = document.getElementById(hash);
					if (element) {
						const yOffset = -100; // Adjust this value for margin (negative moves it down)
						const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

						window.scrollTo({
							top: y,
							behavior: "smooth",
						});

						// Highlight effect
						element.classList.add("highlight");
						setTimeout(() => {
							element.classList.remove("highlight");
						}, 3000);
					}
				}, 100); // Short delay for DOM stability
			}
		};

		if (poem) {
			// Initial load
			handleHashScroll();

			// Listen for hash changes
			window.addEventListener("hashchange", handleHashScroll);
		}

		return () => {
			window.removeEventListener("hashchange", handleHashScroll);
		};
	}, [poem]); // Trigger when poem data is loaded

	const handleNavigation = (direction) => {
		if (!poem || !poem.navigation) return;
		
		const targetPoem = direction === 'prev' ? poem.navigation.previous : poem.navigation.next;
		if (targetPoem && targetPoem.title_en) {
			const targetSlug = targetPoem.title_en.toLowerCase().replace(/ /g, "-");
			router.push(`/books/${id}/${targetSlug}`);
		}
	};

	// Add useEffect to fetch book poems
	useEffect(() => {
		const fetchBookPoems = async () => {
			try {
				const response = await fetch(`/api/books/listofpoem?book_id=${id}&title_only=true`);
				if (!response.ok) throw new Error('Failed to fetch book poems');
				const data = await response.json();
				setBookPoems(data.data);
			} catch (error) {
				console.error('Error fetching book poems:', error);
			}
		};

		if (id) {
			fetchBookPoems();
		}
	}, [id]);

	if (loading) {
		return <PoemSkeleton />;
	}

	if (error) {
		return <div className="text-center text-red-500 dark:text-red-400 h-screen flex items-center justify-center">Error: {error}</div>;
	}

	if (!poem) {
		return <div className="text-center text-gray-400 dark:text-gray-300 h-screen flex items-center justify-center">Poem not found</div>;
	}

	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-1 flex relative flex-row-reverse">
				{/* Sidebar */}
				<Sidebar
					isOpen={isSidebarOpen}
					onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
					bookId={id}
					poems={bookPoems}
					currentPoemId={poem?.title_en}
				/>

				{/* Main Content */}
				<main className={`flex-1 transition-all duration-300 overflow-hidden`}>
					<div className="w-full container p-2 sm:p-6 bg-primary dark:bg-primary-dark text-gray-800 dark:text-white rounded-lg shadow-sm dark:shadow-gray-800">
						<h1 className="font-nastaliq sm:text-5xl text-3xl font-bold text-gray-900 dark:text-white text-center sm:mb-6 mb-3 p-2 mt-4">
							{poem.title_ur}
						</h1>
						<h1 className="sm:text-lg text-sm font-bold text-gray-700 dark:text-gray-200 text-center">
							{poem.title_en}{" "}
						</h1>
						<div className="mt-3 flex items-center justify-center sm:gap-5 gap-3 w-full text-gray-500 dark:text-gray-400">
							<BookmarkButton
								userId={session?.user?.id}
								poemId={poem.id}
								initialBookmarked={initialPoemBookmarked}
							/>
							<PlayButton isPlaying={isPlaying} setIsPlaying={setIsPlaying} disabled={poem.audio_url==='' && !poem.audio_url} />
							<CopyButton content={poem} />
							<ShareButton book={id} poem={poem.title_en} />
							<CommentsPopup poemId={poem.id} />
						</div>

						<div className="flex justify-between w-full mt-4">
							<div>
								<p className="text-gray-500 dark:text-gray-400 text-xs sm:text-base">Narrated in</p>
								<Link className="sm:text-xl text-sm text-blue-900 dark:text-blue-400 hover:underline" href={`/books/${id}`}>
									{id}
								</Link>
							</div>
							<div>
								<p className="text-gray-500 dark:text-gray-400 text-right text-xs sm:text-base">Poem #</p>
								<p className="sm:text-xl text-sm text-center font-bold rounded-lg bg-gray-100 dark:bg-secondary-dark p-1 px-3 sm:px-6 text-gray-800 dark:text-gray-200">
									{poem.poem_order > 100 ? "" : poem.poem_order > 10 ? "0" : "00"}
									{poem.poem_order}
								</p>
							</div>
						</div>

						<div className="sm:mt-8">
							{poem.stanzas.map((stanza) => (
								<div key={stanza.stanza_order} id={`stanza-${stanza.stanza_order}`} className="transition-all duration-300">
									<PoemDisplay
										stanza={stanza}
										bookmarks={poem.bookmark}
										poemId={poem.id}
										poemName={poem.title_en}
										poemNameUr={poem.title_ur}
										userId={session?.user?.id}
										bookId={id}
									/>
								</div>
							))}
						</div>
						<div className="flex flex-col items-center justify-center mt-6 mb-4">
							{poem.audio_url && (
								<AudioPlayer
									audioSrc={poem.audio_url}
									isPlayed={!isPlaying}
									onPlayStateChange={handlePlayStateChange}
								/>
							)}
						</div>
						
						{/* Navigation Buttons */}
						<div className="flex justify-center items-center mt-8 mb-4 space-x-4">
							{poem.navigation?.previous ? (
								<Link
									href={`/books/${id}/${poem.navigation.previous.title_en.toLowerCase().replace(/ /g, "-")}`}
									className="group relative overflow-hidden flex justify-between px-5 py-3 rounded-lg transition-all duration-300 sm:min-w-[250px] sm:max-w-[250px] w-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 hover:shadow-md hover:shadow-blue-900/50"
								>
									{/* Interactive hover effect */}
									<div className="group-hover:opacity-100 opacity-0 transition-opacity absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
									
									<div className="flex items-center space-x-1.5 relative z-10">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="flex flex-col items-center justify-center">
										{poem.navigation.previous.title_ur && (
											<span className="text-sm mt-0.5 max-w-[160px] truncate font-nastaliq text-gray-700 dark:text-gray-200 relative z-10" dir="rtl">
												{poem.navigation.previous.title_ur}
											</span>
										)}
										<span className="text-sm mt-1 max-w-[160px] truncate text-gray-600 dark:text-gray-300 relative z-10">
											{poem.navigation.previous.title_en.toProperCase()}
										</span>
									</div>
								</Link>
							) : (
								<div className="flex justify-between px-5 py-3 rounded-lg sm:min-w-[250px] sm:max-w-[250px] w-1/2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed">
									<div className="flex items-center space-x-1.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
							)}
							
							{poem.navigation?.next ? (
								<Link
									href={`/books/${id}/${poem.navigation.next.title_en.toLowerCase().replace(/ /g, "-")}`}
									className="group relative overflow-hidden flex flex-row-reverse justify-between px-5 py-3 rounded-lg transition-all duration-300 sm:min-w-[250px] sm:max-w-[250px] w-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 hover:shadow-md hover:shadow-blue-900/50"
								>
									{/* Interactive hover effect */}
									<div className="group-hover:opacity-100 opacity-0 transition-opacity absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
									
									<div className="flex items-center space-x-1.5 relative z-10">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="flex flex-col items-center justify-center">
										{poem.navigation.next.title_ur && (
											<span className="text-sm mt-0.5 max-w-[160px] truncate font-nastaliq text-gray-700 dark:text-gray-200 relative z-10" dir="rtl">
												{poem.navigation.next.title_ur}
											</span>
										)}
										<span className="text-sm mt-1 max-w-[160px] truncate text-gray-600 dark:text-gray-300 relative z-10">
											{poem.navigation.next.title_en.toProperCase()}
										</span>
									</div>
								</Link>
							) : (
								<div className="flex flex-row-reverse justify-between px-5 py-3 rounded-lg sm:min-w-[250px] sm:max-w-[250px] w-1/2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed">
									<div className="flex items-center space-x-1.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default PoemPage;
