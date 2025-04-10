
export const metadata = {
    title: "All Books | Sir Muhammad Iqbal",
    description: "Explore the complete collection of Sir Muhammad Iqbal's poetry books. Discover his masterpieces like Bang-e-Dra, Zarb-e-Kaleem, and Javed Nama in both Urdu and English.",
    openGraph: {
        title: "All Books | Sir Muhammad Iqbal",
        description: "Explore the complete collection of Sir Muhammad Iqbal's poetry books. Discover his masterpieces like Bang-e-Dra, Zarb-e-Kaleem, and Javed Nama in both Urdu and English.",
        images: ["/images/og-image.jpg"],
        type: 'website',
        siteName: 'Sir Muhammad Iqbal - Poetry & Philosophy',
        locale: 'en_US',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/books`,
    },
    twitter: {
        card: "summary_large_image",
        title: "All Books | Sir Muhammad Iqbal",
        description: "Explore the complete collection of Sir Muhammad Iqbal's poetry books. Discover his masterpieces like Bang-e-Dra, Zarb-e-Kaleem, and Javed Nama in both Urdu and English.",
        images: ["/images/og-image.jpg"],
        site: '@iqbalpoetry',
        creator: '@iqbalpoetry',
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/books`,
    },
};

export default function SearchLayout({ children }) {
    return children;
} 