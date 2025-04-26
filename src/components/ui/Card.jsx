import React from "react";
import Link from "next/link";
import Image from "next/image";

const Card = ({ image, link, className, isLoading = false }) => {
	if (isLoading) {
		return (
			<div
				className={`card rounded-lg shadow-lg overflow-hidden w-full sm:w-[300px] sm:h-[420px] border-white ${className} bg-gray-200 dark:bg-gray-700 animate-pulse`}
			/>
		);
	}

	return (
		<Link href={link} className="w-full sm:w-[300px] block">
			<div
				className={`card rounded-lg shadow-lg overflow-hidden w-full sm:w-[300px] sm:h-[420px] border-white ${className} hover:scale-[1.02] transition-all duration-300`}
			>
				<Image src={image} alt={link} width={300} height={420} className="w-full h-full object-cover" />
			</div>
		</Link>
	);
};

export default Card;
