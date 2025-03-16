import React from "react";

/**
 * SearchResultsSkeleton - A loading placeholder for search results
 * Shows animated skeletons while the search results are loading
 * @returns {JSX.Element} The skeleton loader component
 */
const SearchResultsSkeleton = ({ count = 5 }) => {
	return (
		<div className="w-full animate-pulse">
			{/* Header skeleton */}
			<div className="mb-6">
				<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-full mb-3"></div>
			</div>

			<div className="flex flex-wrap gap-2 mb-6">
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-32"></div>
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-28"></div>
			</div>
			{/* Filter bar skeleton */}

			{/* Results skeleton */}
			<div className="space-y-6">
				{Array.from({ length: count }).map((_, index) => (
					<div
						key={`skeleton-${index}`}
						className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900"
					>
						{/* Meta info */}
						<div className="flex gap-2 mb-3 w-full justify-between">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
						</div>
						<div className="flex items-start gap-3">
							{/* Type icon placeholder */}

							<div className="flex-1 space-y-3 flex flex-col">
								{/* Title */}
								<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 self-end "></div>
								<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 self-end "></div>

								{/* Some have a subtitle */}
								
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
								

								{/* Content - variable number of lines */}
								<div className="space-y-2 mt-2">
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
									
										<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/5"></div>
								
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Pagination skeleton */}
			<div className="flex justify-between items-center mt-8">
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
				<div className="flex gap-2">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={`page-${index}`}
							className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md"
						></div>
					))}
				</div>
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
			</div>
		</div>
	);
};

export default SearchResultsSkeleton;
