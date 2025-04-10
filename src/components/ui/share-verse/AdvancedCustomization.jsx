import React from "react";
import { motion } from "framer-motion";
import LanguageSelection from "./LanguageSelection";
import FontCustomization from "./FontCustomization";
import ColorCustomization from "./ColorCustomization";
import BackgroundImageCustomization from "./BackgroundImageCustomization";
import OverlayOpacityCustomization from "./OverlayOpacityCustomization";

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

export default AdvancedCustomization; 