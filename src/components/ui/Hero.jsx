"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function  Hero() {
	const heroRef = useRef(null);
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('animate-in');
				}
			},
			{ threshold: 0.1 }
		);

		if (heroRef.current) {
			observer.observe(heroRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div ref={heroRef} className="relative min-h-[78vh] flex items-center overflow-hidden bg-gradient-to-br from-[#F5E6CA] via-white to-[#0B3D2E]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-[#D4AF37]/20 dark:bg-[#D4AF37]/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
				<div className="absolute top-40 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-[#0B3D2E]/20 dark:bg-[#0B3D2E]/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
				<div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-[#D4AF37]/15 dark:bg-[#D4AF37]/5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
			</div>

			{/* Subtle Texture Overlay */}
			<div className="absolute inset-0 opacity-30" style={{
				backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230B3D2E' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
			}}></div>
			
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
						{/* Text Content */}
					<div className="space-y-6 sm:space-y-8 fade-in-up text-center lg:text-left">
						{/* Badge */}
						<div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0B3D2E]/10 dark:bg-[#0B3D2E]/20 text-[#0B3D2E] dark:text-[#D4AF37] text-xs sm:text-sm font-medium border border-[#0B3D2E]/20 dark:border-[#D4AF37]/20">
							<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D4AF37] rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
							Poet-Philosopher of the East
						</div>

						{/* Main Title */}
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
							<span className="block text-[#0B3D2E] dark:text-white">
								Where Iqbal's
								</span>
							<span className="block text-[#D4AF37] dark:text-[#D4AF37] animate-gradient">
								Words Come Alive
								</span>
							</h1>

						{/* Description */}
						<p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#0B3D2E]/80 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
							Explore the timeless poetry, wisdom, and vision of Allama Muhammad Iqbal — reimagined for today's world.
							</p>

							{/* Call to Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
								<Link 
									href="/books"
								className="group px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#0B3D2E] to-[#0B3D2E]/90 hover:from-[#0B3D2E]/90 hover:to-[#0B3D2E] text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#0B3D2E]/25 flex items-center justify-center space-x-2 text-sm sm:text-base"
									prefetch={true}
								>
								<span>Explore Poetry</span>
								<svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
								</Link>
								<Link 
								href="/generate-art"
								className="px-6 py-3 sm:px-8 sm:py-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0B3D2E] border-2 border-[#D4AF37] rounded-xl font-semibold hover:border-[#D4AF37]/90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-sm sm:text-base"
									prefetch={true}
								>
								Generate Art from a Verse
								</Link>
							</div>

						{/* Quick Stats */}
						<div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8">
							<div className="text-center p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
								<div className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#0B3D2E] dark:text-[#D4AF37]">12,000+</div>
								<div className="text-xs sm:text-sm text-[#0B3D2E]/70 dark:text-gray-400 font-medium">Verses</div>
								</div>
							<div className="text-center p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
								<div className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#0B3D2E] dark:text-[#D4AF37]">6</div>
								<div className="text-xs sm:text-sm text-[#0B3D2E]/70 dark:text-gray-400 font-medium">Collections</div>
								</div>
							<div className="text-center p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20">
								<div className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#0B3D2E] dark:text-[#D4AF37]">2</div>
								<div className="text-xs sm:text-sm text-[#0B3D2E]/70 dark:text-gray-400 font-medium">Languages</div>
								</div>
							</div>
						</div>

						{/* Image Section */}
					<div className="relative lg:ml-auto fade-in-right mt-8 lg:mt-0">
						<div className="relative w-full max-w-sm sm:max-w-lg mx-auto">
							{/* Decorative Frame */}
							<div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-[#0B3D2E] via-[#D4AF37] to-[#0B3D2E] rounded-2xl sm:rounded-3xl blur-lg opacity-20 animate-pulse"></div>
							
							{/* Image Container */}
							<div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl">
								<div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-xl sm:rounded-2xl overflow-hidden">
									{/* Preload image */}
								<link 
									rel="preload" 
									as="image" 
									href="https://ldqodmsyujkiftjmbich.supabase.co/storage/v1/object/public/images//Allama_Iqbal_-_3.avif"
									imageSrcSet="https://ldqodmsyujkiftjmbich.supabase.co/storage/v1/object/public/images//Allama_Iqbal_-_3.avif 1x, https://ldqodmsyujkiftjmbich.supabase.co/storage/v1/object/public/images//Allama_Iqbal_-_3.avif 2x"
									imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
								
								<Image
									src="https://ldqodmsyujkiftjmbich.supabase.co/storage/v1/object/public/images//Allama_Iqbal_-_3.avif"
										alt="Allama Muhammad Iqbal - Poet-Philosopher of the East"
										className="object-cover object-center"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									width={600}
									height={700}
									priority
										quality={95}
									onLoad={() => setImageLoaded(true)}
									style={{
										width: '100%',
										height: '100%',
										opacity: imageLoaded ? 1 : 0,
											transition: 'opacity 0.5s ease-in-out'
									}}
								/>
								
									{/* Loading placeholder */}
								{!imageLoaded && (
									<div 
											className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl sm:rounded-2xl animate-pulse"
										/>
									)}
								</div>
								
								{/* Floating Quote */}
								<div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20 max-w-[200px] sm:max-w-xs">
									<p className="text-xs sm:text-sm text-[#0B3D2E] dark:text-gray-300 font-nastaliq">
										"ستاروں سے آگے جہاں اور بھی ہیں"
									</p>
									<p className="text-xs text-[#D4AF37] dark:text-[#D4AF37] mt-1 font-medium">
										- Allama Iqbal
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<a href="#art-section" className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
				<div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-[#0B3D2E] dark:border-[#D4AF37] rounded-full flex justify-center">
					<div className="w-1 h-2 sm:h-3 bg-[#0B3D2E] dark:bg-[#D4AF37] rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
				</div>
			</a>

			{/* Animation Styles */}
			<style jsx>{`
				.animate-in .fade-in-up {
					animation: fadeInUp 1s ease-out forwards;
				}
				
				.animate-in .fade-in-right {
					animation: fadeInRight 1s ease-out forwards;
				}

				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes fadeInRight {
					from {
						opacity: 0;
						transform: translateX(30px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				.animate-gradient {
					background-size: 200% 200%;
					animation: gradient 8s ease infinite;
				}

				@keyframes gradient {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}

				.animate-blob {
					animation: blob 7s infinite;
				}

				.animation-delay-2000 {
					animation-delay: 2s;
				}

				.animation-delay-4000 {
					animation-delay: 4s;
				}

				@keyframes blob {
					0% {
						transform: translate(0px, 0px) scale(1);
					}
					33% {
						transform: translate(30px, -50px) scale(1.1);
					}
					66% {
						transform: translate(-20px, 20px) scale(0.9);
					}
					100% {
						transform: translate(0px, 0px) scale(1);
					}
				}
			`}</style>
		</div>
	);
}

export default Hero;
