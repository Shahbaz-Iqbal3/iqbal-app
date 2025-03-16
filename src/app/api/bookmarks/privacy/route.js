import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Parse request body
    const { bookmarkId, isPublic } = await req.json();
    
    if (!bookmarkId) {
      return NextResponse.json({ error: "Bookmark ID is required" }, { status: 400 });
    }
    
    // Verify bookmark belongs to user
    const { data: bookmark, error: fetchError } = await supabase
      .from('bookmarks')
      .select('id, user_id')
      .eq('id', bookmarkId)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch bookmark" }, { status: 500 });
    }
    
    if (!bookmark || bookmark.user_id !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to modify this bookmark" }, { status: 403 });
    }
    
    // Update bookmark privacy
    const { error: updateError } = await supabase
      .from('bookmarks')
      .update({ is_public: isPublic })
      .eq('id', bookmarkId);
    
    if (updateError) {
      return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, isPublic });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 