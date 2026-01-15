import React from "react";
import Link from "next/link";
import Image from "next/image";

const Card = ({ image, link, className, isLoading = false }) => {
	if (isLoading) {
		return (
			<div className={`relative group rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse ${className}`}>
				<div className="aspect-[3/4] w-full"></div>
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
			</div>
		);
	}

	return (
		<Link href={link} className="block group">
			<div className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${className}`}>
				{/* Image Container */}
				<div className="relative aspect-[3/4] overflow-hidden">
					<Image 
						src={image} 
						alt={link} 
						width={300} 
						height={400} 
						className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
					/>
					
					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					
					{/* Hover Content */}
					<div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
						<div className="text-white">
							<div className="flex items-center space-x-2 mb-2">
								<div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
								<span className="text-sm font-medium">Explore Collection</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-sm">View Details</span>
								<svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
							</div>
						</div>
					</div>
				</div>
				
				{/* Decorative Border */}
				<div className="absolute inset-0 rounded-2xl border border-gray-200 dark:border-gray-700 group-hover:border-[#D4AF37] dark:group-hover:border-[#D4AF37] transition-colors duration-300"></div>
				
				{/* Glow Effect */}
				<div className="absolute -inset-1 bg-gradient-to-r from-[#0B3D2E] to-[#D4AF37] rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
			</div>
		</Link>
	);
};

export default Card;
