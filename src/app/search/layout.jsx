import { Metadata } from "next";

export const metadata = {
    title: "Search Poems | Sir Muhammad Iqbal",
    description: "Search through the complete collection of Sir Muhammad Iqbal's poetry. Find poems by title, content, or theme.",
    openGraph: {
        title: "Search Poems | Sir Muhammad Iqbal",
        description: "Search through the complete collection of Sir Muhammad Iqbal's poetry. Find poems by title, content, or theme.",
        images: ["/images/og-image.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Search Poems | Sir Muhammad Iqbal",
        description: "Search through the complete collection of Sir Muhammad Iqbal's poetry. Find poems by title, content, or theme.",
        images: ["/images/og-image.jpg"],
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/search`,
    },
};

export default function SearchLayout({ children }) {
    return children;
} 