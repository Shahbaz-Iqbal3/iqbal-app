import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/blog - get all blog posts
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 9; // Posts per page
  const status = searchParams.get("status") || "published";
  const includeContent = searchParams.get("content") === "true";
  const includeAuthor = searchParams.get("author") === "true";

  // Base fields
  let selectFields = "id, title, slug, featureImage, created_at, status, author_id, isRTL, read_time";

  if (includeContent) {
    selectFields += ", content";
  }

  if (includeAuthor || true) { // Always include author info
    selectFields += ", author:author_id(id, name, image)";
  }

  // Build count query first
  let countQuery = supabase.from("posts").select("id", { count: "exact" });
  let dataQuery = supabase.from("posts").select(selectFields);

  if (status === "my-posts") {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    countQuery = countQuery.eq("author_id", session.user.id).eq("status", "published");
    dataQuery = dataQuery.eq("author_id", session.user.id).eq("status", "published");
  } else if (status === "my-drafts") {
    const session = await getServerSession(authOptions);
    if (session?.user?.role == "admin") {
      countQuery = countQuery.eq("status", "draft").eq("author_id", session.user.id);
      dataQuery = dataQuery.eq("status", "draft").eq("author_id", session.user.id);
    } else {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  } else {
   // published and draft (not rejected)
   countQuery = countQuery.eq("status", "published");
   dataQuery = dataQuery.eq("status", "published");
  }

  // Execute count query
  const { count, error: countError } = await countQuery;

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  // Execute data query with pagination
  const { data, error } = await dataQuery
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    posts: data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  });
}



// POST /api/blog - Create new blog post
export async function POST(request) {
  try {
    const json = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove HTML tags
    const stripHtml = (html) => {
      if (!html) return "";
      return html.replace(/<[^>]*>/g, " ");
    };

    const { title, content, slug, featureImageUrl, isRTL } = json;

    // Calculate read time
    const calculateReadTime = (content) => {
      if (!content) return 0;

      const text = stripHtml(content);

      // Count words (supports Urdu/Arabic/English mixed text)
      const words = text
        .trim()
        .split(/\s+/) // split on spaces
        .filter((word) => word.length > 0).length;

      return Math.ceil(words / 200); // avg 200 words/min
    };

    const readTime = calculateReadTime(content);

    // Validate required fields
    if (!title?.trim() || !content?.trim() || !slug?.trim()) {
      return NextResponse.json(
        { error: "Title, content, and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }

    // Insert the new post
    const { data, error } = await supabase
      .from("posts")
      .insert({
        author_id: session.user.id,
        title: title.trim(),
        content: content.trim(),
        slug: slug.trim(),
        featureImage: featureImageUrl,
        isRTL: isRTL || false,
        read_time: readTime, // ✅ Save read_time in DB
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create post" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      post: data,
      message: "Post created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
