import { Metadata } from "next";

export const metadata = {
    title: "Privacy Policy | Sir Muhammad Iqbal",
    description: "Learn about how we collect, use, and protect your personal information on our website.",
    openGraph: {
        title: "Privacy Policy | Sir Muhammad Iqbal",
        description: "Learn about how we collect, use, and protect your personal information on our website.",
        images: ["/images/og-image.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Privacy Policy | Sir Muhammad Iqbal",
        description: "Learn about how we collect, use, and protect your personal information on our website.",
        images: ["/images/og-image.jpg"],
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/privacy`,
    },
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8  ">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-8">Privacy Policy</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">1. Information We Collect</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        We collect information that you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                        <li>Account information (name, email, password)</li>
                        <li>Profile information</li>
                        <li>Communication preferences</li>
                    </ul>
                    <p className="text-gray-600 dark:text-gray-300">
                        We also collect information automatically when you use our website, including:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                        <li>Device information</li>
                        <li>IP address</li>
                        <li>Browser type</li>
                        <li>Usage data</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">2. How We Use Your Information</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                        <li>Provide and maintain our services</li>
                        <li>Improve and personalize your experience</li>
                        <li>Communicate with you</li>
                        <li>Protect against fraud and abuse</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">3. Data Security</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        We implement appropriate security measures to protect your personal information, including:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                        <li>Encryption of data in transit and at rest</li>
                        <li>Regular security assessments</li>
                        <li>Access controls and authentication</li>
                        <li>Secure data storage</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">4. Your Rights</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                        <li>Access your personal information</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of marketing communications</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">5. Contact Us</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        Email: shahbaziqbal233@gmail.com
                    </p>
                </section>
            </div>
        </div>
    );
} 