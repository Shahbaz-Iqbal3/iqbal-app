import { Metadata } from "next";
import HomePageClient from "@/components/pages/HomePageClient";

export const metadata = {
	title: "Sir Muhammad Iqbal - Poetry & Philosophy | Home",
	description: "Explore the timeless poetry and profound philosophy of Sir Muhammad Iqbal. Access his complete works, including Bang-e-Dra, Zarb-e-Kaleem, and more.",
	openGraph: {
		title: "Sir Muhammad Iqbal - Poetry & Philosophy | Home",
		description: "Explore the timeless poetry and profound philosophy of Sir Muhammad Iqbal. Access his complete works, including Bang-e-Dra, Zarb-e-Kaleem, and more.",
		images: ["/images/og-image.jpg"],
	},
	twitter: {
		card: "summary_large_image",
		title: "Sir Muhammad Iqbal - Poetry & Philosophy | Home",
		description: "Explore the timeless poetry and profound philosophy of Sir Muhammad Iqbal. Access his complete works, including Bang-e-Dra, Zarb-e-Kaleem, and more.",
		images: ["/images/og-image.jpg"],
	},
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_APP_URL}/`,
	},
};

export default function HomePage() {
	return <HomePageClient />;
}
