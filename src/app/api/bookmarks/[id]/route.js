import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    
    
    if (!id) {
      return NextResponse.json({ error: "Bookmark ID is required" }, { status: 400 });
    }
    
    // Verify bookmark belongs to user
    const { data: bookmark, error: fetchError } = await supabase
      .from('bookmarks')
      .select('id, user_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch bookmark" }, { status: 500 });
    }
    
    if (!bookmark || bookmark.user_id !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to delete this bookmark" }, { status: 403 });
    }
    
    // Delete the bookmark
    const { error: deleteError } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 