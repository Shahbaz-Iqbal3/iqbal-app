import React from "react";
import { isPresetImage } from "../shareVerseConstants";

const BackgroundImageCustomization = ({ style, setStyle, handleFileUpload }) => {
	return (
		<div>
			<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
				Background Image
			</label>
			{style.backgroundImage && !isPresetImage(style.backgroundImage) ? (
				<div className="space-y-2">
					<div className="relative w-full h-24 sm:h-32 rounded-md overflow-hidden">
						<img
							src={style.backgroundImage}
							alt="Background"
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="flex gap-1 sm:gap-2">
						<label
							htmlFor="file"
							className="flex-1 p-1.5 sm:p-2 text-center bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer transition-colors text-xs sm:text-sm"
						>
							Change Image
						</label>
						<button
							onClick={() =>
								setStyle({
									...style,
									backgroundImage: "/images/presets/darknature.avif",
								})
							}
							className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors text-xs sm:text-sm"
						>
							Remove
						</button>
					</div>
					<input
						id="file"
						type="file"
						accept="image/*"
						onChange={handleFileUpload}
						className="hidden"
					/>
				</div>
			) : (
				<label
					htmlFor="file"
					className="w-full p-2 sm:p-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center"
				>
					<span>Choose Image</span>
					<input
						id="file"
						type="file"
						accept="image/*"
						onChange={handleFileUpload}
						className="hidden"
					/>
				</label>
			)}
		</div>
	);
};

export default BackgroundImageCustomization; 