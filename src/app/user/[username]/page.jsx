"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/Spinner";
import { useParams, useRouter } from "next/navigation";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useNotification } from "@/app/contexts/NotificationContext";
import BookmarksSection from "@/components/ui/BookmarkSection";
import ProfileView from "@/components/user/ProfileView";

export default function Page() {
	const { data: session, status } = useSession();
	const params = useParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState(null);
	const [bookmarks, setBookmarks] = useState([]);
	const [bookmarkPrivacy, setBookmarkPrivacy] = useState({});
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	// Add state for confirmation dialogs
	const [showPrivacyConfirm, setShowPrivacyConfirm] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [selectedBookmarkId, setSelectedBookmarkId] = useState(null);
	const { addNotification } = useNotification();
	
	// Get the username from params
	const username = params.username;
	
	// Check if viewing own profile - this will be updated once userData is loaded
	const [isOwnProfile, setIsOwnProfile] = useState(false);
	
	// Create a ref to track if data has been fetched
	const dataFetchedRef = useRef(false);

	// Fetch user data
	useEffect(() => {
		const fetchUserData = async () => {
			// Skip fetching if we already have data or if username is not available
			if (!username || dataFetchedRef.current) return;
			
			setIsLoading(true);
			setError(null);

			try {
				// Fetch all bookmarks at once since we'll handle lazy loading on the client
				const response = await fetch(`/api/profile?username=${username}`);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || "Failed to fetch user data");
				}

				const data = await response.json();

				// Set user data
				setUserData(data);
				
				// Check if this is the user's own profile
				if (session?.user?.id) {
					setIsOwnProfile(session.user.id === data.id);
				}

				// Store all bookmarks for client-side pagination
				const bookmarksData = data.bookmarks || [];
				setBookmarks(bookmarksData);

				// Initialize privacy settings for each bookmark
				const privacySettings = {};
				bookmarksData.forEach((bookmark) => {
					privacySettings[bookmark.id] = bookmark.is_public || false;
				});
				setBookmarkPrivacy(privacySettings);
				
				// Mark data as fetched
				dataFetchedRef.current = true;
			} catch (error) {
				console.error("Error fetching user data:", error);
				setError(error.message || "Failed to load profile data");
			} finally {
				setIsLoading(false);
			}
		};

		// Only fetch if username is available and session status is known
		if (username && status !== "loading") {
			fetchUserData();
		}
	}, [username, status]); // Removed session from dependencies

	// Handle redirect to edit profile page
	const handleEditProfile = () => {
		router.push(`/user/profile-builder?username=${userData.username}`);
	};

	// Remove bookmark
	const removeBookmark = async (bookmarkId) => {
		if (userData.id !== session?.user?.id) {
			addNotification("You are not authorized to remove this bookmark", "error");
			return;
		}
		setSaving(true);
		try {
			const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to remove bookmark");
			}

			// Update local state by removing the bookmark
			setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
			
			// Also remove from privacy settings
			setBookmarkPrivacy((prev) => {
				const newSettings = { ...prev };
				delete newSettings[bookmarkId];
				return newSettings;
			});
			
			addNotification("Bookmark removed successfully", "success");
		} catch (error) {
			console.error("Error removing bookmark:", error);
			setError(error.message || "Failed to remove bookmark");
		} finally {
			setSaving(false);
		}
	};

	// Toggle bookmark privacy
	const toggleBookmarkPrivacy = async (bookmarkId) => {
		setSaving(true);
		try {
			// Update local state immediately for UI feedback
			const newPrivacy = !bookmarkPrivacy[bookmarkId];
			setBookmarkPrivacy((prev) => ({
				...prev,
				[bookmarkId]: newPrivacy,
			}));

			// Also update the bookmark in the bookmarks array
			setBookmarks(prev => 
				prev.map(bookmark => 
					bookmark.id === bookmarkId 
						? { ...bookmark, is_public: newPrivacy } 
						: bookmark
				)
			);

			// Send update to server
			const response = await fetch("/api/bookmarks/privacy", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					bookmarkId,
					isPublic: newPrivacy,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to update bookmark privacy");
			}
			
			addNotification("Bookmark privacy updated successfully", "success");
		} catch (error) {
			console.error("Error updating bookmark privacy:", error);
			// Revert local state if server update fails
			const oldPrivacy = bookmarkPrivacy[bookmarkId];
			setBookmarkPrivacy((prev) => ({
				...prev,
				[bookmarkId]: oldPrivacy,
			}));
			setBookmarks(prev => 
				prev.map(bookmark => 
					bookmark.id === bookmarkId 
						? { ...bookmark, is_public: oldPrivacy } 
						: bookmark
				)
			);
			setError(error.message || "Failed to update bookmark privacy");
		} finally {
			setSaving(false);
		}
	};

	// Handle privacy confirmation
	const handlePrivacyConfirm = () => {
		if (selectedBookmarkId) {
			toggleBookmarkPrivacy(selectedBookmarkId);
		}
		setShowPrivacyConfirm(false);
		setSelectedBookmarkId(null);
	};

	// Handle delete confirmation
	const handleDeleteConfirm = () => {
		if (selectedBookmarkId) {
			removeBookmark(selectedBookmarkId);
		}
		setShowDeleteConfirm(false);
		setSelectedBookmarkId(null);
	};

	if (isLoading) {
		return (
			<div className="container mx-auto flex items-center justify-center h-screen dark:bg-primary-dark">
				<Spinner size="lg" className="dark:border-gray-300 dark:border-t-gray-800" />
			</div>
		);
	}

	if (error && !userData) {
		return (
			<div className="container mx-auto p-8 text-center dark:bg-gray-900 dark:text-white min-h-screen">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl mx-auto mt-10">
					<h2 className="text-2xl font-semibold mb-4 dark:text-white">
						Error Loading Profile
					</h2>
					<p className="mb-6 dark:text-gray-300">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto sm:px-4 sm:py-8 max-w-6xl dark:bg-primary-dark bg-primary">
			{/* Confirmation Dialogs */}
			<ConfirmationDialog
				isOpen={showPrivacyConfirm}
				onConfirm={handlePrivacyConfirm}
				onCancel={() => setShowPrivacyConfirm(false)}
				title="Change Privacy Setting"
				message="Are you sure you want to change the privacy setting for this bookmark?"
				confirmText="Yes, Change"
				cancelText="Cancel"
			/>

			<ConfirmationDialog
				isOpen={showDeleteConfirm}
				onConfirm={handleDeleteConfirm}
				onCancel={() => setShowDeleteConfirm(false)}
				title="Delete Bookmark"
				message="Are you sure you want to delete this bookmark? This action cannot be undone."
				confirmText="Yes, Delete"
				cancelText="Cancel"
			/>

			{error && (
				<div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
					<div className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="8" x2="12" y2="12"></line>
							<line x1="12" y1="16" x2="12.01" y2="16"></line>
						</svg>
						{error}
					</div>
				</div>
			)}

			<div className="bg-primary dark:bg-gray-800 rounded-xl overflow-hidden min-h-screen">
				<div className="sm:p-6 p-4">
					<ProfileView
						userData={userData}
						onEdit={handleEditProfile}
						isOwnProfile={isOwnProfile}
					/>
				</div>

				<div className="sm:px-6 pb-6" id="bookmarks">
					<div className="bg-primary dark:bg-gray-800 rounded-xl sm:p-6">
						<BookmarksSection
							bookmarks={bookmarks}
							bookmarkPrivacy={bookmarkPrivacy}
							togglePrivacy={toggleBookmarkPrivacy}
							removeBookmark={removeBookmark}
							isLoading={saving}
							isOwnProfile={isOwnProfile}
							username={userData?.name}
							setSelectedBookmarkId={setSelectedBookmarkId}
							setShowPrivacyConfirm={setShowPrivacyConfirm}
							setShowDeleteConfirm={setShowDeleteConfirm}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}






