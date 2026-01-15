import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/blog/[id] - Get single blog post
export async function GET(request, { params }) {

  const { slug } = await params;
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:author_id(*)')
    .eq('slug', slug)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data });
}

// PUT /api/blog/[slug] - Update blog post
export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

    // Ensure post exists and belongs to author
    const { data: post, error: findError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", slug)
      .single();

    if (findError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.author_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update post and set status back to pending
    const { data, error } = await supabase
      .from("posts")
      .update({
        title: body.title,
        content: body.content,
        featureImage: body.featureImage || post.featureImage,
        isRTL: body.isRTL ?? false,
        status: "published",
        updated_at: new Date(),
      })
      .eq("id", post.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Post updated successfully",
      post: data,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// DELETE /api/blog/[slug] - Delete blog post
export async function DELETE(request) {
  const json = await request.json();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  // Ensure post exists and belongs to author
  const { data: post, error: findError } = await supabase
    .from('posts')
    .select('id, author_id')
    .eq('id', json.id)
    .single();

  if (findError || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  if (post.author_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Delete the post
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', json.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
