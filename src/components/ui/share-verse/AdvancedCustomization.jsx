import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import LanguageSelection from "./LanguageSelection";
import FontCustomization from "./FontCustomization";
import ColorCustomization from "./ColorCustomization";
import BackgroundImageCustomization from "./BackgroundImageCustomization";
import OverlayOpacityCustomization from "./OverlayOpacityCustomization";

const AdvancedCustomization = ({ 
	style, 
	setStyle, 
	selectedLanguages, 
	toggleLanguage,
	handleFileUpload,
	additionalImages = [],
	ImageKeyword,
	onSelectBackgroundImage
}) => {
	const [searchKeyword, setSearchKeyword] = useState("");
	const [searchedImages, setSearchedImages] = useState([]);
	const [isSearching, setIsSearching] = useState(false);

	const searchUnsplashImages = async (keyword) => {
		if (!keyword.trim()) return;
		
		setIsSearching(true);
		try {
			const query = keyword.trim();
			const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=portrait&per_page=8`;
			const res = await fetch(url, {
				headers: {
					Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
				},
			});
			const data = await res.json();
			const images = data?.results?.map(img => img.urls.regular) || [];
			setSearchedImages(images);
		} catch (error) {
			console.error("Error searching Unsplash:", error);
			setSearchedImages([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleSearch = () => {
		searchUnsplashImages(searchKeyword);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			className="space-y-4 sm:space-y-6"
		>
			<LanguageSelection 
				selectedLanguages={selectedLanguages} 
				toggleLanguage={toggleLanguage} 
			/>
			
			<FontCustomization style={style} setStyle={setStyle} />
			{/* Aspect Ratio Selection */}
			<div>
			  <div className="mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">Aspect Ratio</div>
			  <div className="flex gap-2 mb-4">
			    {[
			      { label: '1:1', value: '1/1' , icon: ""},
			      { label: '3:4', value: '3/4' , icon: ""},
			      { label: '9:16', value: '9/16' , icon: ""},
			    ].map(opt => (
			      <button
			        key={opt.value}
			        type="button"
			        className={`p-2 rounded border text-xs font-medium transition-all duration-150 bg-opacity-35 focus:outline-none ${style.aspectRatio === opt.value ? ' text-white border-blue-600 bg-blue-600/20' : ' border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}
			        onClick={() => setStyle({ ...style, aspectRatio: opt.value })}
			      >
			        {opt.label}
			      </button>
			    ))}
			  </div>
			</div>
			{additionalImages.length > 0 && (
				<div>
					<div className="mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">
						AI Suggested Backgrounds: {Array.isArray(ImageKeyword) ? ImageKeyword[0] : ImageKeyword}
					</div>
					<div className="flex gap-2 flex-wrap">
						{additionalImages.map((img, idx) => (
							<button
								key={img}
								type="button"
								className={`rounded overflow-hidden border-2 transition-all duration-150 focus:outline-none ${style.backgroundImage === img ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 dark:border-gray-600'}`}
								style={{ width: 56, height: 56, padding: 0 }}
								onClick={() => onSelectBackgroundImage && onSelectBackgroundImage(img)}
							>
								<img 
									src={img} 
									alt={`AI bg ${idx + 1}`} 
									className="object-cover w-full h-full"
									onError={(e) => {
										console.error('AI background image failed to load:', img);
										e.target.style.display = 'none';
									}}
								/>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Search Unsplash Images */}
			<div>
				<div className="mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">Search Backgrounds</div>
				<div className="flex gap-2 mb-3">
					<input
						type="text"
						placeholder="Enter keywords (e.g., nature, sunset, flowers)"
						value={searchKeyword}
						onChange={(e) => setSearchKeyword(e.target.value)}
						onKeyPress={handleKeyPress}
						className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						onClick={handleSearch}
						disabled={isSearching || !searchKeyword.trim()}
						className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200 flex items-center gap-1"
					>
						<Search className="w-4 h-4" />
						{isSearching ? 'Searching...' : 'Search'}
					</button>
				</div>
				
				{searchedImages.length > 0 && (
					<div>
						<div className="mb-2 text-xs text-gray-600 dark:text-gray-400">
							Search results for: "{searchKeyword}"
						</div>
						<div className="flex gap-2 flex-wrap">
							{searchedImages.map((img, idx) => (
								<button
									key={`search-${img}`}
									type="button"
									className={`rounded overflow-hidden border-2 transition-all duration-150 focus:outline-none ${style.backgroundImage === img ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 dark:border-gray-600'}`}
									style={{ width: 56, height: 56, padding: 0 }}
									onClick={() => onSelectBackgroundImage && onSelectBackgroundImage(img)}
								>
									<img 
										src={img} 
										alt={`Search result ${idx + 1}`} 
										className="object-cover w-full h-full"
										onError={(e) => {
											console.error('Search result image failed to load:', img);
											e.target.style.display = 'none';
										}}
									/>
								</button>
							))}
						</div>
					</div>
				)}
			</div>
			
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

export default AdvancedCustomization; 