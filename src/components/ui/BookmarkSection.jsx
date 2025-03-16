// Bookmarks section with dark mode and tabs
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";

const BookmarksSection = ({
	bookmarks,
	bookmarkPrivacy,
	togglePrivacy,
	removeBookmark,
	isLoading,
	isOwnProfile,
	username,
	setSelectedBookmarkId,
	setShowPrivacyConfirm,
	setShowDeleteConfirm,
}) => {
	
	const poemBookmarks = bookmarks.filter((b) => b.type === "poem");
	const stanzaBookmarks = bookmarks.filter((b) => b.type === "stanza");
	// Set default tab to "stanzas" if there are no poems but there are stanzas
	const initialTab = poemBookmarks.length === 0 && stanzaBookmarks.length > 0 ? "stanzas" : "poems";
	
	const [activeTab, setActiveTab] = useState(initialTab);
	

	// Filter bookmarks based on active tab
	const filteredBookmarks = bookmarks.filter((bookmark) => {
		if (activeTab === "poems") return bookmark.type === "poem";
		if (activeTab === "stanzas") return bookmark.type === "stanza";
		return false;
	});

	// Sort bookmarks by created_at (newest first)
	const sortedBookmarks = [...filteredBookmarks].sort(
		(a, b) => new Date(b.created_at) - new Date(a.created_at)
	);

	// Get current bookmarks
	const currentBookmarks = sortedBookmarks;

	

	return (
		<div className="mt-8 bg-primary dark:bg-gray-800 sm:p-6 p-4 text-primary-dark dark:text-primary">
			<h3 className="text-xl font-semibold mb-4 dark:text-white">
				{isOwnProfile ? "Your Collection" : `${username.trim().split(" ")[0]}'s Collection`}
			</h3>

			{/* Tabs */}
			<div className="flex border-b items-center justify-between border-gray-200 dark:border-gray-700 mb-4">
				<div className="flex items-center gap-1">
					<button
						onClick={() => setActiveTab("poems")}
						className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${
							activeTab === "poems"
								? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
								: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
							/>
						</svg>
						Poems{" "}
						<span className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
							{poemBookmarks.length}
						</span>
					</button>
					<button
						onClick={() => setActiveTab("stanzas")}
						className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${
							activeTab === "stanzas"
								? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
								: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
							/>
						</svg>
						Stanzas{" "}
						<span className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
							{stanzaBookmarks.length}
						</span>
					</button>
				</div>
				{isLoading && (
					<div className="flex justify-center">
						<Spinner size="sm" className="dark:border-gray-300 dark:border-t-gray-800" />
					</div>
				)}
			</div>

			{/* Bookmarks list */}

			{currentBookmarks.length === 0 ? (
				<div className="text-center py-8 text-gray-500 dark:text-gray-400">
					{isOwnProfile
						? `You have no ${activeTab} bookmarks yet. Browse ${activeTab} to add some!`
						: `${username} has no public ${activeTab} bookmarks.`}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{currentBookmarks.map((bookmark) => (
						<motion.div
							key={bookmark.id}
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.3 }}
							className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex justify-between mb-3">
								<div>
									<span
										className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${
											bookmark.type === "poem"
												? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
												: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
										}`}
									>
										{bookmark.type === "poem" ? "Poem" : "Stanza"}
									</span>
								</div>

								{isOwnProfile && (
									<div className="flex items-center gap-2">
										<button
											onClick={() => {
												setSelectedBookmarkId(bookmark.id);
												setShowPrivacyConfirm(true);
											}}
											className={`text-xs font-medium px-2 py-1 rounded ${
												bookmarkPrivacy[bookmark.id]
													? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
													: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
											} transition-colors`}
											disabled={isLoading}
										>
											{bookmarkPrivacy[bookmark.id] ? "Public" : "Private"}
										</button>
										<button
											onClick={() => {
												setSelectedBookmarkId(bookmark.id);
												setShowDeleteConfirm(true);
											}}
											className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
											disabled={isLoading}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="3 6 5 6 21 6"></polyline>
												<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
												<line x1="10" y1="11" x2="10" y2="17"></line>
												<line x1="14" y1="11" x2="14" y2="17"></line>
											</svg>
										</button>
									</div>
								)}
							</div>

							<div className="flex justify-between flex-row-reverse gap-2 mb-2">
								<h4 className="text-lg font-medium text-right mb-1 font-urdu text-gray-600 dark:text-white flex gap-2 items-center justify-start flex-row-reverse">
									<span>{bookmark.poem_title || "Unknown Poem"}</span>
									<span className="text-sm text-gray-600 dark:text-gray-400 text-right mb-3 font-urdu">
										({bookmark.book_title || "Unknown Book"})
									</span>
								</h4>
								<div className="flex items-center gap-2">
									<Link
										href={`/books/${bookmark.book_title_en || "unknown"}/${
											bookmark.poem_title_en?.replace(/\s+/g, "-").toLowerCase() || "unknown"
										}${bookmark.stanza_order ? `#stanza-${bookmark.stanza_order}` : ""}`}
										className="text-blue-500 flex gap-1 text-sm dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
									>
										<span>view {bookmark.type === "poem" ? "poem" : "stanza"}</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-4"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
											/>
										</svg>
									</Link>
								</div>
							</div>

							{bookmark.type === "stanza" && bookmark.stanza_content && (
								<div className="bg-gray-50 text-gray-600 dark:bg-gray-600 rounded p-2 mt-2">
									<p className="text-center font-urdu mt-2 p-2 sm:text-lg text-sm  dark:text-white">
										{bookmark.stanza_content?.split("|")[0] || "Content not available"}
									</p>
									{bookmark.stanza_content?.split("|")[1] && (
										<p className="text-center font-urdu mt-2 p-2 sm:text-lg text-sm dark:text-white">
											{bookmark.stanza_content?.split("|")[1]}
										</p>
									)}
								</div>
							)}

							{(!bookmark.poem_title ||
								!bookmark.book_title ||
								(bookmark.type === "stanza" && !bookmark.stanza_content)) && (
								<div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm text-yellow-700 dark:text-yellow-400">
									<p>Some content for this bookmark might be missing or unavailable.</p>
								</div>
							)}
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
}; 

export default BookmarksSection;