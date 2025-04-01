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

const nastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], variable: "--font-nastaliq" });
const gulzar = IBM_Plex_Sans_Arabic({
	subsets: ["arabic"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-gulzar",
});

export const metadata = {
	title: "Sir Muhammad Iqbal - Poetry & Philosophy",
	description: "Exploring the poetry and philosophy of Sir Muhammad Iqbal",
};

export default async function RootLayout({ children }) {
	return (
		<html lang="en" className="h-full light">
			<head>
				<ThemeScript />
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
