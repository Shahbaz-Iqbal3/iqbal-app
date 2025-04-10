

export async function generateMetadata({ params }) {
    try {
        // Await the params object
        const { id } = await params;
        
        // Use absolute URL for server-side fetch
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/books/listofpoem?book_id=${id}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch book: ${response.status}`);
        }

        const data = await response.json();
        const book = data.book || {};
        
        // Create image array with fallback
        const images = book.cover_image_url 
            ? [book.cover_image_url, '/images/og-image.jpg'] 
            : ['/images/og-image.jpg'];

        return {
            title: book.title_en ? `${book.title_en} | Poetry Collection` : "Book Details",
            description: book.description || "Explore this beautiful collection of poems",
            openGraph: {
                title: book.title_en ? `${book.title_en} | Poetry Collection` : "Book Details",
                description: book.description || "Explore this beautiful collection of poems",
                images: images,
                type: 'book',
                siteName: 'Sir Muhammad Iqbal - Poetry & Philosophy',
                locale: 'en_US',
                url: `${baseUrl}/books/${id}`,
            },
            twitter: {
                card: "summary_large_image",
                title: book.title_en ? `${book.title_en} | Poetry Collection` : "Book Details",
                description: book.description || "Explore this beautiful collection of poems",
                images: images,
                site: '@iqbalpoetry',
                creator: '@iqbalpoetry',
            },
            alternates: {
                canonical: `${baseUrl}/books/${id}`,
            },
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: "Book Details | Poetry Collection",
            description: "Explore this beautiful collection of poems",
            openGraph: {
                title: "Book Details | Poetry Collection",
                description: "Explore this beautiful collection of poems",
                images: ['/images/og-image.jpg'],
                type: 'book',
                siteName: 'Sir Muhammad Iqbal - Poetry & Philosophy',
                locale: 'en_US',
                url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            },
            twitter: {
                card: "summary_large_image",
                title: "Book Details | Poetry Collection",
                description: "Explore this beautiful collection of poems",
                images: ['/images/og-image.jpg'],
                site: '@iqbalpoetry',
                creator: '@iqbalpoetry',
            },
        };
    }
}

export default function BookLayout({ children }) {
	return children;
} 