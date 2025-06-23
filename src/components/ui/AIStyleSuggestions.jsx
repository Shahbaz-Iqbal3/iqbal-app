import { useEffect } from 'react';

const STOPWORDS = new Set([
  'the', 'is', 'and', 'a', 'an', 'of', 'on', 'in', 'to', 'how', 'can', 'be', 'with',
  'that', 'were', 'was', 'it', 'for', 'at', 'by', 'this', 'from', 'as', 'but', 'or'
]);

// Extract first 2–3 meaningful keywords (no frequency logic)
function extractTopKeywords(text, max = 1) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];

  const meaningfulWords = words.filter(
    word => !STOPWORDS.has(word) && word.length > 2
  );

  // Return the first unique meaningful words (max 3)
  const seen = new Set();
  const result = [];

  for (const word of meaningfulWords) {
    if (!seen.has(word)) {
      seen.add(word);
      result.push(word);
    }
    if (result.length >= max) break;
  }

  return result;
}

async function fetchUnsplashImages(keywords, count = 4) {
  const query = keywords.join(' ') || 'poetry';
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=portrait&per_page=${count}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    },
  });

  const data = await res.json();
  return data?.results?.map(img => img.urls.regular) || [];
}

export default function AIStyleSuggestions({ text, onApplyStyle, autoApply = false }) {
  useEffect(() => {
    if (!autoApply || !text) return;

    const timeoutId = setTimeout(async () => {
      const keywords = extractTopKeywords(text);
      const images = await fetchUnsplashImages(keywords);

      const aiStyle = {
        urduFontId: 'nastaliq',
        englishFontId: 'opensans',
        fontSize: '20px',
        textColor: '#ffffff',
        backgroundColor: '#111827',
        backgroundImage: images[0] || null,
        additionalImages: images,
        imageKeywords: keywords,
        overlayOpacity: 0.5,
      };

      onApplyStyle(aiStyle);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [text, autoApply, onApplyStyle]);

  return null;
}
