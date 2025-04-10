import React from "react";
import { stylePresets } from "../shareVerseConstants";

const StylePresets = ({ activePreset, applyPreset }) => {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-base font-semibold">
					<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Style Presets
					</span>
				</h3>

				{/* AI Suggested Style Button */}
				<button
					onClick={() => applyPreset("ai")}
					className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
						activePreset === "ai"
							? "bg-blue-500 text-white shadow-md"
							: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
					}`}
				>
					<div className="flex items-center space-x-1.5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-5 h-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
							/>
						</svg>

						<span>AI Style</span>
					</div>
				</button>
			</div>

			{/* Preset Categories */}
			<div className="space-y-5">
				{/* With Images Section */}
				<div>
					<div className="flex items-center mb-3">
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
						<span className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
							Background Images
						</span>
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
					</div>
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
						{stylePresets
							.filter((preset) => preset.id !== "ai" && preset.style.backgroundImage !== "")
							.map((preset) => (
								<button
									key={preset.id}
									onClick={() => applyPreset(preset.id)}
									className={`aspect-square rounded-xl transition-all duration-200 relative group hover:shadow-md`}
								>
									<div 
										className="absolute inset-0 bg-cover bg-center rounded-xl"
										style={{ 
											backgroundImage: `url(${preset.style.backgroundImage})`,
											opacity: 1 - (preset.style.overlayOpacity || 0),
										}}
									></div>
									<div 
										className="absolute inset-0 rounded-xl"
										style={{ 
											backgroundColor: preset.style.backgroundColor,
											opacity: preset.style.overlayOpacity || 0,
										}}
									></div>
									<div className="absolute inset-0 flex items-center justify-center">
										<span 
											className={`text-sm font-bold ${preset.style.englishFont.font}`}
											style={{ 
												color: preset.style.textColor,
											}}
										>
											Aa
										</span>
									</div>
									{activePreset === preset.id && (
										<div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-xl">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
									)}
									<div className="absolute inset-0 rounded-xl bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
								</button>
							))}
					</div>
				</div>

				{/* Without Images Section */}
				<div>
					<div className="flex items-center mb-3">
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
						<span className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
							Solid Colors
						</span>
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
					</div>
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
						{stylePresets
							.filter((preset) => preset.id !== "ai" && preset.style.backgroundImage === "")
							.map((preset) => (
								<button
									key={preset.id}
									onClick={() => applyPreset(preset.id)}
									className={`aspect-square rounded-xl transition-all duration-200 relative group hover:shadow-md`}
									style={{ 
										backgroundColor: preset.style.backgroundColor,
									}}
								>
									<div className="w-full h-full flex gap-1 items-center justify-center">
										<span 
											className={`text-sm font-bold  ${preset.style.englishFont.font}`}
											style={{ 
												color: preset.style.textColor,
											}}
										>
											Aa
										</span>
										
									</div>
									{activePreset === preset.id && (
										<div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-xl">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
									)}
									<div className="absolute inset-0 rounded-xl bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
								</button>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default StylePresets;
