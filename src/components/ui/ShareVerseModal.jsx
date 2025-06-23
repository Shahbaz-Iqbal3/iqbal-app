"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X , Download} from "lucide-react";
import AIStyleSuggestions from "./AIStyleSuggestions";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import { urduFonts, englishFonts, stylePresets } from "./shareVerseConstants";

import VersePreview from "./share-verse/VersePreview";
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
	const [style, setStyle] = useState({
		urduFont: urduFonts[0],
		englishFont: englishFonts[0],
		textColor: "#ffffff",
		backgroundColor: "#000000",
		backgroundImage: "none",
		overlayOpacity: 0.5,
		urduFontSize: 2,
		englishFontSize: 1.3,
		aspectRatio: '9/16',
	});
	const [selectedLanguages, setSelectedLanguages] = useState({
		urdu: true,
		english: true,
	});
	const previewRef = useRef(null);
	const [additionalImages, setAdditionalImages] = useState([]);
	const [ImageKeyword, setImageKeyword] = useState('')

	//  useEffect for AI style suggestions
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
	useEffect(() => {
		if (isOpen) {
		  document.body.classList.add("overflow-hidden");
		} else {
		  document.body.classList.remove("overflow-hidden");
		}
	
		// Clean up on unmount
		return () => document.body.classList.remove("overflow-hidden");
	  }, [isOpen]);

	//  handleApplyAIStyle function
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
			aspectRatio: aiStyle.aspectRatio || style.aspectRatio,
		};

		setStyle(newStyle);
		setAdditionalImages(aiStyle.additionalImages || []);
		setImageKeyword(aiStyle.imageKeywords || "no keyword")
		stylePresets[0].style = newStyle;
	};

	

	//  toggleLanguage function
	const toggleLanguage = (lang) => {
		setSelectedLanguages((prev) => ({
			...prev,
			[lang]: !prev[lang],
		}));
	};

	//  generateImage function
	const generateImage = async () => {
		if (!previewRef.current) return null;

		try {
			const canvas = await html2canvas(previewRef.current, {
				scale: 2,
				useCORS: true,
				backgroundColor: style.backgroundColor,
				allowTaint: true,
			});

			return canvas;
		} catch (error) {
			console.error("Error generating image:", error);
			return null;
		}
	};

	//  handleDownload function
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
						className="bg-white dark:bg-gray-800  shadow-2xl w-full max-w-4xl xl:max-h-[95vh] h-[99vh] absolute bottom-0 rounded-b-none md:rounded-b-md rounded-t-md       md:relative  overflow-scroll md:overflow-hidden"
					>
						<div className="p-2 h-full">
							<div className="flex justify-between items-center sm:m-1 pb-2">
								<h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									Share Verse
								</h2>
								<button
									onClick={onClose}
									className="p-2 hover:bg-gray-100 bg-gray-300 bg-opacity-15 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
								>
									<X className="w-4 h-4 sm:w-5 sm:h-5" />
								</button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 h-[90%] ">
								{/* Preview Panel */}
								<div className=" overflow-y-auto scrollbar-modern ">
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

								</div>

								{/* Controls Panel */}
								<div className="space-y-4 sm:space-y-6 px-2 overflow-y-auto scrollbar-modern ">
									
								<div className="flex justify-center items-center">
								<button
                    				onClick={handleDownload}
                    				className="p-2 sm:p-3 w-full justify-center flex gap-2  bg-gray-900 hover:bg-gray-900/60  text-white rounded-md"
                    				title="Download Image"
                    			>
                    				<div><Download className="w-4 h-4 sm:w-5 sm:h-5" /></div>
									<div>Download Image</div>
                    			</button>
								</div>
									<AdvancedCustomization
										style={style}
										setStyle={setStyle}
										selectedLanguages={selectedLanguages}
										toggleLanguage={toggleLanguage}
										handleFileUpload={handleFileUpload}
										additionalImages={additionalImages}
										ImageKeyword={ImageKeyword}
										onSelectBackgroundImage={(img) => setStyle({ ...style, backgroundImage: img })}
									/>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
