import Image from "next/image";


export default function ProfileImage({ image }) {
	return (
		<div className="relative sm:size-44 size-20 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-md group">
			{image ? (
				<>
				<Image
					src={image}
					alt="Profile"
					fill
					className="object-cover"
					property="true"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 176px"
					priority
				/>
				<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
			</>
		) : (
			<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 text-blue-400 dark:text-blue-300" style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
				<svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
					<path
						fillRule="evenodd"
						d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
						clipRule="evenodd"
					/>
				</svg>
			</div>
		)}
	</div>
);
}