"use client";

import { useNotification } from "@/app/contexts/NotificationContext";
import { useState } from "react";
import Tooltip from "../layout/Tooltip";
import LoginSuggestion from "./LoginSuggestion";

export default function BookmarkButton({
	userId,
	poemId,
	stanzaId = null,
	initialBookmarked = false,
}) {
	const [bookmarked, setBookmarked] = useState(initialBookmarked);
	const [loading, setLoading] = useState(false);
	const { addNotification } = useNotification();
	const [showLoginSuggestion, setShowLoginSuggestion] = useState(false);
	

	const handleToggle = async () => {
		if (!userId) {
			setShowLoginSuggestion(true);
			return;
		}

		try {
			setLoading(true);
			const response = await fetch("/api/toggleBookmark", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, poemId, stanzaId }),
			});

			if (!response.ok) throw new Error("Failed to toggle bookmark");

			setBookmarked((prev) => !prev);
			addNotification(`Bookmark ${bookmarked ? "removed" : "added"} successfully`, "success");
		} catch (error) {
			console.error("Error toggling bookmark:", error);
			addNotification(`Failed to ${bookmarked ? "remove" : "add"} bookmark`, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Tooltip content={!bookmarked ? "Bookmark" : "Bookmarked"}>
				<button
					onClick={handleToggle}
					aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
					disabled={loading}
					className={`p-1.5 rounded-lg transition-colors disabled:cursor-progress ${
						loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
					}`}
					aria-live="polite"
				>
					{bookmarked ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="sm:size-6 size-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="sm:size-6 size-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
							/>
						</svg>
					)}
					{showLoginSuggestion && (
						<LoginSuggestion
							onClose={() => setShowLoginSuggestion(false)}
							message="Sign in to save bookmarks"
						/>
					)}
				</button>
			</Tooltip>
		</>
	);
}
