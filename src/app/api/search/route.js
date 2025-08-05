import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || searchParams.get("q") || "";
  const bookId = searchParams.get("bookId");
  const contentType = searchParams.get("contentType");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  if (!query || query.trim() === '') {
    return NextResponse.json({
      results: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
      filters: { availableBooks: [] }
    }, { status: 200 });
  }

  try {
    // Call the enhanced_search RPC
    const { data, error } = await supabase.rpc('enhanced_search', {
      search_text: query,
      book_id_arg: bookId || null,
      content_type: contentType || null,
      limit_count: limit,
      offset_count: offset
    });
    if (error) throw error;
    // Optionally, you can fetch the total count with a separate count RPC or add it to the SQL function
    return NextResponse.json({
      results: data,
      pagination: {
        total: data.length > 0 ? data[0].total_count : 0,
        page,
        limit,
        totalPages: data.length > 0 ? Math.ceil(data[0].total_count / limit) : 0
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
