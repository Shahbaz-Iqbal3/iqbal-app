import { useEffect } from 'react';

const STOPWORDS = new Set([
  'the', 'is', 'and', 'a', 'an', 'of', 'on', 'in', 'to', 'how', 'can', 'be', 'with',
  'that', 'were', 'was', 'it', 'for', 'at', 'by', 'this', 'from', 'as', 'but', 'or'
]);

// Extract top 2–3 meaningful keywords
function extractTopKeywords(text, max = 1) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];

  const frequencyMap = {};
  const orderMap = {};

  words.forEach((word, index) => {
    if (!STOPWORDS.has(word) && word.length > 2) {
      frequencyMap[word] = (frequencyMap[word] || 0) + 1;
      if (orderMap[word] === undefined) orderMap[word] = index; // first appearance
    }
  });

  return Object.entries(frequencyMap)
    .sort((a, b) =>
      b[1] === a[1] ? orderMap[a[0]] - orderMap[b[0]] : b[1] - a[1]
    )
    .slice(0, max)
    .map(([word]) => word);
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
