import React from "react";
import { urduFonts, englishFonts } from "../shareVerseConstants";

const FontCustomization = ({ style, setStyle }) => {
	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Urdu Font Selection */}
			<div className="flex gap-2 justify-between">
				<div className="flex flex-wrap items-center justify-start gap-1 sm:gap-2">
				
					{englishFonts.map((font) => (
						<button
							key={font.id}
							onClick={() => setStyle({ ...style, englishFont: font })}
							className={`px-2 sm:px-3 py-1 border rounded-md ${
								style.englishFont.id === font.id
									? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
									: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
							}`}
						>
							<div className="flex flex-col items-center">
								<span className={`text-base sm:text-lg mt-1 ${font.font}`}>Aa</span>
							</div>
						</button>
					))}
				</div>
				
				<div className="flex gap-1 sm:gap-2 justify-start">
				
					{urduFonts.map((font) => (
						<button
							key={font.id}
							onClick={() => setStyle({ ...style, urduFont: font })}
							className={`px-2 sm:px-3 py-1 border rounded-md ${
								style.urduFont.id === font.id
									? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
									: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
							}`}
						>
							<span
								className={`mt-1 leading-[6px] ${font.font} ${font.id === "nastaliq" ? "text-xs sm:text-sm mb-1 sm:mb-2" : "text-xs sm:text-sm"}`}
							>
								اردو
							</span>
						</button>
					))}
				</div>
				
			</div>

			{/* English Font Selection */}
			<div>
				
				{/* Urdu Font Size Slider */}
				<div className="mt-3">
					<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Urdu Font Size
					</label>
					<div className="flex items-center gap-2">
						<input
							type="range"
							min="0.8"
							max="2.5"
							step="0.1"
							value={style.urduFontSize}
							onChange={(e) =>
								setStyle({
									...style,
									urduFontSize: parseFloat(e.target.value),
								})
							}
							className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
						/>
						<span className="text-xs text-gray-500 min-w-[2.5rem] text-right">
							{style.urduFontSize ? style.urduFontSize.toFixed(1) : "1.5"}x
						</span>
					</div>
				</div>
				{/* English Font Size Slider */}
				<div className="mt-3">
					<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						English Font Size
					</label>
					<div className="flex items-center gap-2">
						<input
							type="range"
							min="0.7"
							max="1.8"
							step="0.1"
							value={style.englishFontSize}
							onChange={(e) =>
								setStyle({
									...style,
									englishFontSize: parseFloat(e.target.value),
								})
							}
							className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
						/>
						<span className="text-xs text-gray-500 min-w-[2.5rem] text-right">
							{style.englishFontSize ? style.englishFontSize.toFixed(1) : "1.0"}x
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FontCustomization; 