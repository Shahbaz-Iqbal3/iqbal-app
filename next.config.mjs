/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'ldqodmsyujkiftjmbich.supabase.co',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'fonts.gstatic.com',
				pathname: '/**',
			},
					{
			protocol: 'https',
			hostname: 'fonts.googleapis.com',
			pathname: '/**',
		},
		{
			protocol: 'https',
			hostname: 'images.unsplash.com',
			pathname: '/**',
		},
		],
	},
	// Font optimization is enabled by default in Next.js 13+
};

// Add metadata configuration
export const metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default nextConfig;
