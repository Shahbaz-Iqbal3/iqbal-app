"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Spinner } from "@/components/ui/Spinner";
import { useNotification } from "@/app/contexts/NotificationContext";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export default function ProfileBuilderPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const usernameParam = searchParams.get("username");
	const { addNotification } = useNotification();
	const usernameInputRef = useRef(null);

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [userData, setUserData] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		bio: "",
		username: "",
	});
	const [formErrors, setFormErrors] = useState({
		username: "",
	});
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [wasFocused, setWasFocused] = useState(false);

	// Load user data and set up form
	useEffect(() => {
		const initializeForm = async () => {
			if (status === "unauthenticated") {
				router.push("/auth/login");
				return;
			}

			if (!session?.user) {
				return;
			}

			// Check if we're editing an existing profile
			if (usernameParam) {
				setLoading(true);
				setEditMode(true);

				try {
					// Fetch user data for editing using username
					const response = await fetch(`/api/profile?basic=true&username=${usernameParam}`);

					if (!response.ok) {
						throw new Error("Failed to fetch user data");
					}

					const data = await response.json();

					// Check if the logged-in user is authorized to edit this profile
					if (data.id !== session.user.id) {
						addNotification("You are not authorized to edit this profile", "error");
						router.push(`/user/${data.username}`);
						return;
					}

					// Set user data and form values
					setUserData(data);
					setFormData({
						name: data.name || "",
						bio: data.bio || "",
						username: data.username || "",
					});
					setImagePreview(data.image || "");
				} catch (error) {
					console.error("Error fetching user data:", error);
					setError(error.message || "Failed to load user data");
				}
			} else {
				// New profile setup - initialize with data from session
				setFormData({
					name: session.user.name || "",
					bio: "",
					username: session.user.username || session.user.email.split("@")[0] || "",
				});
				setImagePreview(session.user.image || "");
			}

			setLoading(false);
		};

		initializeForm();
	}, [status, router, usernameParam, addNotification]);

	// Preserve focus after validation re-renders
	useEffect(() => {
		if (wasFocused && usernameInputRef.current) {
			usernameInputRef.current.focus();
		}
	}, [isCheckingUsername, formErrors, wasFocused]);

	// Validate username when it changes
	useEffect(() => {
		// Skip validation if username hasn't changed from original
		if (userData?.username === formData.username) {
			setFormErrors((prev) => ({ ...prev, username: "" }));
			return;
		}

		const validateUsername = async () => {
			// Reset username error first
			setFormErrors((prev) => ({ ...prev, username: "" }));

			// Skip validation if username is empty
			if (!formData.username.trim()) return;

			// Check for spaces
			if (/\s/.test(formData.username)) {
				setFormErrors((prev) => ({ ...prev, username: "Username cannot contain spaces" }));
				return;
			}

			// Debounce check for uniqueness to avoid too many requests
			setIsCheckingUsername(true);
			try {
				const response = await fetch(
					`/api/profile/check-username?username=${encodeURIComponent(formData.username)}`
				);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to check username");
				}

				if (!data.available) {
					if (data.existingUsernames && data.existingUsernames.length > 0) {
						// Show which username is taken (may have different capitalization)
						setFormErrors((prev) => ({
							...prev,
							username: `This username is already taken`,
						}));
					} else {
						setFormErrors((prev) => ({
							...prev,
							username: "This username is already taken (usernames are case-insensitive)",
						}));
					}
				}
			} catch (error) {
				console.error("Error checking username:", error);
			} finally {
				setIsCheckingUsername(false);
			}
		};

		// Use a timeout to debounce the validation
		const timeoutId = setTimeout(() => {
			validateUsername();
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [formData.username, userData?.username]);

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle focus and blur events
	const handleFocus = () => {
		setWasFocused(true);
	};

	const handleBlur = () => {
		setWasFocused(false);
	};

	// Handle image upload
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	// Validate the form before submission
	const validateForm = () => {
		let isValid = true;
		const errors = {
			username: "",
		};

		// Username validations
		if (!formData.username.trim()) {
			errors.username = "Username is required";
			isValid = false;
		} else if (/\s/.test(formData.username)) {
			errors.username = "Username cannot contain spaces";
			isValid = false;
		}

		setFormErrors(errors);
		return isValid;
	};

	// Handle cancel
	const handleCancel = () => {
		if (editMode && userData) {
			router.push(`/user/${userData.username}`);
		} else {
			router.push("/");
		}
	};

	// Submit profile data
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate form before submitting
		if (!validateForm()) {
			return;
		}

		setSaving(true);
		setError(null);

		try {
			// Skip username uniqueness check if username is unchanged
			if (!userData || userData?.username !== formData.username) {
				// Check username uniqueness one last time before submitting
				const checkResponse = await fetch(
					`/api/profile/check-username?username=${encodeURIComponent(formData.username)}`
				);
				const checkData = await checkResponse.json();

				if (!checkResponse.ok) {
					throw new Error(checkData.error || "Failed to check username");
				}

				if (!checkData.available) {
					if (checkData.existingUsernames && checkData.existingUsernames.length > 0) {
						// Show which username is taken (may have different capitalization)
						setFormErrors((prev) => ({
							...prev,
							username: `This username is already taken (matches ${checkData.existingUsernames[0]})`,
						}));
					} else {
						setFormErrors((prev) => ({
							...prev,
							username: "This username is already taken (usernames are case-insensitive)",
						}));
					}
					setSaving(false);
					return;
				}
			}

			if (!session?.user?.id) {
				throw new Error("User ID not found. Please log in again.");
			}

			const profileData = new FormData();
			profileData.append("userId", userData?.id || session.user.id);
			profileData.append("name", formData.name);
			profileData.append("bio", formData.bio);
			profileData.append("username", formData.username);

			if (imageFile) {
				profileData.append("imageFile", imageFile);
			}

			const response = await fetch("/api/profile", {
				method: "POST",
				body: profileData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to update profile");
			}

			const updatedUser = await response.json();

			// Show success notification
			addNotification(
				editMode ? "Profile updated successfully" : "Profile created successfully",
				"success"
			);

			// Redirect to profile view if editing, otherwise go to home
			if (editMode) {
				router.push(`/user/${updatedUser.username}`);
			} else {
				router.push("/");
			}
		} catch (error) {
			console.error("Error saving profile:", error);
			setError(error.message || "Failed to save profile. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
				<Spinner size="lg" className="dark:border-gray-300 dark:border-t-gray-800" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-primary dark:bg-gray-900 py-12">
			<div className="max-w-3xl mx-auto md:bg-white dark:bg-gray-800 rounded-xl md:shadow-lg overflow-hidden">
				<div className="p-8">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl font-bold text-gray-800 dark:text-white">
							{editMode ? "Edit Profile" : "Complete Your Profile"}
						</h1>
						{editMode && (
							<Link
								href={`/user/${userData?.username}`}
								className="text-blue-600 dark:text-blue-400 hover:underline"
							>
								Back to Profile
							</Link>
						)}
					</div>

					{!editMode && (
						<p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
							Let's set up your profile so others can get to know you better.
						</p>
					)}

					{error && (
						<div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Profile Image */}
						<div className="flex flex-col items-center mb-8">
							<div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 mb-4">
								{imagePreview ? (
									<Image
										src={imagePreview}
										alt="Profile Preview"
										fill
										className="object-cover"
										priority
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 text-blue-400 dark:text-blue-300" style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
										<svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
											<path
												fillRule="evenodd"
												d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								)}
							</div>

							<label className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
								{editMode ? "Change Photo" : "Upload Photo"}
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
									disabled={saving}
								/>
							</label>
						</div>

						{/* Form Fields */}
						<div className="space-y-6">
							<div>
								<label className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">
									Display Name
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="w-full px-4 py-2 border dark:border-gray-600 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-100 text-gray-900 dark:bg-gray-700 dark:text-white"
									placeholder="Your display name"
									required
									disabled={saving}
								/>
							</div>

							<div>
								<label className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">
									Username
								</label>
								<div className="relative">
									<input
										ref={usernameInputRef}
										type="text"
										name="username"
										autoComplete="off"
									  spellCheck="false"
										value={formData.username}
										onChange={handleChange}
										onFocus={handleFocus}
										onBlur={handleBlur}
										className={`w-full px-4 py-2 border text-gray-900 ${
											formData.username ? formErrors.username
												? "border-red-500 dark:border-red-500 focus:ring-red-300"
 												: "border-green-600 focus:ring-green-300" : ''
										} rounded-lg focus:outline-none focus:ring-1  dark:bg-gray-700 dark:text-white`}
										placeholder="Choose a username"
										required
										disabled={saving}
									/>
									{formData.username && isCheckingUsername   ? (
										<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
											<Spinner
												size="sm"
												className="dark:border-gray-300 dark:border-t-blue-500"
											/>
										</div>
									) : formData.username ? !formErrors.username ? (
										<CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600" />
									) : (
										<XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600" />
									) : null}
								</div>
								{formErrors.username ? (
									<p className="text-sm text-red-500 dark:text-red-400 mt-1">
										{formErrors.username}
									</p>
								) : (
									<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
										This will be used for your profile URL. No spaces allowed. Usernames are
										case-insensitive.
									</p>
								)}
							</div>

							{editMode && (
								<div>
									<label className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">
										Email
									</label>
									<input
										type="email"
										value={userData?.email || ""}
										disabled
										className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-400 text-gray-500"
									/>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										Email cannot be changed
									</p>
								</div>
							)}

							<div>
								<label className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">
									Bio
								</label>
								<textarea
									name="bio"
									value={formData.bio}
									onChange={handleChange}
									rows="4"
									className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-100 dark:bg-gray-700 dark:text-white text-gray-900"
									placeholder="Tell us about yourself"
									disabled={saving}
								></textarea>
							</div>
						</div>

						{/* Form Actions */}
						<div className="flex justify-end gap-4 mt-8">
							<button
								type="button"
								onClick={handleCancel}
								disabled={saving}
								className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={
									saving ||
									isCheckingUsername ||
									Object.values(formErrors).some((error) => error)
								}
								className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
							>
								{saving ? (
									<>
										<Spinner size="sm" className="mr-2 border-white border-t-transparent" />
										{editMode ? "Saving..." : "Setting Up Profile..."}
									</>
								) : editMode ? (
									"Save Changes"
								) : (
									"Complete Profile"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
