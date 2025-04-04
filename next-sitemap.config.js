/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  exclude: [
    '/admin/*',
    '/user/*',
    '/api/*',
    '/auth/*',
    '/hooks/*',
    '/contexts/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/user',
          '/api',
          '/auth',
          '/hooks',
          '/contexts',
        ],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sitemap.xml`,
    ],
  },
  // Add additional options for dynamic routes
  transform: async (config, path) => {
    // Handle dynamic book routes
    if (path.includes('/books/[id]')) {
      // Fetch book IDs from your data source
      const bookIds = await fetchBookIds();
      return bookIds.map(id => ({
        loc: `/books/${id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }));
    }
    
    // Handle dynamic poem routes
    if (path.includes('/books/[id]/[slug]')) {
      // Fetch book and poem data from your data source
      const bookPoems = await fetchBookPoems();
      return bookPoems.map(({ bookId, poemSlug }) => ({
        loc: `/books/${bookId}/${poemSlug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }));
    }
    
    // Default configuration for static pages
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },
};

// Function to fetch book IDs
async function fetchBookIds() {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/books/list`);
    const data = await response.json();
    
    if (data && Array.isArray(data)) {
      return data.map(book => book.id || book.slug);
    }
    
    // Fallback to sample data if API fails
    return ['bang-e-dra', 'zarb-e-kaleem', 'javid-nama', 'asrar-e-khudi'];
  } catch (error) {
    console.error('Error fetching book IDs:', error);
    // Fallback to sample data
    return ['bang-e-dra', 'zarb-e-kaleem', 'javid-nama', 'asrar-e-khudi'];
  }
}

// Function to fetch book poems
async function fetchBookPoems() {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/books/all-poems`);
    const data = await response.json();
    
    if (data && Array.isArray(data)) {
      return data.map(poem => ({
        bookId: poem.book_id || poem.bookId,
        poemSlug: poem.slug || poem.id,
      }));
    }
    
    // Fallback to sample data if API fails
    return [
      { bookId: 'bang-e-dra', poemSlug: 'shikwa' },
      { bookId: 'bang-e-dra', poemSlug: 'jawab-e-shikwa' },
      { bookId: 'zarb-e-kaleem', poemSlug: 'khizr-e-rah' },
      { bookId: 'javid-nama', poemSlug: 'introduction' },
    ];
  } catch (error) {
    console.error('Error fetching book poems:', error);
    // Fallback to sample data
    return [
      { bookId: 'bang-e-dra', poemSlug: 'shikwa' },
      { bookId: 'bang-e-dra', poemSlug: 'jawab-e-shikwa' },
      { bookId: 'zarb-e-kaleem', poemSlug: 'khizr-e-rah' },
      { bookId: 'javid-nama', poemSlug: 'introduction' },
    ];
  }
}
