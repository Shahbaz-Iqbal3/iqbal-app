import { Metadata } from "next";

export const metadata = {
    title: "About Allama Iqbal | Sir Muhammad Iqbal",
    description: "Learn about the life, philosophy, and contributions of Allama Iqbal, the great poet-philosopher of the East. Discover his vision for a modern Islamic renaissance.",
    openGraph: {
        title: "About Allama Iqbal | Sir Muhammad Iqbal",
        description: "Learn about the life, philosophy, and contributions of Allama Iqbal, the great poet-philosopher of the East. Discover his vision for a modern Islamic renaissance.",
        images: ["/images/og-image.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "About Allama Iqbal | Sir Muhammad Iqbal",
        description: "Learn about the life, philosophy, and contributions of Allama Iqbal, the great poet-philosopher of the East. Discover his vision for a modern Islamic renaissance.",
        images: ["/images/og-image.jpg"],
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
    },
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8 ">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-8">About Allama Iqbal</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                    Sir Muhammad Iqbal (1877-1938), widely known as Allama Iqbal, was a philosopher, poet, and politician in British India who is widely regarded as having inspired the Pakistan Movement. He is considered one of the most important figures in Urdu literature, with literary work in both Urdu and Persian.
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">Early Life and Education</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Born in Sialkot, Punjab, Iqbal studied at Government College Lahore and later at Trinity College, Cambridge. He was called to the bar at Lincoln's Inn and received a doctorate from the University of Munich.
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">Literary Contributions</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Iqbal's poetry and philosophy have left an indelible mark on literature and thought. His works include:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
                    <li>Bang-e-Dra (The Call of the Marching Bell)</li>
                    <li>Zarb-e-Kaleem (The Rod of Moses)</li>
                    <li>Javid Nama (The Book of Eternity)</li>
                    <li>Asrar-e-Khudi (The Secrets of the Self)</li>
                </ul>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">Philosophical Vision</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Iqbal's philosophy emphasized the development of the self (Khudi) and the revival of Islamic thought in the modern world. He believed in the power of individual action and the importance of spiritual development.
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">Political Influence</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Iqbal's vision for a separate Muslim state in the Indian subcontinent played a crucial role in the creation of Pakistan. His famous Allahabad Address of 1930 is considered a milestone in the Pakistan Movement.
                </p>
            </div>
        </div>
    );
}
