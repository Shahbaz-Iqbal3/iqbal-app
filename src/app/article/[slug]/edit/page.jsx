import { notFound } from 'next/navigation';
import BlogPostEditor from '@/components/blog/BlogPostEditor'; // Adjust path as needed
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export default async function EditBlogPost({ params }) {
  const { slug } = await params;
  let post = null;

  // Fetch the post to edit
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/blog/${slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error("Failed to fetch post");
    }
    
    const data = await res.json();
    post = data.post || null;
  } catch (err) {
    console.error("Error loading post:", err);
  }

  if (!post) {
    notFound();
  }

  // Check if user has permission to edit this post
  // You might want to add authorization logic here
  // For example, check if the current user is the author or has admin rights
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return notFound();
  }
  

  return <BlogPostEditor initialPost={post} mode="edit" />;
}