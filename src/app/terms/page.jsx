import { Metadata } from "next";

export const metadata = {
    title: "Terms of Service | Sir Muhammad Iqbal",
    description: "Read our terms of service to understand the rules and guidelines for using our website.",
    openGraph: {
        title: "Terms of Service | Sir Muhammad Iqbal",
        description: "Read our terms of service to understand the rules and guidelines for using our website.",
        images: ["/images/og-image.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Terms of Service | Sir Muhammad Iqbal",
        description: "Read our terms of service to understand the rules and guidelines for using our website.",
        images: ["/images/og-image.jpg"],
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/terms`,
    },
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-8 ">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-8">Terms of Service</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">1. Acceptance of Terms</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        By accessing and using this website, you accept and agree to be bound by the terms and conditions of this agreement.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">2. Use License</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        Permission is granted to temporarily download one copy of the materials (information or software) on Sir Muhammad Iqbal's website for personal, non-commercial transitory viewing only.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">3. User Accounts</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">4. Intellectual Property</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        The content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Sir Muhammad Iqbal and is protected by copyright laws.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">5. User Conduct</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        You agree not to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                        <li>Use the service for any illegal purposes</li>
                        <li>Violate any intellectual property rights</li>
                        <li>Harass, abuse, or harm others</li>
                        <li>Interfere with or disrupt the service</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">6. Disclaimer</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        The materials on Sir Muhammad Iqbal's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">7. Contact Information</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        Email: shahbaziqbal233@gmail.com
                    </p>
                </section>
            </div>
        </div>
    );
} 