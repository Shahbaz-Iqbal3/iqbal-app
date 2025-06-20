"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AIStyleSuggestions from "./AIStyleSuggestions";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import { 
	urduFonts, 
	englishFonts, 
	stylePresets 
} from "./shareVerseConstants";

import VersePreview from "./share-verse/VersePreview";
import ShareButtons from "./share-verse/ShareButtons";
import StylePresets from "./share-verse/StylePresets";
import AdvancedCustomization from "./share-verse/AdvancedCustomization";

// Main component
export default function ShareVerseModal({
	isOpen,
	onClose,
	verse,
	author,
	urduVerse,
	englishVerse,
	poemNameUr,
	bookName,
}) {
	const [activePreset, setActivePreset] = useState("ai");
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [style, setStyle] = useState({
		urduFont: urduFonts[0],
		englishFont: englishFonts[0],
		textColor: "#ffffff",
		backgroundColor: "#1a202c",
		backgroundImage: "/images/presets/darknature.avif",
		overlayOpacity: 0.7,
		urduFontSize: 2,
		englishFontSize: 1.3,
	});
	const [selectedLanguages, setSelectedLanguages] = useState({
		urdu: true,
		english: true,
	});
	const previewRef = useRef(null);

	// Simplified useEffect for AI style suggestions
	useEffect(() => {
		let root = null;
		let isMounted = true;

		if (isOpen && (englishVerse || verse)) {
			const container = document.createElement("div");
			root = createRoot(container);
			root.render(
				<AIStyleSuggestions
					text={englishVerse || verse}
					onApplyStyle={handleApplyAIStyle}
					autoApply={true}
				/>
			);
		}

		return () => {
			isMounted = false;
			// Use setTimeout to avoid synchronous unmounting during render
			setTimeout(() => {
				if (root && isMounted === false) {
					root.unmount();
				}
			}, 0);
		};
	}, [isOpen, englishVerse, verse]);

	// Simplified handleApplyAIStyle function
	const handleApplyAIStyle = (aiStyle) => {
		const matchUrduFont = urduFonts.find((f) => f.id === aiStyle.urduFontId) || urduFonts[0];
		const matchEnglishFont =
			englishFonts.find((f) => f.id === aiStyle.englishFontId) || englishFonts[0];

		const newStyle = {
			urduFont: matchUrduFont,
			englishFont: matchEnglishFont,
			textColor: aiStyle.textColor || style.textColor,
			backgroundColor: aiStyle.backgroundColor || style.backgroundColor,
			backgroundImage: aiStyle.backgroundImage || style.backgroundImage,
			overlayOpacity: aiStyle.overlayOpacity || style.overlayOpacity,
			urduFontSize: style.urduFontSize,
			englishFontSize: style.englishFontSize,
		};

		setStyle(newStyle);
		stylePresets[0].style = newStyle;
		setActivePreset("ai");
	};

	// Simplified applyPreset function
	const applyPreset = (presetId) => {
		const preset = stylePresets.find((p) => p.id === presetId);
		if (preset && preset.style) {
			// Preserve the current font sizes when applying a preset
			setStyle({
				...preset.style,
				urduFontSize: style.urduFontSize,
				englishFontSize: style.englishFontSize
			});
			setActivePreset(presetId);
		}
	};

	// Simplified toggleLanguage function
	const toggleLanguage = (lang) => {
		setSelectedLanguages((prev) => ({
			...prev,
			[lang]: !prev[lang],
		}));
	};

	// Simplified generateImage function
	const generateImage = async () => {
		if (!previewRef.current) return null;

		try {
			const canvas = await html2canvas(previewRef.current, {
				scale: 2,
				useCORS: true,
				backgroundColor: style.backgroundColor,
				allowTaint: true,
			});

			// Add watermark
			const ctx = canvas.getContext("2d");
			const watermarkText = "drallamaiabal.com";
			ctx.font = "14px Arial";
			ctx.fillStyle = style.textColor;
			ctx.textAlign = "center";
			ctx.fillText(watermarkText, canvas.width / 2, canvas.height - 10);

			return canvas;
		} catch (error) {
			console.error("Error generating image:", error);
			return null;
		}
	};

	// Simplified handleShare function
	const handleShare = async (platform) => {
		const canvas = await generateImage();
		if (!canvas) return;

		try {
			const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
			const imageUrl = URL.createObjectURL(imageBlob);

			// Create a FormData object to send both image and text
			const formData = new FormData();
			formData.append('image', imageBlob, 'verse-image.png');
			formData.append('text', verse || '');
			formData.append('url', window.location.href);

			// Different sharing approaches based on platform
			if (platform === 'twitter') {
				// Twitter doesn't support direct image upload in URL parameters
				// We'll use the Web Share API if available, otherwise fall back to text-only
				if (navigator.share) {
					try {
						await navigator.share({
							title: 'Shared Verse',
							text: verse || '',
							url: window.location.href,
							files: [new File([imageBlob], 'verse-image.png', { type: 'image/png' })]
						});
					} catch (err) {
						console.error('Error sharing:', err);
						// Fall back to text-only sharing
						window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(
							verse
						)}&url=${encodeURIComponent(window.location.href)}`, "_blank");
					}
				} else {
					// Fall back to text-only sharing
					window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(
						verse
					)}&url=${encodeURIComponent(window.location.href)}`, "_blank");
				}
			} else if (platform === 'facebook') {
				// Facebook doesn't support direct image upload in URL parameters
				// We'll use the Web Share API if available, otherwise fall back to text-only
				if (navigator.share) {
					try {
						await navigator.share({
							title: 'Shared Verse',
							text: verse || '',
							url: window.location.href,
							files: [new File([imageBlob], 'verse-image.png', { type: 'image/png' })]
						});
					} catch (err) {
						console.error('Error sharing:', err);
						// Fall back to text-only sharing
						window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
							window.location.href
						)}`, "_blank");
					}
				} else {
					// Fall back to text-only sharing
					window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
						window.location.href
					)}`, "_blank");
				}
			} else if (platform === 'whatsapp') {
				// WhatsApp doesn't support direct image upload in URL parameters
				// We'll use the Web Share API if available, otherwise fall back to text-only
				if (navigator.share) {
					try {
						await navigator.share({
							title: 'Shared Verse',
							text: verse || '',
							url: window.location.href,
							files: [new File([imageBlob], 'verse-image.png', { type: 'image/png' })]
						});
					} catch (err) {
						console.error('Error sharing:', err);
						// Fall back to text-only sharing
						window.open(`https://wa.me/?text=${encodeURIComponent(
							verse + "\n\n" + window.location.href
						)}`, "_blank");
					}
				} else {
					// Fall back to text-only sharing
					window.open(`https://wa.me/?text=${encodeURIComponent(
						verse + "\n\n" + window.location.href
					)}`, "_blank");
				}
			}
		} catch (error) {
			console.error("Error sharing:", error);
		}
	};

	// Simplified handleDownload function
	const handleDownload = async () => {
		const canvas = await generateImage();
		if (!canvas) return;

		try {
			const link = document.createElement("a");
			link.download = "verse-image.png";
			link.href = canvas.toDataURL("image/png");
			link.click();
		} catch (error) {
			console.error("Error downloading:", error);
		}
	};

	// Helper function to handle file upload
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setStyle({ ...style, backgroundImage: reader.result });
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
				>
					<motion.div
						initial={{ scale: 0.95, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.95, opacity: 0, y: 20 }}
						transition={{ type: "spring", damping: 25, stiffness: 300 }}
						className="bg-white dark:bg-gray-800  shadow-2xl w-full max-w-4xl xl:max-h-[95vh] h-[99vh] absolute bottom-0 rounded-b-none md:rounded-b-2xl rounded-t-2xl       md:relative md:max-h-[80vh] overflow-scroll md:overflow-hidden"
					>
						<div className="p-3 sm:p-4 md:p-6">
							<div className="flex justify-between items-center mb-4 sm:mb-6">
								<h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									Share Verse
								</h2>
								<button
									onClick={onClose}
									className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
								>
									<X className="w-4 h-4 sm:w-5 sm:h-5" />
								</button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
								{/* Preview Panel */}
								<div className="space-y-4 sm:space-y-6">
									<VersePreview 
										previewRef={previewRef}
										style={style}
										selectedLanguages={selectedLanguages}
										urduVerse={urduVerse}
										englishVerse={englishVerse}
										author={author}
										poemNameUr={poemNameUr}
										bookName={bookName}
									/>

									<ShareButtons 
										handleShare={handleShare}
										handleDownload={handleDownload}
									/>
								</div>

								{/* Controls Panel */}
								<div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[50vh] sm:max-h-[70vh] px-2 -mx-3">
									<StylePresets 
										activePreset={activePreset}
										applyPreset={applyPreset}
									/>

									{/* Advanced Customization Button */}
                        			<div className="mt-4">
                        				<button
                        					onClick={() => setShowAdvanced(!showAdvanced)}
                        					className={`w-full py-2 px-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group ${
                        						showAdvanced 
                        							? "bg-blue-500 text-white shadow-md" 
                        							: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        					}`}
                        				>
                        					<span className="text-sm font-medium">
                        						{showAdvanced ? "Hide" : "Show"} Advanced Customization
                        					</span>
                        					<svg
                        						className={`w-4 h-4 transform transition-transform duration-200 ${
                        							showAdvanced ? "rotate-180" : ""
                        						}`}
                        						fill="none"
                        						stroke="currentColor"
                        						viewBox="0 0 24 24"
                        					>
                        						<path
                        							strokeLinecap="round"
                        							strokeLinejoin="round"
                        							strokeWidth={2}
                        							d="M19 9l-7 7-7-7"
                        						/>
                        					</svg>
                        				</button>
                        			</div>  
									{/* Advanced Customization Section */}
									{showAdvanced && (
										<AdvancedCustomization 
											showAdvanced={showAdvanced}
											style={style}
											setStyle={setStyle}
											selectedLanguages={selectedLanguages}
											toggleLanguage={toggleLanguage}
											handleFileUpload={handleFileUpload}
										/>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
