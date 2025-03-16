import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";
import { DEFAULT_BOOKS } from '@/components/search/utils';

// Common search terms that users might be interested in
const COMMON_TERMS = [
  // Poem titles
  "Shikwa", "Jawab-e-Shikwa", "Khizr-e-Rah", "Tulu-e-Islam", 
  "Bal-e-Jibril", "Armaghan-e-Hijaz", "Asrar-e-Khudi", 
  "Rumuz-e-Bekhudi", "Payam-e-Mashriq", "Zabur-e-Ajam",
  
  // Common themes and keywords
  "love", "freedom", "self", "khudi", "nation", "religion", "philosophy",
  "spirituality", "humanity", "wisdom", "justice", "truth", "divine", "islam",
  
  // Common phrases
  "Khudi ko kar buland itna", "Sitaron se aage jahan", "Maqam-e-Ajdad",
  "Lab pe aati hai dua", "Saare jahan se acha", "Mazhab nahi sikhata"
];

/**
 * Detect the language of the input text
 * @param {string} text - Input text to analyze
 * @returns {string} - 'ur' for Urdu, 'en' for English, 'ro' for Roman Urdu
 */
function detectLanguage(text) {
  if (!text) return 'en';
  
  // Check for Urdu script (contains Urdu Unicode characters)
  if (/[\u0600-\u06FF]/.test(text)) return 'ur';
  
  // Check for Roman Urdu patterns
  const romanUrduPatterns = [
    /\b(hai|hain|ko|ka|ki|ke|se|main|mein|aur|ya|par)\b/i,
    /\b(dil|ishq|mohabbat|pyar|zindagi|khuda|khudi)\b/i,
    /\b(hum|tum|aap|woh|yeh|mera|tera|uska|hamara)\b/i
  ];
  
  for (const pattern of romanUrduPatterns) {
    if (pattern.test(text)) return 'ro';
  }
  
  // Default to English
  return 'en';
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const isCommonTermsRequest = searchParams.get('common') === 'true';
  const selectedFromSuggestions = searchParams.get('selected') === 'true';
  
  // If this is a search triggered by selecting a suggestion, return empty results
  // This will prevent the suggestions box from showing after selection
  if (selectedFromSuggestions) {
    return NextResponse.json({ 
      suggestions: [],
      detectedLanguage: detectLanguage(query),
      query,
      selectedFromSuggestions: true
    });
  }
  
  // Return common terms for empty search box suggestions
  if (isCommonTermsRequest) {
    const shuffledTerms = [...COMMON_TERMS].sort(() => 0.5 - Math.random());
    return NextResponse.json({ commonTerms: shuffledTerms.slice(0, 12) });
  }
  
  // Return empty response for very short queries
  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }
  
  // Detect language of query
  const detectedLanguage = detectLanguage(query);
  
  try {
    let suggestions = [];
    
    // 1. Search in book_contents using a hybrid approach (FTS with fallback)
    let poemResults;
    
    try {
      // Try FTS first
      const { data, error } = await supabase
        .from("book_contents")
        .select("id, title_en, title_ur, title_ro, book_id")
        .textSearch(
          'search_vector', 
          query, 
          { type: 'websearch' }
        )
        .limit(15);
      
      if (error) throw error;
      poemResults = data;
    } catch (ftsError) {
      console.warn("FTS search failed, falling back to ILIKE:", ftsError);
      
      // Fallback to ILIKE if FTS fails
      let fallbackQuery = supabase.from("book_contents").select("id, title_en, title_ur, title_ro, book_id");
      
      if (detectedLanguage === 'ur') {
        fallbackQuery = fallbackQuery.ilike('title_ur', `%${query}%`);
      } else if (detectedLanguage === 'en') {
        fallbackQuery = fallbackQuery.ilike('title_en', `%${query}%`);
      } else {
        fallbackQuery = fallbackQuery.or(`title_ro.ilike.%${query}%,title_en.ilike.%${query}%`);
      }
      
      const { data, error } = await fallbackQuery.limit(15);
      if (error) throw error;
      poemResults = data;
    }
    
    // Process poem results
    const poemSuggestions = (poemResults || [])
      .map(poem => {
        // Check match quality across all languages and pick the best one
        let bestMatch = null;
        let bestScore = -1;
        let bestLanguage = '';
        
        // Check English title
        if (poem.title_en) {
          const score = calculateMatchScore(poem.title_en, query);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = poem.title_en;
            bestLanguage = 'en';
          }
        }
        
        // Check Urdu title
        if (poem.title_ur) {
          const score = calculateMatchScore(poem.title_ur, query);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = poem.title_ur;
            bestLanguage = 'ur';
          }
        }
        
        // Check Roman Urdu title
        if (poem.title_ro) {
          const score = calculateMatchScore(poem.title_ro, query);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = poem.title_ro;
            bestLanguage = 'ro';
          }
        }
        
        // If no good match found, fall back to detected language
        if (bestMatch === null) {
          if (detectedLanguage === 'ur') {
            bestMatch = poem.title_ur || poem.title_ro || poem.title_en;
            bestLanguage = poem.title_ur ? 'ur' : (poem.title_ro ? 'ro' : 'en');
          } else if (detectedLanguage === 'en') {
            bestMatch = poem.title_en || poem.title_ro || poem.title_ur;
            bestLanguage = poem.title_en ? 'en' : (poem.title_ro ? 'ro' : 'ur');
          } else { // Roman Urdu
            bestMatch = poem.title_ro || poem.title_en || poem.title_ur;
            bestLanguage = poem.title_ro ? 'ro' : (poem.title_en ? 'en' : 'ur');
          }
        }
        
        return {
          text: bestMatch || '',
          type: 'poem',
          id: poem.id,
          book_id: poem.book_id,
          language: bestLanguage,
          matchScore: bestScore
        };
      })
      .filter(poem => poem.text) // Filter out empty titles
      .sort((a, b) => b.matchScore - a.matchScore) // Sort by match score
      .slice(0, 7);
    
    // 2. Search for content in stanzas using hybrid approach
    let stanzaResults;
    
    try {
      // Try FTS first
      const { data, error } = await supabase
        .from("stanzas")
        .select("id, content_en, content_ur, content_ro, poem_id")
        .textSearch(
          'search_vector', 
          query, 
          { type: 'websearch' }
        )
        .limit(15);
      
      if (error) throw error;
      stanzaResults = data;
    } catch (ftsError) {
      console.warn("FTS search for stanzas failed, falling back to ILIKE:", ftsError);
      
      // Fallback to ILIKE if FTS fails
      let fallbackQuery = supabase.from("stanzas").select("id, content_en, content_ur, content_ro, poem_id");
      
      if (detectedLanguage === 'ur') {
        fallbackQuery = fallbackQuery.ilike('content_ur', `%${query}%`);
      } else if (detectedLanguage === 'en') {
        fallbackQuery = fallbackQuery.ilike('content_en', `%${query}%`);
      } else {
        fallbackQuery = fallbackQuery.or(`content_ro.ilike.%${query}%,content_en.ilike.%${query}%`);
      }
      
      const { data, error } = await fallbackQuery.limit(15);
      if (error) throw error;
      stanzaResults = data;
    }
    
    // Process stanza results
    const contentSuggestions = (stanzaResults || [])
      .map(stanza => {
        // Check match quality across all languages and pick the best one
        let bestMatch = null;
        let bestScore = -1;
        let bestLanguage = '';
        
        // Check English content
        if (stanza.content_en) {
          const score = calculateMatchScore(stanza.content_en, query);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = stanza.content_en;
            bestLanguage = 'en';
          }
        }
        
        // Check Urdu content
        if (stanza.content_ur) {
          const score = calculateMatchScore(stanza.content_ur, query);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = stanza.content_ur;
            bestLanguage = 'ur';
          }
        }
        
        // Check Roman Urdu content
        if (stanza.content_ro) {
          const score = calculateMatchScore(stanza.content_ro, query);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = stanza.content_ro;
            bestLanguage = 'ro';
          }
        }
        
        // If no good match found, fall back to detected language
        if (bestMatch === null) {
          if (detectedLanguage === 'ur') {
            bestMatch = stanza.content_ur || stanza.content_ro || stanza.content_en;
            bestLanguage = stanza.content_ur ? 'ur' : (stanza.content_ro ? 'ro' : 'en');
          } else if (detectedLanguage === 'en') {
            bestMatch = stanza.content_en || stanza.content_ro || stanza.content_ur;
            bestLanguage = stanza.content_en ? 'en' : (stanza.content_ro ? 'ro' : 'ur');
          } else { // Roman Urdu
            bestMatch = stanza.content_ro || stanza.content_en || stanza.content_ur;
            bestLanguage = stanza.content_ro ? 'ro' : (stanza.content_en ? 'en' : 'ur');
          }
        }
        
        // Create preview
        const contentField = bestMatch || '';
        const contentPreview = contentField.split('|')[0].substring(0, 50) + 
                             (contentField.length > 50 ? '...' : '');
        
        return {
          text: contentPreview,
          type: 'content',
          id: stanza.id,
          poem_id: stanza.poem_id,
          language: bestLanguage,
          matchScore: bestScore
        };
      })
      .filter(content => content.text) // Filter out empty content
      .sort((a, b) => b.matchScore - a.matchScore) // Sort by match score
      .slice(0, 5);
    
    // Combine poem and content suggestions (no books)
    suggestions = [...poemSuggestions, ...contentSuggestions].slice(0, 10);
    
    // If no results, show default message
    if (suggestions.length === 0) {
      console.log(`No results found for query "${query}" with language "${detectedLanguage}"`);
      
      // Return empty array instead of book fallbacks
      suggestions = [];
    }
    
    return NextResponse.json({ 
      suggestions,
      detectedLanguage,
      query,
      selectedFromSuggestions: false
    });
    
  } catch (error) {
    console.error("Suggestions API error:", error);
    
    // Return error but no book fallbacks
    return NextResponse.json({ 
      suggestions: [],
      detectedLanguage: detectLanguage(query),
      query,
      error: "Search failed, no results available",
      selectedFromSuggestions: false
    });
  }
}

// Helper function to calculate match score 
// Simple implementation, you can make this more sophisticated
function calculateMatchScore(text, query) {
  if (!text || !query) return 0;
  
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  
  // Exact match
  if (normalizedText.includes(normalizedQuery)) {
    // Higher score for exact matches
    return 100 + (1000 / (normalizedText.length + 1)); // Slightly favor shorter texts
  }
  
  // Check for word matches
  const wordMatches = query.toLowerCase().split(/\s+/).filter(word => 
    word.length > 2 && normalizedText.includes(word.toLowerCase())
  ).length;
  
  if (wordMatches > 0) {
    return 50 + (wordMatches * 10);
  }
  
  // Character frequency matching as a last resort
  const queryChars = new Set(normalizedQuery.split(''));
  const textChars = new Set(normalizedText.split(''));
  const commonChars = [...queryChars].filter(char => textChars.has(char)).length;
  
  return commonChars * 5;
} 