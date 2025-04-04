import "./globals.css";
import { Noto_Nastaliq_Urdu, IBM_Plex_Sans_Arabic } from "next/font/google";
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
const gulzar = IBM_Plex_Sans_Arabic({
	subsets: ["arabic"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-gulzar",
	display: 'swap', // Use swap to prevent layout shifts
	preload: true,
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
					href={gulzar.url}
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
			<body className={`${nastaliq.variable} ${gulzar.variable} antialiased min-h-full bg-primary dark:bg-primary-dark`}>
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
