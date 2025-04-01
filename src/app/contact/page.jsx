import { Metadata } from "next";

export const metadata = {
	title: "Contact Us | Sir Muhammad Iqbal",
	description:
		"Get in touch with us for any questions about Sir Muhammad Iqbal's poetry, philosophy, or website. We welcome your feedback and suggestions.",
	openGraph: {
		title: "Contact Us | Sir Muhammad Iqbal",
		description:
			"Get in touch with us for any questions about Sir Muhammad Iqbal's poetry, philosophy, or website. We welcome your feedback and suggestions.",
		images: ["/images/og-image.jpg"],
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact Us | Sir Muhammad Iqbal",
		description:
			"Get in touch with us for any questions about Sir Muhammad Iqbal's poetry, philosophy, or website. We welcome your feedback and suggestions.",
		images: ["/images/og-image.jpg"],
	},
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
	},
};

export default function ContactPage() {
	return (
		<div className="container mx-auto px-4 py-8 ">
			<h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-8">
				Contact Us
			</h1>
			<div className="max-w-2xl mx-auto">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
					<h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
						Get in Touch
					</h2>
					<p className="text-gray-600 dark:text-gray-300 mb-6">
						We welcome your questions, feedback, and suggestions about Sir Muhammad Iqbal's
						poetry and philosophy. Please use the form below to reach out to us.
					</p>
					<form className="space-y-4">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="message"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Message
							</label>
							<textarea
								id="message"
								name="message"
								rows="4"
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
								required
							></textarea>
						</div>
						<button
							type="submit"
							className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
						>
							Send Message
						</button>
					</form>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
					<h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
						Other Ways to Connect
					</h2>
					<div className="space-y-4">
						<p className="text-gray-600 dark:text-gray-300">
							<strong>Email:</strong> shahbaziqbal233@gmail.com
						</p>
						<p className="text-gray-600 dark:text-gray-300">
							<strong>Social Media:</strong>
						</p>
						<div className="flex space-x-4">
							<a
								href="#"
								className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
							>
								Twitter
							</a>
							<a
								href="#"
								className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
							>
								Facebook
							</a>
							<a
								href="#"
								className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
							>
								Instagram
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
