"use client";
import { Hero, Card } from "@/components";
import { useEffect, useState } from "react";
import PoemLinks from "../ui/PoemLinks";
import Link from "next/link";

const HomePageClient = () => {
	const [books, setBooks] = useState([]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const getData = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/books");
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			setBooks(data.data);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	// Generate skeleton cards for loading state
	const renderSkeletonCards = () => {
		return Array(8)
			.fill(0)
			.map((_, index) => (
				<div key={`skeleton-${index}`} className="w-full">
					<Card isLoading={true} />
				</div>
			));
	};

	return (
		<div className="min-h-[80vh] bg-gradient-to-br from-[#F5E6CA] via-white to-[#0B3D2E]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Hero Section */}
			<Hero />
			
			{/* Featured Feature Section - "Your Verse, Your Vision" */}
			<section id="art-section" className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0B3D2E]/5 to-[#D4AF37]/5 dark:from-[#0B3D2E]/10 dark:to-[#D4AF37]/10">
				{/* Background decorative elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#D4AF37]/20 dark:bg-[#D4AF37]/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
					<div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#0B3D2E]/20 dark:bg-[#0B3D2E]/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
				</div>
				
				<div className="relative max-w-7xl mx-auto">
					{/* Section Header */}
					<div className="text-center mb-12 sm:mb-16">
						<div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#D4AF37]/20 dark:bg-[#D4AF37]/10 text-[#0B3D2E] dark:text-[#D4AF37] text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-[#D4AF37]/30">
							<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D4AF37] rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
							AI-Powered Art Generation
						</div>
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#0B3D2E] dark:text-white mb-4 sm:mb-6">
							<span className="bg-gradient-to-r from-[#0B3D2E] to-[#D4AF37] dark:from-[#D4AF37] dark:to-[#0B3D2E] bg-clip-text text-transparent">
								Your Verse, Your Vision
							</span>
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-[#0B3D2E]/80 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
							Select any couplet from Iqbal's poetry and watch it transform into a stunning piece of digital art instantly.
						</p>
					</div>

					{/* Feature Demo */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8 sm:mb-12">
						{/* Verse Side */}
						<div className="space-y-4 sm:space-y-6">
							<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
								<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0B3D2E] dark:text-white mb-3 sm:mb-4">Selected Verse</h3>
								<div className="bg-[#F5E6CA] dark:bg-[#0B3D2E]/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
									<p className="text-base sm:text-lg lg:text-xl font-nastaliq text-[#0B3D2E] dark:text-white text-center leading-relaxed">
										"ستاروں سے آگے جہاں اور بھی ہیں"
									</p>
									<p className="text-xs sm:text-sm text-[#0B3D2E]/70 dark:text-gray-400 text-center mt-2">
										"Beyond the stars, there are other worlds"
									</p>
								</div>
							</div>
						</div>

						{/* Generated Art Side */}
						<div className="relative">
							<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
								<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0B3D2E] dark:text-white mb-3 sm:mb-4">Generated Art</h3>
								<div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-[#0B3D2E] via-[#D4AF37] to-[#F5E6CA]">
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="text-center text-white">
											<svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											<p className="text-xs sm:text-sm">Space-themed artwork</p>
											<p className="text-xs opacity-70">Generated from Iqbal's verse</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Call to Action */}
					<div className="text-center">
						<Link 
							href="/generate-art"
							className="inline-flex items-center space-x-2 sm:space-x-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/90 text-[#0B3D2E] rounded-full font-semibold hover:from-[#D4AF37]/90 hover:to-[#D4AF37] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
						>
							<span>Try Now</span>
							<svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</Link>
					</div>
				</div>
			</section>

			{/* Explore Iqbal's Works Section */}
			<section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
				<div className="relative max-w-7xl mx-auto">
					{/* Section Header */}
					<div className="text-center mb-12 sm:mb-16">
						<div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0B3D2E]/10 dark:bg-[#0B3D2E]/20 text-[#0B3D2E] dark:text-[#D4AF37] text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-[#0B3D2E]/20">
							<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0B3D2E] rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
							Complete Collection
						</div>
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#0B3D2E] dark:text-white mb-4 sm:mb-6">
							<span className="bg-gradient-to-r from-[#0B3D2E] to-[#D4AF37] dark:from-[#D4AF37] dark:to-[#0B3D2E] bg-clip-text text-transparent">
								A Journey Through His Words
							</span>
				</h2>
						<p className="text-sm sm:text-base lg:text-lg text-[#0B3D2E]/80 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
							Dive deep into Iqbal's ghazals, nazams, and philosophical writings. Search, read, and listen — all in one place.
						</p>
					</div>

					{/* Books Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
					{isLoading
						? renderSkeletonCards()
						: books.map((book, index) => (
									<div key={index} className="group">
										<Card 
											image={book.cover_image_url} 
											link={`/books/${book.title_en}`}
											className="group-hover:shadow-2xl group-hover:shadow-[#0B3D2E]/20 transition-all duration-500"
										/>
									</div>
							  ))}
					</div>

					{/* Call to Action */}
					<div className="text-center mt-12 sm:mt-16">
						<Link 
							href="/books"
							className="inline-flex items-center space-x-2 sm:space-x-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#0B3D2E] to-[#0B3D2E]/90 text-white rounded-full font-semibold hover:from-[#0B3D2E]/90 hover:to-[#0B3D2E] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
						>
							<span>Explore All Works</span>
							<svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</Link>
					</div>
				</div>
			</section>

			{/* Audio & Video Experience Section */}
			<section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#0B3D2E]/5 to-[#D4AF37]/5 dark:from-[#0B3D2E]/10 dark:to-[#D4AF37]/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 sm:mb-16">
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#0B3D2E] dark:text-white mb-4 sm:mb-6">
							<span className="bg-gradient-to-r from-[#0B3D2E] to-[#D4AF37] dark:from-[#D4AF37] dark:to-[#0B3D2E] bg-clip-text text-transparent">
								Iqbal in Voice & Vision
							</span>
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-[#0B3D2E]/80 dark:text-gray-300 max-w-2xl mx-auto">
							Listen to soulful recitations of his verses or watch visuals crafted from his poetry.
						</p>
					</div>

					{/* Multimedia Features */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
						{/* Audio Player */}
						<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
							<div className="flex items-center mb-4 sm:mb-6">
								<div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mr-3 sm:mr-4">
									<svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B3D2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
									</svg>
								</div>
								<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0B3D2E] dark:text-white">Audio Recitations</h3>
							</div>
							<p className="text-sm sm:text-base text-[#0B3D2E]/80 dark:text-gray-300 mb-4 sm:mb-6">
								Experience the emotional depth of Iqbal's poetry through professional audio recitations.
							</p>
							<div className="bg-[#F5E6CA] dark:bg-[#0B3D2E]/20 rounded-lg sm:rounded-xl p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium text-[#0B3D2E] dark:text-white text-sm sm:text-base">Shikwa - The Complaint</p>
										<p className="text-xs sm:text-sm text-[#0B3D2E]/70 dark:text-gray-400">Professional Recitation</p>
									</div>
									<button className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0B3D2E] rounded-full flex items-center justify-center">
										<svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
											<path d="M8 5v14l11-7z"/>
										</svg>
									</button>
								</div>
							</div>
						</div>

						{/* Video Content */}
						<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
							<div className="flex items-center mb-4 sm:mb-6">
								<div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mr-3 sm:mr-4">
									<svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B3D2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
									</svg>
								</div>
								<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0B3D2E] dark:text-white">Visual Poetry</h3>
							</div>
							<p className="text-sm sm:text-base text-[#0B3D2E]/80 dark:text-gray-300 mb-4 sm:mb-6">
								Watch animated interpretations of Iqbal's verses brought to life through visual storytelling.
							</p>
							<div className="bg-gradient-to-br from-[#0B3D2E] to-[#D4AF37] rounded-lg sm:rounded-xl p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium text-white text-sm sm:text-base">Jawab-e-Shikwa</p>
										<p className="text-xs sm:text-sm text-white/80">Animated Poetry Video</p>
									</div>
									<button className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
										<svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
											<path d="M8 5v14l11-7z"/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Poems Section */}
			<section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#F5E6CA] to-white dark:from-gray-800 dark:to-gray-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 sm:mb-16">
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#0B3D2E] dark:text-white mb-4 sm:mb-6">
							<span className="bg-gradient-to-r from-[#0B3D2E] to-[#D4AF37] dark:from-[#D4AF37] dark:to-[#0B3D2E] bg-clip-text text-transparent">
								Timeless Verses
							</span>
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-[#0B3D2E]/80 dark:text-gray-300 max-w-2xl mx-auto">
							Immerse yourself in the most celebrated poems that continue to inspire generations with their profound wisdom and poetic beauty.
						</p>
			</div>
			<PoemLinks />
				</div>
			</section>

			{/* Call to Action Banner */}
			<section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#0B3D2E] to-[#0B3D2E]/90 dark:from-[#0B3D2E] dark:to-[#0B3D2E]/80">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10" style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
				}}></div>
				
				<div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
						Iqbal's vision was for the future — let's explore it together.
					</h2>
					<p className="text-sm sm:text-base lg:text-lg text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
						Join thousands of readers discovering the timeless wisdom and poetic beauty of Allama Iqbal's works.
					</p>
					<Link 
						href="/books"
						className="inline-flex items-center space-x-2 sm:space-x-3 px-6 py-3 sm:px-8 sm:py-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0B3D2E] rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
					>
						<span>Start Reading</span>
						<svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</Link>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
						<div className="text-center p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F5E6CA] to-[#D4AF37]/20 dark:from-[#0B3D2E]/20 dark:to-[#D4AF37]/10 border border-[#D4AF37]/20 dark:border-[#D4AF37]/10">
							<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B3D2E] dark:text-[#D4AF37] mb-2">12,000+</div>
							<div className="text-sm sm:text-base text-[#0B3D2E]/70 dark:text-gray-300">Verses Written</div>
						</div>
						<div className="text-center p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0B3D2E]/10 to-[#D4AF37]/10 dark:from-[#0B3D2E]/20 dark:to-[#D4AF37]/20 border border-[#0B3D2E]/20 dark:border-[#0B3D2E]/10">
							<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B3D2E] dark:text-[#D4AF37] mb-2">6</div>
							<div className="text-sm sm:text-base text-[#0B3D2E]/70 dark:text-gray-300">Major Collections</div>
						</div>
						<div className="text-center p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#D4AF37]/10 to-[#0B3D2E]/10 dark:from-[#D4AF37]/20 dark:to-[#0B3D2E]/20 border border-[#D4AF37]/20 dark:border-[#D4AF37]/10">
							<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B3D2E] dark:text-[#D4AF37] mb-2">2</div>
							<div className="text-sm sm:text-base text-[#0B3D2E]/70 dark:text-gray-300">Languages</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePageClient;
