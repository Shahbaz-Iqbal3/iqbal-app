"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PoemDisplay from "@/components/ui/PoemDisplay";
import { AudioPlayer } from "@/components";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";
import { useSession } from "next-auth/react";
import PlayButton from "@/components/ui/PlayButton";
import CopyButton from "@/components/ui/CopyPoemButton";
import ShareButton from "@/components/ui/ShareButton";
import CommentsPopup from "@/components/ui/CommentButton";
import "./style.css";

const PoemPage = () => {
	const { data: session, status } = useSession();

	const params = useParams();
	const { id, slug } = params;
	const [loading, setLoading] = useState(true);
	const [poem, setPoem] = useState(null);
	const [error, setError] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [initialPoemBookmarked, setInitialPoemBookmarked] = useState(false);

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
	}, [slug]);
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

	if (loading) {
		return <div className="text-center text-gray-400 dark:text-gray-300 h-screen flex items-center justify-center">Loading...</div>;
	}

	if (error) {
		return <div className="text-center text-red-500 dark:text-red-400 h-screen flex items-center justify-center">Error: {error}</div>;
	}

	if (!poem) {
		return <div className="text-center text-gray-400 dark:text-gray-300 h-screen flex items-center justify-center">Poem not found</div>;
	}

	return (
		<div className="container mx-auto p-2 sm:p-6 bg-primary dark:bg-primary-dark text-gray-800 dark:text-white rounded-lg shadow-sm dark:shadow-gray-800">
			<h1 className="font-urdu sm:text-5xl text-3xl font-bold text-gray-900 dark:text-white text-center sm:mb-6 mb-3 p-2 mt-4">
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
		</div>
	);
};

export default PoemPage;
