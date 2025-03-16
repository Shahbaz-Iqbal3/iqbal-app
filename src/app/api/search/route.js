import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
  // Extract search parameters
  const { searchParams } = new URL(req.url);
  // Support both "query" and "q" parameter names for compatibility
  const query = searchParams.get("query") || searchParams.get("q") || "";
  const contentType = searchParams.get("contentType"); // "poem", "stanza", "all"
  const language = searchParams.get("language"); // "en", "ur", "ro", "all"
  const bookId = searchParams.get("bookId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  
  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  if (!query || query.trim() === '') {
    return NextResponse.json({ 
      results: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
      filters: { availableBooks: [] }
    }, { status: 200 });
  }

  try {
    // Start building the query based on content type
    let results = [];
    let total = 0;

    // Helper function to add language-specific filters for FTS
    const addLanguageToFTSQuery = (baseQuery, lang) => {
      let ftsQuery = baseQuery;
      
      // Build language-specific search vector
      if (lang === "en") {
        ftsQuery += " & english";
      } else if (lang === "ur") {
        ftsQuery += " & urdu";
      } else if (lang === "ro") {
        ftsQuery += " & roman";
      }
      
      return ftsQuery;
    };

    // Handle poem search (using book_contents instead of poem_details)
    if (contentType === "poem") {
      // For poem search, we'll use FTS on book_contents
      let poemQuery = supabase.from("book_contents").select("*");
      let countQuery = supabase.from("book_contents").select("id", { count: "exact" });
      
      // Construct the FTS query
      let ftsQuery = query;
      if (language !== "all" && language) {
        ftsQuery = addLanguageToFTSQuery(query, language);
      }

      // Apply FTS search
      poemQuery = poemQuery.textSearch('search_vector', ftsQuery, {
        type: 'websearch',
        config: 'english'
      });
      
      countQuery = countQuery.textSearch('search_vector', ftsQuery, {
        type: 'websearch',
        config: 'english'
      });
      
      // Add book filter if specified
      if (bookId) {
        poemQuery = poemQuery.eq("book_id", bookId);
        countQuery = countQuery.eq("book_id", bookId);
      }
      
      // Apply pagination and ordering by relevance (ts_rank)
      poemQuery = poemQuery.range(offset, offset + limit - 1);
      
      // Execute queries
      const [poemResults, countResults] = await Promise.all([poemQuery, countQuery]);
      
      if (poemResults.error) throw poemResults.error;
      if (countResults.error) throw countResults.error;
      
      // Add type to each result
      results = poemResults.data.map(poem => ({
        ...poem,
        type: 'poem'
      }));
      total = countResults.count;
    } 
    // Handle stanza search
    else if (contentType === "stanza") {
      // For stanza search, we'll use FTS
      // First, get the poem_id from stanzas, then join with poem_details to get book info
      let stanzaQuery = supabase.from("stanzas").select("*, poem_details(book_id, title_en, title_ur)");
      let countQuery = supabase.from("stanzas").select("id", { count: "exact" });
      
      // Construct the FTS query
      let ftsQuery = query;
      if (language !== "all" && language) {
        ftsQuery = addLanguageToFTSQuery(query, language);
      }

      // Apply FTS search
      stanzaQuery = stanzaQuery.textSearch('search_vector', ftsQuery, {
        type: 'websearch',
        config: 'english'
      });
      
      countQuery = countQuery.textSearch('search_vector', ftsQuery, {
        type: 'websearch',
        config: 'english'
      });
      
      // Add book filter if specified - through poem_details
      if (bookId) {
        // First, filter poems by book_id to get poem_ids
        const { data: poemIds } = await supabase
          .from("poem_details")
          .select("id")
          .eq("book_id", bookId);
        
        if (poemIds && poemIds.length > 0) {
          // Then, filter stanzas by these poem_ids
          const ids = poemIds.map(p => p.id);
          stanzaQuery = stanzaQuery.in("poem_id", ids);
          countQuery = countQuery.in("poem_id", ids);
        }
      }
      
      // Apply pagination
      stanzaQuery = stanzaQuery.range(offset, offset + limit - 1);
      
      // Execute queries
      const [stanzaResults, countResults] = await Promise.all([stanzaQuery, countQuery]);
      
      if (stanzaResults.error) throw stanzaResults.error;
      if (countResults.error) throw countResults.error;
      
      // Add type to each result
      results = stanzaResults.data.map(stanza => ({
        ...stanza,
        type: 'stanza',
        // Add some extra fields to match expected structure
        book_id: stanza.poem_details?.book_id,
        title_en: stanza.poem_details?.title_en,
        title_ur: stanza.poem_details?.title_ur
      }));
      total = countResults.count;
    } 
    // Default: search both stanzas and book_contents with FTS
    else {
      // Search in both tables with full-text search
      let ftsQuery = query;
      
      // Add language filter if specified
      if (language !== "all" && language) {
        ftsQuery = addLanguageToFTSQuery(query, language);
      }
      
      // Search in book_contents (poems)
      let poemQuery = supabase.from("book_contents").select("*");
      let poemCountQuery = supabase.from("book_contents").select("id", { count: "exact" });
      
      // Apply FTS search to poems
      poemQuery = poemQuery.textSearch('search_vector', ftsQuery, {
        type: 'websearch',
        config: 'english'
      });
      
      poemCountQuery = poemCountQuery.textSearch('search_vector', ftsQuery, {
        type: 'websearch',
        config: 'english'
      });
      
      // Add book filter if specified for poems
      if (bookId) {
        poemQuery = poemQuery.eq("book_id", bookId);
        poemCountQuery = poemCountQuery.eq("book_id", bookId);
      }
      
      // Search in stanzas with proper relationships
      let stanzaQuery = supabase.from("stanzas").select("*, poem_details(book_id, title_en, title_ur)");
      let stanzaCountQuery = supabase.from("stanzas").select("id", { count: "exact" });
      
      // Apply FTS search to stanzas
      stanzaQuery = stanzaQuery.textSearch('search_vector', ftsQuery, {
        type: 'websearch',
        config: 'english'
      });
      
      stanzaCountQuery = stanzaCountQuery.textSearch('search_vector', ftsQuery, {
        type: 'websearch',
        config: 'english'
      });
      
      // Add book filter if specified for stanzas
      if (bookId) {
        // First, filter poems by book_id to get poem_ids
        const { data: poemIds } = await supabase
          .from("poem_details")
          .select("id")
          .eq("book_id", bookId);
        
        if (poemIds && poemIds.length > 0) {
          // Then, filter stanzas by these poem_ids
          const ids = poemIds.map(p => p.id);
          stanzaQuery = stanzaQuery.in("poem_id", ids);
          stanzaCountQuery = stanzaCountQuery.in("poem_id", ids);
        }
      }
      
      // Get the total counts for both types
      const [stanzaCountResult, poemCountResult] = await Promise.all([
        stanzaCountQuery,
        poemCountQuery
      ]);
      
      if (stanzaCountResult.error) throw stanzaCountResult.error;
      if (poemCountResult.error) throw poemCountResult.error;
      
      const stanzaCount = stanzaCountResult.count || 0;
      const poemCount = poemCountResult.count || 0;
      
      // Calculate the database total
      const dbTotal = stanzaCount + poemCount;
      
      // Set a reasonable fetch limit based on performance considerations
      const fetchLimit = 100;
      
      // Calculate how many items we'll actually fetch from each source
      const stanzaFetchLimit = Math.min(fetchLimit, stanzaCount);
      const poemFetchLimit = Math.min(fetchLimit, poemCount);
      
      // Step 1: Fetch results with reasonable limits
      const [stanzaResults, poemResults] = await Promise.all([
        stanzaQuery.limit(stanzaFetchLimit), 
        poemQuery.limit(poemFetchLimit)
      ]);
      
      if (stanzaResults.error) throw stanzaResults.error;
      if (poemResults.error) throw poemResults.error;
      
      // Add type to each result and combine
      const typedStanzaResults = stanzaResults.data.map(stanza => ({
        ...stanza,
        type: 'stanza',
        // Add some extra fields to match expected structure
        book_id: stanza.poem_details?.book_id,
        title_en: stanza.poem_details?.title_en,
        title_ur: stanza.poem_details?.title_ur
      }));
      
      const typedPoemResults = poemResults.data.map(poem => ({
        ...poem,
        type: 'poem'
      }));
      
      // Combine results
      const combinedResults = [
        ...typedStanzaResults,
        ...typedPoemResults
      ];
      
      // Sort by relevance score (if available) or add your custom sorting logic here
      // PostgreSQL ts_rank is not directly accessible, so we can approximate by keyword frequency
      const sortedResults = combinedResults.sort((a, b) => {
        // Count occurrences of query terms in content
        const aContent = ((a.content_en || '') + (a.content_ur || '') + (a.content_ro || '') + 
                          (a.title_en || '') + (a.title_ur || '') + (a.title_ro || '')).toLowerCase();
        const bContent = ((b.content_en || '') + (b.content_ur || '') + (b.content_ro || '') + 
                          (b.title_en || '') + (b.title_ur || '') + (b.title_ro || '')).toLowerCase();
        
        const queryTerms = query.toLowerCase().split(/\s+/);
        
        // Count matches
        const aMatches = queryTerms.reduce((count, term) => 
          count + (aContent.split(term).length - 1), 0);
        const bMatches = queryTerms.reduce((count, term) => 
          count + (bContent.split(term).length - 1), 0);
          
        // Sort by number of matches (descending)
        return bMatches - aMatches;
      });
      
      // Apply pagination to the sorted results
      const startIndex = offset;
      const endIndex = Math.min(startIndex + limit, sortedResults.length);
      results = sortedResults.slice(startIndex, endIndex);
      
      // Update total to reflect actual available results
      // This ensures pagination accurately reflects what's actually available
      total = Math.min(dbTotal, stanzaFetchLimit + poemFetchLimit);
      
      // Log information about the search results
   
    }

    // Get available books for filtering
    const { data: availableBooks, error: booksError } = await supabase
      .from("books")
      .select("id, title_en, title_ur");
      
    if (booksError) {
      console.error("Error fetching books:", booksError);
    }

    return NextResponse.json({
      results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
    }, { status: 200 });
    
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
