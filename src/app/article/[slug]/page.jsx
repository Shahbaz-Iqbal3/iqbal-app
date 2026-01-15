import { notFound } from "next/navigation";
import Link from "next/link";
import "./style.css"

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  let post = null;
  let latestPosts = [];

  // Fetch single post
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/blog/${slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch post");
    const data = await res.json();
    post = data.post || null;
  } catch (err) {
    console.error("Error loading post:", err);
  }

  // Fetch latest posts (excluding current one)
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/blog?status=published&limit=5`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      latestPosts = (data.posts || []).filter((p) => p.slug !== slug).slice(0, 5);
    }
  } catch (err) {
    console.error("Error fetching latest posts:", err);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-primary dark:bg-primary-dark text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-b from-quaternary dark:from-quaternary-dark to-transparent pt-16 pb-10">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className={`text-5xl md:text-4xl font-extrabold leading-tight mb-10 ${post.isRTL ? "font-nastaliq" : "font-poppins"}`} dir={post.isRTL ? "rtl" : "ltr"}>
            {post.title}
          </h1>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {post.author?.image && (
              <img
                src={post.author.image}
                alt={post.author.username}
                className="w-12 h-12 rounded-full border border-secondary dark:border-secondary-dark"
              />
            )}
            <div className="text-left">
              <p className="font-semibold">{post.author?.username || "Anonymous"}</p>
              <time className="text-xs">
                {new Date(post.created_at).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto md:max-w-4xl px-3">
        <article className="bg-white dark:bg-secondary-dark rounded-lg shadow-xl p-4">
          <div className={`prose-content rtl:font-nastaliq rtl:leading-10 font-poppins mx-5`} dir={post.isRTL ? "rtl" : "ltr"}>
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              "No content available."
            )}
          </div>
        </article>

        {/* Author Box */}
        {post.author && (
          <div className="mt-12 flex gap-6 items-center bg-quaternary dark:bg-quaternary-dark rounded-2xl shadow p-6">
            <img
              src={post.author.image}
              alt={post.author.username}
              className="w-16 h-16 rounded-full border border-secondary dark:border-secondary-dark"
            />
            <div>
              <h3 className="text-lg font-bold">{post.author.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {post.author.bio?.slice(0, 180) || "No bio available."}
              </p>
            </div>
          </div>
        )}

        {/* Latest Articles Section */}
        {latestPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {latestPosts.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="block bg-white dark:bg-secondary-dark rounded-md shadow hover:shadow-lg transition-opacity-transform p-6"
                >
                  <h3 className="text-lg font-semibold mb-2 rtl:font-nastaliq font-poppins" dir={article.isRTL? "rtl" : "ltr"}>{article.title}</h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Read More →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 flex justify-between items-center text-sm mb-4">
          <Link
            href="/article"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            ← Back to Articles
          </Link>
          
        </div>
      </div>
    </div>
  );
}
