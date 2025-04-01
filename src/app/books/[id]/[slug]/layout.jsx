import { Metadata } from "next";

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

export async function generateMetadata({ params }) {
    try {
        // Await the params object
        const { id, slug } = await params;
        
        // Use absolute URL for server-side fetch
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/poems?poem_id=${slug}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch poem: ${response.status}`);
        }

        const poem = await response.json();
        
        // Get book details for better context
        const bookResponse = await fetch(`${baseUrl}/api/books/listofpoem?book_id=${id}`, {
            next: { revalidate: 3600 },
        });
        
        const bookData = await bookResponse.json();
        const book = bookData.book || {};

        return {
            title: poem.title_en ? `${poem.title_en.toProperCase()} | ${book.title_en.toProperCase() || 'Poetry Collection'}` : "Poem Details",
            description: poem.stanzas?.[0]?.content_en || "Read this beautiful poem from our collection",
            openGraph: {
                title: poem.title_en ? `${poem.title_en.toProperCase()} | ${book.title_en.toProperCase() || 'Poetry Collection'}` : "Poem Details",
                description: poem.stanzas?.[0]?.content_en || "Read this beautiful poem from our collection",
                images: book.cover_image_url ? [book.cover_image_url] : [],
            },
            twitter: {
                card: "summary_large_image",
                title: poem.title_en ? `${poem.title_en.toProperCase()} | ${book.title_en.toProperCase() || 'Poetry Collection'}` : "Poem Details",
                description: poem.stanzas?.[0]?.content_en || "Read this beautiful poem from our collection",
                images: book.cover_image_url ? [book.cover_image_url] : [],
            },
            alternates: {
                canonical: `${baseUrl}/books/${id}/${slug}`,
            },
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: "Poem Details | Poetry Collection",
            description: "Read this beautiful poem from our collection",
        };
    }
}

export default function PoemLayout({ children }) {
    return children;
} 