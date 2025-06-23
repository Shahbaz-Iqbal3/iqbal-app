import React from "react";
import { getFontSizeClass } from "../shareVerseConstants";

const VersePreview = ({ 
	previewRef, 
	style, 
	selectedLanguages, 
	urduVerse, 
	englishVerse, 
	author, 
	poemNameUr, 
	bookName 
}) => {
	const aspectClass = style.aspectRatio === '1/1'
		? 'aspect-[1/1]'
		: style.aspectRatio === '3/4'
			? 'aspect-[3/4]'
			: 'aspect-[9/16]';

	return (
		<div
			ref={previewRef}
			className={`shadow-lg overflow-hidden relative w-full max-w-[400px] mx-auto ${aspectClass} transform transition-transform duration-300`}
			style={{
				backgroundColor: style.backgroundColor,
				backgroundImage: style.backgroundImage
					? `url(${style.backgroundImage})`
					: "none",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{/* Overlay for better readability */}
			{style.backgroundImage && (
				<div
					className="absolute inset-0 transition-opacity duration-300"
					style={{
						backgroundColor: style.backgroundColor,
						opacity: style.overlayOpacity,
					}}
				/>
			)}

			<div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
				<div
					className="w-full text-center whitespace-pre-wrap flex-grow flex flex-col justify-center"
					style={{
						color: style.textColor,
					}}
				>
					{selectedLanguages.urdu && urduVerse && (
						<div
							className={`mb-4 sm:mb-6 text-center leading-relaxed ${style.urduFont.font} ${getFontSizeClass("text-2xl", style.urduFontSize)}`}
						>
							{urduVerse}
						</div>
					)}

					{selectedLanguages.english && englishVerse && (
						<div
							className={`italic leading-relaxed  text-center ${style.englishFont.font} ${getFontSizeClass("text-base", style.englishFontSize)}`}
						>
							{englishVerse}
						</div>
					)}

					{author && (
						<div className="mt-6">
							<div className="flex flex-col items-center justify-center">
								<div
									className={`block ${style.urduFont.font} text-sm`}
								>
									{poemNameUr}
								</div>
							</div>
							<div
								className={`block mt-1 italic ${style.englishFont.font} text-xs`}
							>
								{bookName}
							</div>
						</div>
					)}
				</div>

				<div
					className="text-xs sm:text-base tracking-wider font-mono mt-auto pt-2 sm:pt-4 flex items-center justify-center gap-2"
					style={{ color: style.textColor }}
				>
					<img
						src="/favicon_io1/apple-touch-icon.png"
						alt="icon"
						style={{ width: 32, height: 32, objectFit: "contain" }}
					/>
					<p>drallamaiqbal.com</p>
				</div>
			</div>
		</div>
	);
};

export default VersePreview; 