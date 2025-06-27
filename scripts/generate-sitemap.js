const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key are required. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Static pages
const staticPages = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/search',
  '/books',
];

// Generate sitemap XML
async function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
`;
  });

  try {
    // Fetch all books
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, title_en');

    if (booksError) throw booksError;

    // Add book pages
    books.forEach(book => {
      sitemap += `  <url>
    <loc>${baseUrl}/books/${book.title_en}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    // Fetch all poems with their book information
    const { data: poems, error: poemsError } = await supabase
      .from('book_contents')
      .select(`
        id,
        title_en,
        books (
          title_en
        )
      `);

    if (poemsError) throw poemsError;

    // Add poem pages
    poems.forEach(poem => {
      if (poem.title_en && poem.books?.title_en) {
        sitemap += `  <url>
    <loc>${baseUrl}/books/${poem.books.title_en}/${poem.title_en.replace(/ /g, '-').toLowerCase()}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    });

  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
  }

  sitemap += `</urlset>`;

  // Write sitemap to file
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  
  console.log('Sitemap generated successfully!');
}

// Generate robots.txt
function generateRobotsTxt() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const robotsTxt = `# Allow all crawlers
User-agent: *
Allow: /


# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

  // Write robots.txt to file
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  
  console.log('Robots.txt generated successfully!');
}

// Run the generators
generateSitemap();
generateRobotsTxt(); 
