// components/EditProfile.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Spinner } from "./Spinner";

const EditProfile = ({
	userData,
	handleChange,
	handleImageChange,
	handleUpdateProfile,
	setIsEditing,
	editForm, // Add editForm prop
	imagePreview, // Ensure this is passed from parent
	isLoading = false, // Add loading state
}) => {
	// Local state for image preview
	const [localImagePreview, setLocalImagePreview] = useState(userData?.image || "");

	// Update local preview when parent imagePreview changes
	useEffect(() => {
		if (imagePreview) {
			setLocalImagePreview(imagePreview);
		}
	}, [imagePreview]);

	return (
		<form onSubmit={handleUpdateProfile} className="space-y-4">
			<div className="flex flex-col md:flex-row items-start gap-8">
				<div className="flex flex-col items-center">
					<div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
						{localImagePreview ? (
							<Image
								src={localImagePreview}
								alt="Profile Preview"
								fill
								className="object-cover"
								priority
								sizes="44"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 text-blue-400 dark:text-blue-300" style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
								<DefaultAvatarIcon />
							</div>
						)}
					</div>

					<ImageUploadButton
						handleImageChange={(e) => {
							const file = e.target.files[0];
							if (file) {
								handleImageChange(e); // Call parent handler
								setLocalImagePreview(URL.createObjectURL(file)); // Local preview
							}
						}}
						disabled={isLoading}
					/>
				</div>

				<div className="sm:flex-1 w-full space-y-4">
					<FormInput
						label="Name"
						name="name"
						value={editForm.name} // Use editForm instead of userData
						onChange={handleChange}
						disabled={isLoading}
					/>
					<EmailInput value={editForm.email} /> {/* Use editForm */}
					<FormTextarea
						label="Bio"
						name="bio"
						value={editForm.bio} // Use editForm
						onChange={handleChange}
						disabled={isLoading}
					/>
					<FormActions 
						onCancel={() => setIsEditing(false)} 
						submitText="Save Changes"
						isLoading={isLoading} 
					/>
				</div>
			</div>
		</form>
	);
};

// Sub-components
const DefaultAvatarIcon = () => (
	<svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
		<path
			fillRule="evenodd"
			d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
			clipRule="evenodd"
		/>
	</svg>
);

const ImageUploadButton = ({ handleImageChange, disabled }) => (
	<label className={`mt-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
		Change Photo
		<input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={disabled} />
	</label>
);

const FormInput = ({ label, name, value, onChange, disabled, ...props }) => (
	<div>
		<label className="block text-gray-700 dark:text-gray-300 mb-1">{label}</label>
		<input
			type="text"
			name={name}
			value={value}
			onChange={onChange}
			className="w-full px-4 py-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-secondary-dark dark:bg-gray-700 dark:text-white text-primary-dark"
			disabled={disabled}
			{...props}
		/>
	</div>
);

const EmailInput = ({ value }) => (
	<div>
		<label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
		<input
			type="email"
			value={value}
			disabled
			className="w-full px-4 py-2 border dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-400 text-gray-500"
		/>
		<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
	</div>
);

// components/EditProfile.jsx
const FormTextarea = ({ label, name, value, onChange, disabled }) => (
	<div>
		<label className="block text-gray-700 dark:text-gray-300 mb-1">{label}</label>
		<textarea
			name={name}
			value={value}
			onChange={onChange}
			rows="5"
			disabled={disabled}
			className="w-full px-4 py-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-secondary-dark text-primary-dark whitespace-pre-wrap dark:bg-gray-700 dark:text-white"
		/>
	</div>
);

const FormActions = ({ onCancel, submitText, isLoading }) => (
	<div className="flex gap-2 items-center">
		<button
			type="submit"
			className={`mt-2 px-4 py-2 text-sm  bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex gap-2 items-center justify-between${isLoading ? 'opacity-70' : ''}`}
			disabled={isLoading}
		>
			{isLoading ? (
				<>
					<Spinner size="sm" className="dark:border-gray-300 dark:border-t-gray-600" />
					Saving...
				</>
			) : (
				submitText
			)}
		</button>
		<button
			type="button"
			onClick={onCancel}
			className="mt-2 px-4 py-2  text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
			disabled={isLoading}
		>
			Cancel
		</button>
	</div>
);

export default EditProfile;
