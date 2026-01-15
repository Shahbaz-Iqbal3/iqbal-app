export const metadata = {
	title: "Generate Art from Verses | Allama Iqbal Poetry",
	description: "Transform Iqbal's verses into stunning digital art with AI-powered styling. Create personalized artwork from your favorite couplets.",
	openGraph: {
		title: "Generate Art from Verses | Allama Iqbal Poetry",
		description: "Transform Iqbal's verses into stunning digital art with AI-powered styling. Create personalized artwork from your favorite couplets.",
		images: ['/images/og-image.jpg'],
		type: 'website',
		siteName: 'Sir Muhammad Iqbal - Poetry & Philosophy',
		locale: 'en_US',
	},
	twitter: {
		card: "summary_large_image",
		title: "Generate Art from Verses | Allama Iqbal Poetry",
		description: "Transform Iqbal's verses into stunning digital art with AI-powered styling. Create personalized artwork from your favorite couplets.",
		images: ['/images/og-image.jpg'],
		site: '@iqbalpoetry',
		creator: '@iqbalpoetry',
	},
};

export default function GenerateArtLayout({ children }) {
	return (
		<div className="min-h-screen">
			{children}
		</div>
	);
}
