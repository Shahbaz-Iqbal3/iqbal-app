import React from "react";

const OverlayOpacityCustomization = ({ style, setStyle }) => {
	if (!style.backgroundImage) return null;
	
	return (
		<div>
			<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 ">
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

export default OverlayOpacityCustomization; 