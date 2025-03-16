"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

const CommentForm = ({ poemId, stanzaId, parentId, onSuccess }) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [rows, setRows] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setContent(newValue);
    // Calculate the number of lines by splitting at newlines.
    // Ensure at least 1 row and at most 3 rows.
    const lineCount = newValue.split("\n").length;
    setRows(Math.min(Math.max(lineCount, 1), 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          poem_id: poemId,
          stanza_id: stanzaId,
          parent_id: parentId,
          user_id: session.user.id,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        onSuccess(newComment);
        setContent("");
        setRows(1);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return <div>Please Login to Comment</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center gap-2 relative h-10">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Write your comment..."
          className="w-11/12 p-2 border rounded-lg text-gray-800 dark:text-gray-200 outline-none bg-gray-200 dark:bg-gray-700 border-none hidden-scrollbar absolute bottom-0 left-0 right-0"
          rows={rows}
          maxLength="500"
        />
        <div className="mt-2 flex justify-end gap-2 absolute bottom-0 right-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-12 h-10  bg-[#3b4247] text-white flex items-center justify-center rounded-lg hover:bg-[#262b30] disabled:opacity-50"
          >
            {isSubmitting ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide spin lucide-loader-circle" ><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg>}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
