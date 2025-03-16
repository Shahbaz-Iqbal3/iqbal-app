import React from "react";
import Link from "next/link";
import Image from "next/image";

const Card = ({ image, link, className }) => {
	return (
		<Link href={link}>
			<div
				className={`card rounded-lg shadow-lg overflow-hidden w-[300px] h-[420px] border-white ${className}`}
			>
				<Image
					src={image}
					alt={link}
					width={300}
					height={420}
					
				/>
			</div>
		</Link>
	);
};

export default Card;
