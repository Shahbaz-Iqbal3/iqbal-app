"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '@/components/ui/SearchResults';

export default function SearchPage() {
	const searchParams = useSearchParams();
	
	// Scroll to top when page loads
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	
	return (
		<div className="md:px-4 min-h-screen transition-colors">
			<SearchResults />
		</div>
	);
}
