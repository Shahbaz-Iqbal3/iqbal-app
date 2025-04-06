import "./globals.css";
import { 
	Noto_Nastaliq_Urdu, 
	Amiri,
	Lateef,
	Poppins,
	Dancing_Script,
	Playfair_Display,
	Lora,
	Merriweather,
	Roboto,
	Open_Sans 
} from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Notifications } from "@/components/layout/Notifications";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components";
import { ThemeScript } from "@/components/layout/ThemeScript";
import CookieConsent from "@/components/ui/CookieConsent";

// Preload fonts to prevent layout shifts
const nastaliq = Noto_Nastaliq_Urdu({ 
	subsets: ["arabic"], 
	variable: "--font-nastaliq",
	display: 'swap', // Use swap to prevent layout shifts
	preload: true,
});

const amiri = Amiri({
	subsets: ["arabic"],
	weight: ["400", "700"],
	variable: "--font-amiri",
	display: 'swap', // Use swap to prevent layout shifts
	preload: true,
});

const lateef = Lateef({
	subsets: ["arabic"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-lateef",
	display: 'swap', // Use swap to prevent layout shifts
	preload: true,
});

// Poem generator fonts
const poppins = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-poppins",
	display: 'swap',
});

const dancingScript = Dancing_Script({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-dancing",
	display: 'swap',
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
	display: 'swap',
});

const lora = Lora({
	subsets: ["latin"],
	variable: "--font-lora",
	display: 'swap',
});

const merriweather = Merriweather({
	subsets: ["latin"],
	weight: ["300", "400", "700", "900"],
	variable: "--font-merriweather",
	display: 'swap',
});

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700", "900"],
	variable: "--font-roboto",
	display: 'swap',
});

const openSans = Open_Sans({
	subsets: ["latin"],
	variable: "--font-opensans",
	display: 'swap',
});

export const metadata = {
	title: "Sir Muhammad Iqbal - Poetry & Philosophy",
	description: "Exploring the poetry and philosophy of Sir Muhammad Iqbal",
	icons: {
		icon: [
			{ url: '/favicon_io1/favicon.ico' },
			{ url: '/favicon_io1/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/favicon_io1/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: [
			{ url: '/favicon_io1/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
		],
		other: [
			{ 
				rel: 'android-chrome-192x192',
				url: '/favicon_io1/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{ 
				rel: 'android-chrome-512x512',
				url: '/favicon_io1/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			},
		],
	},
	manifest: '/favicon_io1/site.webmanifest',
	openGraph: {
		title: "Sir Muhammad Iqbal - Poetry & Philosophy",
		description: "Exploring the poetry and philosophy of Sir Muhammad Iqbal",
		images: [
			{
				url: '/images/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'Sir Muhammad Iqbal - Poetry & Philosophy',
			},
		],
		type: 'website',
		siteName: 'Sir Muhammad Iqbal - Poetry & Philosophy',
		locale: 'en_US',
		url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
	},
	twitter: {
		card: "summary_large_image",
		title: "Sir Muhammad Iqbal - Poetry & Philosophy",
		description: "Exploring the poetry and philosophy of Sir Muhammad Iqbal",
		images: ['/images/og-image.jpg'],
		site: '@iqbalpoetry',
		creator: '@iqbalpoetry',
	},
	alternates: {
		canonical: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
	},
};

export default async function RootLayout({ children }) {
	return (
		<html lang="en" className="h-full light">
			<head>
				<ThemeScript />
				{/* Preload fonts to prevent layout shifts */}
				<link
					rel="preload"
					href={nastaliq.url}
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link 
					rel="preload"
					href={amiri.url}
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href={lateef.url}
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				{/* Web manifest for PWA support */}
				<link rel="manifest" href="/favicon_io1/site.webmanifest" />
				{/* Apple touch icon */}
				<link rel="apple-touch-icon" href="/favicon_io1/apple-touch-icon.png" />
				{/* Favicon for different devices */}
				<link rel="icon" type="image/x-icon" href="/favicon_io1/favicon.ico" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon_io1/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon_io1/favicon-16x16.png" />
				{/* Android Chrome icons */}
				<link rel="icon" type="image/png" sizes="192x192" href="/favicon_io1/android-chrome-192x192.png" />
				<link rel="icon" type="image/png" sizes="512x512" href="/favicon_io1/android-chrome-512x512.png" />
			</head>
			<body className={`${nastaliq.variable} ${amiri.variable} ${lateef.variable} ${poppins.variable} ${dancingScript.variable} ${playfair.variable} ${lora.variable} ${merriweather.variable} ${roboto.variable} ${openSans.variable} antialiased min-h-full bg-primary dark:bg-primary-dark`}>
				<ThemeProvider>
					<SessionProvider>
						<NotificationProvider>
							<main className="flex flex-col min-h-screen">
								<Navbar />
								{children}
								<Notifications />
								<Footer />
								<CookieConsent />
							</main>
						</NotificationProvider>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
