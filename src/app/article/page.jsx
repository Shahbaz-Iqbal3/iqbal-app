"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// Main Blog Management Component
export default function BlogManagement() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('published');
  const [loading, setLoading] = useState(status === 'loading');
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, post: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(7); // Posts per page
  const user = session?.user;
  const isAdmin = user?.role === 'admin';
  const currentUserId = user?.id;

  // Fetch posts on mount and when filters change
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/blog?status=${statusFilter}&content=false&author=true&page=${currentPage}&limit=${limit}`
        );
        const data = await res.json();
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [statusFilter, currentPage, limit]);

  // Filter posts based on active tab and filters
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [posts, sortOrder]);

  const handleDelete = async (postId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId })
      });

      if (!response.ok) throw new Error('Failed to delete post');

      setPosts(prev => prev.filter(p => p.id !== postId));
      setDeleteModal({ show: false, post: null });
    } catch (error) {
      console.error('Error deleting post:', error);
      // TODO: Show error notification
    } finally {
      setActionLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header Section */}
        <div className="gradient-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 dark:text-white text-gray-900">Explore the Articles</h1>
                <p className="dark:text-white text-gray-700">Create and manage your blog content</p>
              </div>

              {/* CTA Button */}
              <button
                className=" bg-gradient-to-tl from-blue-400 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => router.push('/article/new')}
                aria-label="Write a new post"
              >
                <PlusIcon />
                Write a Post
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          {/* Tabs Navigation */}
          <div className="border-gray-200 dark:border-gray-800 border rounded-xl shadow-lg mb-8 overflow-hidden">

            {/* Filters */}
            <div className="p-6 flex items-end gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-0">
                  <label className="block text-sm font-medium dark:text-gray-100 text-gray-900 mb-2">Sort By</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none dark:bg-gray-800 dark:text-gray-100 text-gray-800"

                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
                {currentUserId && <div className="flex-0">
                  <label className="block text-sm font-medium dark:text-gray-100 text-gray-900 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none dark:bg-gray-800 dark:text-gray-100 text-gray-800"

                  >
                    <option value="published">All Published</option>
                    {currentUserId && <option value="my-posts">My Publications</option>}
                    {currentUserId && <option value="my-drafts">My Drafts</option>}
                  </select>
                </div>}
              </div>
              {actionLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            </div>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <LoadingSkeleton />
          ) : filteredPosts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    showActions={ post.author_id === currentUserId}
                    onEdit={() => router.push()}
                    onDelete={() => setDeleteModal({ show: true, post })}
                  />
                ))}
              </div>

              {/* Add Pagination component */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

      </div>
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <DeleteModal
          post={deleteModal.post}
          onConfirm={() => handleDelete(deleteModal.post.id)}
          onCancel={() => setDeleteModal({ show: false, post: null })}
        />
      )}
    </>
  );
}


// Post Card Component

function PostCard({ post, showActions, onDelete }) {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });


  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden card-hover group" >
      {/* Feature Image */}
      <div className="aspect-video overflow-hidden bg-gray-100">
        <img
          src={post.featureImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="p-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-3">
          {/* Read Time */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 `}>
            {`${post.read_time} min read`}
          </span>

          {/* Date */}
          <div className="flex items-center text-gray-500 text-sm">
            <CalendarIcon />
            <span className="ml-1">{formattedDate}</span>
          </div>
        </div>

        {/* Title */}
        <a href={`/article/${post.slug}`} className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 hover:underline transition-colors" dir={post.isRTL ? 'rtl' : 'ltr'}>
          {post.title}
        </a>



        {/* Author */}
        <div className="flex items-center">
          <img
            src={post?.author?.image}
            alt={post.author?.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-700">{post.author?.name}</span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <a
              href={`/article/${post.slug}/edit`}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium border border-gray-100"
              aria-label="Edit post"
            >
              <EditIcon />
              Edit Post
            </a>
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
              aria-label="Delete post"
            >
              <TrashIcon />
              Delete Post
            </button>
          </div>
        )}

       
      </div>
    </article>
  );
}

// Delete Confirmation Modal
function DeleteModal({ post, onConfirm, onCancel }) {
  // Add useEffect to handle body scroll
  useEffect(() => {
    // Disable scrolling on body when modal is open
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when modal is closed
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-2xl transition-all max-w-md w-full">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Delete Post</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "<span className="font-medium">{post?.title}</span>"?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Feature image skeleton */}
          <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

          <div className="p-6 space-y-3">
            {/* Badge */}
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            {/* Title */}
            <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            {/* Excerpt */}
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

            {/* Author row */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty State Component
function EmptyState() {

  return (
    <div className="text-center py-16 flex flex-col items-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-100 mb-2">No posts found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        No content available.
      </p>
      <button
        className=" bg-gradient-to-tl from-blue-400 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        onClick={() => router.push('/article/new')}
      >
        <PlusIcon />
        Write Your First Post
      </button>
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show max 5 page numbers
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;

    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage > totalPages - 3) return pages.slice(totalPages - 5);

    return pages.slice(currentPage - 3, currentPage + 2);
  };

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
      >
        Previous
      </button>

      {getVisiblePages().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg ${currentPage === page
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}