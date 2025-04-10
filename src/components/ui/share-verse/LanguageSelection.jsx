import React from "react";
import { Globe, Check } from "lucide-react";

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

export default LanguageSelection; 