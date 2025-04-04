"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function Hero() {
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
		<div ref={heroRef} className="relative overflow-hidden">
			{/* Background Pattern - Added explicit height and width to prevent layout shift */}
			<div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent dark:from-gray-800/20 dark:to-transparent" style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }} />
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative pt-16 pb-20 sm:pt-24 sm:pb-24 lg:pb-32">
					{/* Content Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						{/* Text Content */}
						<div className="space-y-8 fade-in-up">
							{/* Title with Gradient */}
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
								<span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 animate-gradient">
									Allama Iqbal
								</span>
								<span className="block mt-3 text-2xl sm:text-3xl lg:text-4xl text-gray-600 dark:text-gray-300">
									Poet of the East
								</span>
							</h1>

							{/* Description with Modern Typography - Pre-rendered to improve LCP */}
							<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 100px' }}>
								Allama Iqbal was a visionary poet-philosopher who inspired millions through his powerful verses and philosophical insights. His work continues to illuminate paths of self-discovery and spiritual growth.
							</p>

							{/* Call to Action Buttons */}
							<div className="flex flex-wrap gap-4">
								<Link 
									href="/books"
									className="px-8 py-3 flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
									prefetch={true}
								>
									Explore His Works
								</Link>
								<Link 
									href="/about"
									className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-300 transform hover:scale-105"
									prefetch={true}
								>
									Learn More
								</Link>
							</div>

							{/* Quick Facts */}
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8">
								<div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
									<div className="font-bold text-emerald-600 dark:text-emerald-400">1877-1938</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">Life Span</div>
								</div>
								<div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
									<div className="font-bold text-emerald-600 dark:text-emerald-400">12,000+</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">Verses Written</div>
								</div>
								<div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
									<div className="font-bold text-emerald-600 dark:text-emerald-400">2 Languages</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">Urdu & Persian</div>
								</div>
							</div>
						</div>

						{/* Image Section */}
						<div className="relative lg:ml-auto fade-in-right">
							<div className="relative w-full max-w-lg mx-auto h-[600px] sm:h-[700px]">
								{/* Preload image with a hidden element to improve LCP */}
								<link 
									rel="preload" 
									as="image" 
									href="https://ldqodmsyujkiftjmbich.supabase.co/storage/v1/object/public/images//Allama_Iqbal_-_3.avif"
									imageSrcSet="https://ldqodmsyujkiftjmbich.supabase.co/storage/v1/object/public/images//Allama_Iqbal_-_3.avif 1x, https://ldqodmsyujkiftjmbich.supabase.co/storage/v1/object/public/images//Allama_Iqbal_-_3.avif 2x"
									imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
								
								<Image
									src="https://ldqodmsyujkiftjmbich.supabase.co/storage/v1/object/public/images//Allama_Iqbal_-_3.avif"
									alt="Allama Iqbal"
									className="object-cover object-center rounded-2xl shadow-2xl"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									width={600}
									height={700}
									priority
									quality={90}
									onLoad={() => setImageLoaded(true)}
									style={{
										width: '100%',
										height: '100%',
										opacity: imageLoaded ? 1 : 0,
										transition: 'opacity 0.3s ease-in-out'
									}}
								/>
								
								{/* Placeholder for image while loading */}
								{!imageLoaded && (
									<div 
										className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
										style={{ width: '100%', height: '100%' }}
									/>
								)}
								
								{/* Decorative Elements */}
								<div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-5 group-hover:opacity-30 transition duration-300" />
								<div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-lg opacity-5" />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Add styles for animations */}
			<style jsx>{`
				.animate-in .fade-in-up {
					animation: fadeInUp 0.8s ease-out forwards;
				}
				
				.animate-in .fade-in-right {
					animation: fadeInRight 0.8s ease-out forwards;
				}

				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes fadeInRight {
					from {
						opacity: 0;
						transform: translateX(20px);
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
			`}</style>
		</div>
	);
}

export default Hero;
