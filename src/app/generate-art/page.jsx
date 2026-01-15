"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Sparkles, BookOpen, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import AIStyleSuggestions from '@/components/ui/AIStyleSuggestions';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { urduFonts, englishFonts, stylePresets } from '@/components/ui/shareVerseConstants';
import VersePreview from '@/components/ui/share-verse/VersePreview';
import AdvancedCustomization from '@/components/ui/share-verse/AdvancedCustomization';

export default function GenerateArtPage() {
	const [selectedVerse, setSelectedVerse] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const [showCustomization, setShowCustomization] = useState(false);
	
	// Style state
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
	const [imageKeyword, setImageKeyword] = useState('');

	// Search for verses
	const searchVerses = async (query) => {
		if (!query.trim()) return;
		
		setIsSearching(true);
		try {
			const response = await fetch(`/api/search?contentType=stanza&q=${encodeURIComponent(query)}&page=1`);
			const data = await response.json();
			setSearchResults(data.results || []);
		} catch (error) {
			console.error('Error searching verses:', error);
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleSearch = () => {
		searchVerses(searchQuery);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	// Select a verse
	const selectVerse = (verse) => {
		setSelectedVerse(verse);
		setShowPreview(true);
		setShowCustomization(false);
		};

	// AI Style suggestions
	useEffect(() => {
		let root = null;
		let isMounted = true;

		if (showPreview && selectedVerse && (selectedVerse.content_en || selectedVerse.content_ur)) {
			const container = document.createElement("div");
			root = createRoot(container);
			root.render(
				<AIStyleSuggestions
					text={selectedVerse.content_en || selectedVerse.content_ur}
					onApplyStyle={handleApplyAIStyle}
					autoApply={true}
				/>
			);
		}

		return () => {
			isMounted = false;
			setTimeout(() => {
				if (root && isMounted === false) {
					root.unmount();
				}
			}, 0);
		};
	}, [showPreview, selectedVerse]);

	const handleApplyAIStyle = (aiStyle) => {
		const matchUrduFont = urduFonts.find((f) => f.id === aiStyle.urduFontId) || urduFonts[0];
		const matchEnglishFont = englishFonts.find((f) => f.id === aiStyle.englishFontId) || englishFonts[0];

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
		setImageKeyword(aiStyle.imageKeywords || "no keyword");
		stylePresets[0].style = newStyle;
	};

	// Toggle language display
	const toggleLanguage = (lang) => {
		setSelectedLanguages((prev) => ({
			...prev,
			[lang]: !prev[lang],
		}));
	};

	// Generate and download image
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

	const handleDownload = async () => {
		const canvas = await generateImage();
		if (!canvas) return;

		try {
			const link = document.createElement("a");
			link.download = `iqbal-verse-${Date.now()}.png`;
			link.href = canvas.toDataURL("image/png");
			link.click();
		} catch (error) {
			console.error("Error downloading:", error);
		}
	};

	// Handle file upload
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

	// Sample verses for demonstration
	const sampleVerses = [
		{
			id: 1,
			content_ur: "ستاروں سے آگے جہاں اور بھی ہیں",
			content_en: "Beyond the stars, there are other worlds",
			poem_name_ur: "جاوید نامہ",
			poem_name_en: "Javed Nama",
			book_name: "Bal-e-Jibril"
		},
		{
			id: 2,
			content_ur: "خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے",
			content_en: "Raise yourself so high that before every destiny",
			poem_name_ur: "شکوہ",
			poem_name_en: "Shikwa",
			book_name: "Bang-e-Dra"
		},
		{
			id: 3,
			content_ur: "محبت مجھے ان جوانوں سے ہے",
			content_en: "I have love for these young ones",
			poem_name_ur: "محبت",
			poem_name_en: "Muhabbat",
			book_name: "Bal-e-Jibril"
		}
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#F5E6CA] via-white to-[#0B3D2E]/5 dark:from-gray-900/10  dark:to-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
				{/* Header */}
				<div className="text-center mb-6 sm:mb-12">
					<div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#D4AF37]/20 dark:bg-[#D4AF37]/10 text-[#0B3D2E] dark:text-[#D4AF37] text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-[#D4AF37]/30">
						<Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
						AI-Powered Art Generation
					</div>
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B3D2E] dark:text-white mb-2 sm:mb-6">
						<span className="bg-gradient-to-r from-[#0B3D2E] to-[#D4AF37] dark:from-[#D4AF37] dark:to-[#0B3D2E] bg-clip-text text-transparent">
							Your Verse, Your Vision
						</span>
					</h1>
					<p className="text-sm sm:text-base lg:text-lg text-[#0B3D2E]/80 dark:text-gray-300 max-w-2xl mx-auto">
						Select any couplet from Iqbal's poetry and watch it transform into a stunning piece of digital art instantly.
					</p>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1  md:grid-cols-2 gap-8 lg:gap-12">
					{/* Verse Selection Panel */}
					<div className="space-y-6 order-2 md:order-1">
						{/* Search Section */}
						<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
							<h2 className="text-lg sm:text-xl font-bold text-[#0B3D2E] dark:text-white mb-4 flex items-center">
								<Search className="w-5 h-5 mr-2" />
								Search Verses
							</h2>
							<div className="flex gap-3">
								<input
									type="text"
									placeholder="Search for verses..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyPress={handleKeyPress}
									className="flex-1 px-4 py-2 text-xs sm:text-sm border border-[#0B3D2E]/20 dark:border-[#D4AF37]/20 rounded-lg bg-white dark:bg-gray-700 text-[#0B3D2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
								/>
								<button
									onClick={handleSearch}
									disabled={isSearching}
									className="px-4 py-2 text-xs sm:text-sm bg-[#0B3D2E] hover:bg-[#0B3D2E]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
								>
									{isSearching ? 'Searching...' : 'Search'}
								</button>
							</div>
						</div>

						{/* Search Results */}
						{searchResults.length > 0 ? (
							<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
								<h2 className="text-lg sm:text-xl font-bold text-[#0B3D2E] dark:text-white mb-4">
									Search Results
								</h2>
								<div className="space-y-4">
									{searchResults.map((verse, index) => (
										<motion.div
											key={index}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="p-4 border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20 rounded-lg hover:border-[#D4AF37] dark:hover:border-[#D4AF37] cursor-pointer transition-colors"
											onClick={() => selectVerse(verse)}
										>
											<div className="text-right mb-2">
												<p className="text-sm sm:text-base font-nastaliq text-[#0B3D2E] dark:text-white">
													{verse.content_ur.split("|")[0]}<br/><br/>{verse.content_ur.split("|")[1]}
												</p>
											</div>
											<div className="text-left">
												<p className="text-xs sm:text-sm text-[#0B3D2E]/70 dark:text-gray-400 italic">
												{verse.content_en.split("|")[0]}<br/>{verse.content_en.split("|")[1]}
												</p>
												<p className="text-xs text-[#D4AF37] mt-1">
													{verse.title_ur} • {verse.book_name}
												</p>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						) : (<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
							<h2 className="text-lg sm:text-xl font-bold text-[#0B3D2E] dark:text-white mb-4 flex items-center">
								<BookOpen className="w-5 h-5 mr-2" />
								Popular Verses
							</h2>
							<div className="space-y-4">
								{sampleVerses.map((verse) => (
									<motion.div
										key={verse.id}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="p-4 border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20 rounded-lg hover:border-[#D4AF37] dark:hover:border-[#D4AF37] cursor-pointer transition-colors"
										onClick={() => selectVerse(verse)}
									>
										<div className="text-right mb-2">
											<p className="text-sm sm:text-base font-nastaliq text-[#0B3D2E] dark:text-white">
												{verse.content_ur}
											</p>
										</div>
										<div className="text-left">
											<p className="text-xs sm:text-sm text-[#0B3D2E]/70 dark:text-gray-400 italic">
												{verse.content_en}
											</p>
											<p className="text-xs text-[#D4AF37] mt-1">
												{verse.poem_name_en} • {verse.book_name}
											</p>
										</div>
									</motion.div>
								))}
							</div>
						</div>)}

					
					</div>

					{/* Preview and Customization Panel */}
					<div className="space-y-6 order-1 md:order-2">
						{showPreview && selectedVerse ? (
							<>
								{/* Preview */}
								<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
									<div className="flex justify-between items-center mb-4">
										<h2 className="text-lg sm:text-xl font-bold text-[#0B3D2E] dark:text-white flex items-center">
											<ImageIcon className="w-5 h-5 mr-2" />
											Art Preview
										</h2>
										<button
											onClick={handleDownload}
											className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0B3D2E] rounded-lg font-medium transition-colors"
										>
											<Download className="w-4 h-4" />
											Download
										</button>
									</div>
									<div className="flex justify-center">
										<VersePreview
											previewRef={previewRef}
											style={style}
											selectedLanguages={selectedLanguages}
											urduVerse={selectedVerse.content_ur.replace("|", "\n")}
											englishVerse={selectedVerse.content_en.replace("|", "\n")}
											author={selectedVerse.poem_name_ur}
											poemNameUr={selectedVerse.title_ur}
											bookName={selectedVerse.book_name}
										/>
									</div>
								</div>

								{/* Customization */}
								<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
									<div className="flex justify-between items-center">
     									<h2 className="text-lg sm:text-xl font-bold text-[#0B3D2E] dark:text-white">
     										Customize Your Art
     									</h2>
     									<button onClick={() => setShowCustomization(!showCustomization)} className="text-[#0B3D2E] dark:text-white p-2 rounded-full bg-[#D4AF37]/20 dark:bg-[#D4AF37]/10" >
     											{showCustomization ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
     									</button>
									</div>
									{showCustomization && (
									<AdvancedCustomization
										style={style}
										setStyle={setStyle}
										selectedLanguages={selectedLanguages}
										toggleLanguage={toggleLanguage}
										handleFileUpload={handleFileUpload}
										additionalImages={additionalImages}
										ImageKeyword={imageKeyword}
										onSelectBackgroundImage={(img) => setStyle({ ...style, backgroundImage: img })}
									/>
									)}
								</div>
							</>
						) : (
							/* Empty State */
							<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-8 sm:p-12 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20 text-center">
								<div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#D4AF37]/20 dark:bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
									<ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37]" />
								</div>
								<h3 className="text-lg sm:text-xl font-bold text-[#0B3D2E] dark:text-white mb-2 sm:mb-3">
									Select a Verse
								</h3>
								<p className="text-sm sm:text-base text-[#0B3D2E]/70 dark:text-gray-400">
									Choose a verse from the left panel to start creating your personalized art piece.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
