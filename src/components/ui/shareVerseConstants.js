// Font configuration
export const urduFonts = [
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
];

export const englishFonts = [
	{
		id: "poppins",
		font: "font-poppins",
	},
	{
		id: "dancing",
		font: "font-dancing",
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
export const stylePresets = [
	{
		id: "ai",
		icon: "✨",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[2],
			textColor: "#ffffff",
			backgroundColor: "#1a202c",
			backgroundImage: "/images/presets/darknature.avif",
			overlayOpacity: 0.7,
		},
	},
	
	{
		id: "minimal",
		icon: "⚪",
		style: {
			urduFont: urduFonts[1],
			englishFont: englishFonts[3],
			textColor: "#000000",
			backgroundColor: "#ffffff",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "dark",
		icon: "⚫",
		style: {
			urduFont: urduFonts[1],
			englishFont: englishFonts[2],
			textColor: "#ffffff",
			backgroundColor: "#000000",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "sepia",
		icon: "🟤",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[1],
			textColor: "#3c2a21",
			backgroundColor: "#f4ecd8",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "ocean",
		icon: "🌊",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[0],
			textColor: "#ffffff",
			backgroundColor: "#0c4a6e",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "sunset",
		icon: "🌅",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[3],
			textColor: "#ffffff",
			backgroundColor: "#7c2d12",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "forest",
		icon: "🌲",
		style: {
			urduFont: urduFonts[1],
			englishFont: englishFonts[3],
			textColor: "#f0fdf4",
			backgroundColor: "#14532d",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "lavender",
		icon: "💜",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[2],
			textColor: "#ffffff",
			backgroundColor: "#581c87",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "golden",
		icon: "✨",
		style: {
			urduFont: urduFonts[1],
			englishFont: englishFonts[0],
			textColor: "#000000",
			backgroundColor: "#fbbf24",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "pastel",
		icon: "🎨",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[1],
			textColor: "#4c1d95",
			backgroundColor: "#fae8ff",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "midnight",
		icon: "🌙",
		style: {
			urduFont: urduFonts[1],
			englishFont: englishFonts[0],
			textColor: "#e2e8f0",
			backgroundColor: "#0f172a",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "rose",
		icon: "🌹",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[3],
			textColor: "#ffffff",
			backgroundColor: "#be123c",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	{
		id: "emerald",
		icon: "💎",
		style: {
			urduFont: urduFonts[0],
			englishFont: englishFonts[2],
			textColor: "#ffffff",
			backgroundColor: "#047857",
			backgroundImage: "",
			overlayOpacity: 0,
		},
	},
	
];

// Helper function to get font size class based on scale factor
export const getFontSizeClass = (baseSize, scaleFactor) => {
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
export const isPresetImage = (imagePath) => {
	const presetPaths = [
		"/images/presets/darknature.avif",
		"/images/presets/romantic.avif",
		"/images/presets/hopeful.avif",
		"/images/presets/sad.avif",
		"/images/presets/nature.avif",
	];
	return presetPaths.includes(imagePath);
}; 