import React from "react";

const ColorCustomization = ({ style, setStyle }) => {
	return (
		<div className="flex gap-2">
			{/* Text Color */}
			<div>
				<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
					Text Color
				</label>
				<div
					className="w-28 h-6 sm:h-8 rounded-md"
					style={{ backgroundColor: style.textColor }}
				>
					<input
						type="color"
						value={style.textColor}
						onChange={(e) =>
							setStyle({ ...style, textColor: e.target.value })
						}
						className="w-full h-6 sm:h-8 p-1   rounded-xl cursor-pointer opacity-0"
					/>
				</div>
			</div>

			{/* Background Color */}
			<div>
				<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
					Background Color
				</label>
				<div
					className="w-28 h-6 sm:h-8 bg-white rounded-md   border-gray-300"
					style={{ backgroundColor: style.backgroundColor }}
				>
					<input
						type="color"
						value={style.backgroundColor}
						onChange={(e) =>
							setStyle({ ...style, backgroundColor: e.target.value })
						}
						className="w-full h-6 sm:h-8 p-1   rounded-xl cursor-pointer opacity-0"
					/>
				</div>
			</div>
		</div>
	);
};

export default ColorCustomization; 