"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Download, Check, Globe } from "lucide-react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import AIStyleSuggestions from "./AIStyleSuggestions";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";

// Font configuration
const urduFonts = [
	{
		id: "nastaliq",
		font: "font-nastaliq",
		size: "text-2xl",
	},
	{
		id: "amiri",
		font: "font-amiri",
		size: "text-2xl",
	},
	{
		id: "lateef",
		font: "font-lateef",
		size: "text-3xl",
	},
];

const englishFonts = [
	{
		id: "poppins",
		font: "font-poppins",
	},
	{
		id: "dancing",
		font: "font-dancing",
	},
	{
		id: "playfair",
		font: "font-playfair",
	},
	{
		id: "lora",
		font: "font-lora",
	},
	{
		id: "merriweather",
		font: "font-merriweather",
	},
	{
		id: "roboto",
		font: "font-roboto",
	},
	{
		id: "opensans",
		font: "font-opensans",
	},
];

// Style presets
const stylePresets = [
	{
		id: "ai",
		icon: "✨",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[0],
			textColor: "#ffffff",
			backgroundColor: "#1a202c",
			backgroundImage: "/images/presets/darknature.avif",
			overlayOpacity: 0.7,
		},
	},
	{
		id: "classic",
		icon: "📚",
		style: {
			urduFont: urduFonts[2],
			englishFont: englishFonts[0],
			textColor: "#ffffff",
			backgroundColor: "#2d3748",
			backgroundImage: "/images/presets/romantic.avif",
			overlayOpacity: 0.7,
		},
	},
	{
		id: "modern",
		icon: "🎯",
		style: {
			urduFont: urduFonts[1],
			englishFont: englishFonts[3],
			textColor: "#ffffff",
			backgroundColor: "#2d3748",
			backgroundImage: "/images/presets/hopeful.avif",
			overlayOpacity: 0.8,
		},
	},
	{
		id: "elegant",
		icon: "✒️",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[1],
			textColor: "#ffffff",
			backgroundColor: "#2c1810",
			backgroundImage: "/images/presets/sad.avif",
			overlayOpacity: 0.6,
		},
	},
	{
		id: "nature",
		icon: "🌿",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[2],
			textColor: "#ffffff",
			backgroundColor: "#1a4731",
			backgroundImage: "/images/presets/nature.avif",
			overlayOpacity: 0.7,
		},
	},
];

// Helper function to get font size class based on scale factor
const getFontSizeClass = (baseSize, scaleFactor) => {
	const sizes = {
		0.7: "text-[0.700rem]",
		0.8: "text-[0.756rem]",
		0.9: "text-[0.811rem]",
		1.0: "text-[0.867rem]",
		1.1: "text-[0.922rem]",
		1.2: "text-[0.978rem]",
		1.3: "text-[1.033rem]",
		1.4: "text-[1.089rem]",
		1.5: "text-[1.144rem]",
		1.6: "text-[1.200rem]",
		1.7: "text-[1.256rem]",
		1.8: "text-[1.311rem]",
		1.9: "text-[1.367rem]",
		2.0: "text-[1.422rem]",
		2.1: "text-[1.478rem]",
		2.2: "text-[1.533rem]",
		2.3: "text-[1.589rem]",
		2.4: "text-[1.644rem]",
		2.5: "text-[1.700rem]",
	};
	
	// Find the closest size
	const scale = parseFloat(scaleFactor) || 1.0;
	const keys = Object.keys(sizes).map(Number);
	const closest = keys.reduce((prev, curr) => {
		return Math.abs(curr - scale) < Math.abs(prev - scale) ? curr : prev;
	});
	
	return sizes[closest];
};

// Helper function to check if background image is a preset
const isPresetImage = (imagePath) => {
	const presetPaths = [
		"/images/presets/darknature.avif",
		"/images/presets/romantic.avif",
		"/images/presets/hopeful.avif",
		"/images/presets/sad.avif",
		"/images/presets/nature.avif",
	];
	return presetPaths.includes(imagePath);
};

// Preview component
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
	return (
		<div
			ref={previewRef}
			className="aspect-square rounded-xl shadow-lg overflow-hidden relative w-full max-w-[500px] mx-auto transform transition-transform duration-300"
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
							className={`mb-4 sm:mb-6 text-center text-nowrap leading-relaxed ${style.urduFont.font} ${getFontSizeClass("text-2xl", style.urduFontSize)}`}
						>
							{urduVerse}
						</div>
					)}

					{selectedLanguages.english && englishVerse && (
						<div
							className={`italic leading-relaxed text-nowrap text-center ${style.englishFont.font} ${getFontSizeClass("text-base", style.englishFontSize)}`}
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
					className="text-xs sm:text-sm mt-auto pt-2 sm:pt-4 opacity-80"
					style={{ color: style.textColor }}
				>
					drallamaiabal.com
				</div>
			</div>
		</div>
	);
};

// Share buttons component
const ShareButtons = ({ handleShare, handleDownload }) => {
	return (
		<div className="flex justify-center space-x-2 sm:space-x-4">
			<button
				onClick={() => handleShare("twitter")}
				className="p-2 sm:p-3 bg-blue-400 hover:bg-blue-500 text-white rounded-full"
				title="Share on Twitter"
			>
				<FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
			</button>
			<button
				onClick={() => handleShare("facebook")}
				className="p-2 sm:p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
				title="Share on Facebook"
			>
				<FaFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
			</button>
			<button
				onClick={() => handleShare("whatsapp")}
				className="p-2 sm:p-3 bg-green-500 hover:bg-green-600 text-white rounded-full"
				title="Share on WhatsApp"
			>
				<FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
			</button>
			<button
				onClick={handleDownload}
				className="p-2 sm:p-3 bg-gray-700 hover:bg-gray-800 text-white rounded-full"
				title="Download Image"
			>
				<Download className="w-4 h-4 sm:w-5 sm:h-5" />
			</button>
		</div>
	);
};

// Style presets component
const StylePresets = ({ activePreset, applyPreset }) => {
	return (
		<div className="space-y-3 sm:space-y-4">
			<h3 className="text-base sm:text-lg font-semibold flex items-center">
				<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					Style Presets
				</span>
			</h3>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
				{/* AI Suggested Style Button */}
				<button
					onClick={() => applyPreset("ai")}
					className={`p-2 sm:p-4 border-2 rounded-xl ${
						activePreset === "ai"
							? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
							: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
					}`}
				>
					<div className="flex flex-col items-center">
						<span className="text-xl sm:text-2xl mb-1 sm:mb-2">✨</span>
						<span className="text-xs sm:text-sm font-medium">AI Suggested</span>
					</div>
				</button>

				{/* Other Style Presets */}
				{stylePresets
					.filter((preset) => preset.id !== "ai")
					.map((preset) => (
						<button
							key={preset.id}
							onClick={() => applyPreset(preset.id)}
							className={`p-2 sm:p-4 border-2 rounded-xl ${
								activePreset === preset.id
									? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
									: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
							}`}
						>
							<div className="flex flex-col items-center">
								<span className="text-xl sm:text-2xl mb-1 sm:mb-2">{preset.icon}</span>
								<span className="text-xs sm:text-sm font-medium">{preset.id}</span>
							</div>
						</button>
					))}
			</div>
		</div>
	);
};

// Language selection component
const LanguageSelection = ({ selectedLanguages, toggleLanguage }) => {
	return (
		<div className="space-y-3 sm:space-y-4">
			<h3 className="text-base sm:text-lg font-semibold flex items-center">
				<Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
				<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					Languages
				</span>
			</h3>
			<div className="flex gap-4 sm:gap-6">
				<label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
					<div
						className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
							selectedLanguages.urdu
								? "bg-blue-500 border-blue-500"
								: "border-gray-300 group-hover:border-blue-400"
						}`}
						onClick={() => toggleLanguage("urdu")}
					>
						{selectedLanguages.urdu && (
							<Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
						)}
					</div>
					<span className="text-xs sm:text-sm font-medium">Urdu</span>
				</label>
				<label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
					<div
						className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
							selectedLanguages.english
								? "bg-blue-500 border-blue-500"
								: "border-gray-300 group-hover:border-blue-400"
						}`}
						onClick={() => toggleLanguage("english")}
					>
						{selectedLanguages.english && (
							<Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
						)}
					</div>
					<span className="text-xs sm:text-sm font-medium">English</span>
				</label>
			</div>
		</div>
	);
};

// Font customization component
const FontCustomization = ({ style, setStyle }) => {
	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Urdu Font Selection */}
			<div>
				<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
					Urdu Font
				</label>
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
								className={`mt-1 leading-[6px] ${font.font} ${
									font.id === "lateef" ? "text-lg sm:text-xl" : "text-xs sm:text-sm"
								} ${font.id === "nastaliq" ? "mb-1 sm:mb-2" : ""}`}
							>
								اردو
							</span>
						</button>
					))}
				</div>
				
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
			</div>

			{/* English Font Selection */}
			<div>
				<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
					English Font
				</label>
				<div className="flex flex-wrap items-center justify-start gap-1 sm:gap-2">
					{englishFonts.map((font) => (
						<button
							key={font.id}
							onClick={() => setStyle({ ...style, englishFont: font })}
							className={`p-1 sm:p-2 py-0 border rounded-md ${
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

// Color customization component
const ColorCustomization = ({ style, setStyle }) => {
	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Text Color */}
			<div>
				<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
					Text Color
				</label>
				<div
					className="w-full h-6 sm:h-8 bg-white rounded-md border-2 border-gray-300"
					style={{ backgroundColor: style.textColor }}
				>
					<input
						type="color"
						value={style.textColor}
						onChange={(e) =>
							setStyle({ ...style, textColor: e.target.value })
						}
						className="w-full h-6 sm:h-8 p-1 border-2 rounded-xl cursor-pointer opacity-0"
					/>
				</div>
			</div>

			{/* Background Color */}
			<div>
				<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
					Background Color
				</label>
				<div
					className="w-full h-6 sm:h-8 bg-white rounded-md border-2 border-gray-300"
					style={{ backgroundColor: style.backgroundColor }}
				>
					<input
						type="color"
						value={style.backgroundColor}
						onChange={(e) =>
							setStyle({ ...style, backgroundColor: e.target.value })
						}
						className="w-full h-6 sm:h-8 p-1 border-2 rounded-xl cursor-pointer opacity-0"
					/>
				</div>
			</div>
		</div>
	);
};

// Background image component
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

// Overlay opacity component
const OverlayOpacityCustomization = ({ style, setStyle }) => {
	if (!style.backgroundImage) return null;
	
	return (
		<div>
			<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
				Background Overlay Opacity
			</label>
			<input
				type="range"
				min="0"
				max="1"
				step="0.1"
				value={style.overlayOpacity}
				onChange={(e) =>
					setStyle({
						...style,
						overlayOpacity: parseFloat(e.target.value),
					})
				}
				className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
			/>
			<div className="flex justify-between text-xs text-gray-500 mt-1">
				<span>Transparent</span>
				<span>Opaque</span>
			</div>
		</div>
	);
};

// Advanced customization section
const AdvancedCustomization = ({ 
	showAdvanced, 
	style, 
	setStyle, 
	selectedLanguages, 
	toggleLanguage,
	handleFileUpload
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			className="space-y-4 sm:space-y-6 border-t pt-4 sm:pt-6"
		>
			<LanguageSelection 
				selectedLanguages={selectedLanguages} 
				toggleLanguage={toggleLanguage} 
			/>
			
			<FontCustomization style={style} setStyle={setStyle} />
			
			<ColorCustomization style={style} setStyle={setStyle} />
			
			<BackgroundImageCustomization 
				style={style} 
				setStyle={setStyle} 
				handleFileUpload={handleFileUpload} 
			/>
			
			<OverlayOpacityCustomization style={style} setStyle={setStyle} />
		</motion.div>
	);
};

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
						className="bg-white dark:bg-gray-800  shadow-2xl w-full max-w-4xl max-h-[95vh] absolute bottom-0 rounded-b-none md:rounded-b-2xl rounded-t-2xl       md:relative md:max-h-[80vh] overflow-scroll md:overflow-hidden"
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
								<div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[50vh] sm:max-h-[55vh] pr-2">
									<StylePresets 
										activePreset={activePreset}
										applyPreset={applyPreset}
									/>

									{/* Advanced Customization Toggle */}
									<button
										onClick={() => setShowAdvanced(!showAdvanced)}
										className="w-full p-2 sm:p-3 text-xs sm:text-sm border-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center space-x-2 group"
									>
										<span className="font-medium">
											{showAdvanced ? "Hide" : "Show"} Advanced Customization
										</span>
										<svg
											className={`w-3 h-3 sm:w-4 sm:h-4 transform transition-transform duration-200 ${
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
