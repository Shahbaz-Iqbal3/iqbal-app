// components/CommentsPopup.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CommentForm from "./CommentForm";
import Tooltip from "../layout/Tooltip";
import ConfirmationDialog from "./ConfirmationDialog";
import { X } from "lucide-react";
import { timeSince } from "@/utils/timeSince";
import { useNotification } from "@/app/contexts/NotificationContext";

const CommentsPopup = ({ poemId, stanzaId }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const { data: session } = useSession();

	const fetchComments = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				poem_id: poemId || "",
				stanza_id: stanzaId || "",
			}).toString();

			const res = await fetch(`/api/comments?${params}`);
			const data = await res.json();
			setComments(data);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) fetchComments();
	}, [isOpen]);

	return (
		<>
			<Tooltip content="Comments">
				<button
					onClick={() => setIsOpen(true)}
					className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="sm:size-6 size-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
						/>
					</svg>
				</button>
			</Tooltip>

			{isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-primary dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] h-[70vh] flex flex-col overflow-hidden">
						{/* Header */}
						<div className="flex justify-between items-center p-4 border-b dark:border-gray-600 border-gray-200">
							<h3 className="text-xl font-semibold dark:text-gray-300 text-gray-700 ">Comments</h3>
							<button
								onClick={() => setIsOpen(false)}
								className="p-2 text-gray-700 hover:text-gray-500 dark:hover:bg-gray-700  dark:text-gray-300 dark:hover:text-gray-300 rounded-full"
							>
								<X className="w-6 h-6 " />
							</button>
						</div>

						{/* Comments List */}
						<div className="flex-1 overflow-y-auto p-4">
							{loading ? (
								<div className="text-center text-gray-500">Loading comments...</div>
							) : comments.length === 0 ? (
								<div className="text-center text-gray-500">No comments yet</div>
							) : (
								comments.map((comment) => (
									<CommentItem
										key={comment.id}
										comment={comment}
										session={session}
										setComments={setComments}
										onDelete={(id) => {
											setComments((prev) => prev.filter((c) => c.id !== id));
										}}
									/>
								))
							)}
						</div>

						{/* Comment Form */}
						{session ? (
							<div className="p-4 border-t dark:border-gray-600 border-gray-200">
								<CommentForm
									poemId={poemId}
									stanzaId={stanzaId}
									onSuccess={(newComment) => {
										setComments((prev) => [newComment, ...prev]);
									}}
								/>
							</div>
						) : (
							<div className="p-4 border-t text-center text-gray-600">
								Please{" "}
								<a href="/login" className="text-blue-600 hover:underline">
									login
								</a>{" "}
								to comment
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

const CommentItem = ({ comment, session, setComments, onDelete }) => {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [showReplies, setShowReplies] = useState(false);
	const [replies, setReplies] = useState([]);
	const [showConfirm, setShowConfirm] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const { addNotification } = useNotification();

	const fetchReplies = async () => {
		try {
			const res = await fetch(`/api/comments?parent_id=${comment.id}`);
			const data = await res.json();
			setReplies(data);
		} catch (error) {
			console.error(error);
		}
	};
	const deleteComment = async (id) => {
		try {
			const res = await fetch(`/api/comments?id=${id}`, {
				// Fixed template literal
				method: "DELETE",
			});

			if (res.ok) {
				addNotification("Comment deleted successfully", "success");
				// Call onDelete to update parent's state
				if (onDelete) {
					onDelete(id);
				} else {
					// Fallback for top-level comments (if not using onDelete)
					setComments((prev) => prev.filter((c) => c.id !== id));
				}
			}
		} catch (error) {
			addNotification("Error deleting comment", "error");
			console.error(error);
		}
	};

	return (
		<div className="mb-4 ">
			<div className="flex items-start gap-3">
				<div className="flex-1 flex justify-between">
					<div className="flex items-start gap-2">
						<div>
							<Image
								src={comment.user?.image}
								width={30}
								height={30}
								className="rounded-full"
								alt={comment.user?.name}
							/>
						</div>
						<div>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2 mb-1">
									<span className="font-semibold text-gray-700 dark:text-gray-300">{comment.user?.name}</span>
									<span className="text-gray-700 dark:text-gray-400 text-xs">
										{timeSince(comment.created_at)}
									</span>
								</div>
							</div>
							<p className="text-gray-700 dark:text-gray-300">{comment.content}</p>

							<div className="space-x-2">
								{comment.replies_count[0].count > 0 && (
									<button
										onClick={() => {
											setShowReplies(!showReplies);
											if (!showReplies) fetchReplies();
										}}
										className="text-sm text-blue-500 dark:text-blue-300 hover:underline mt-1"
									>
										{!showReplies
											? comment.replies_count[0].count > 1
												? `veiw ${comment.replies_count[0].count} replies`
												: `view ${comment.replies_count[0].count} reply`
											: "Hide Replies"}
									</button>
								)}
								<button
									onClick={() => {
										setShowReplyForm(!showReplyForm);
									}}
									className="text-sm text-blue-500 dark:text-blue-300 hover:underline mt-1"
								>
									{showReplyForm ? "Cancel Reply" : "Reply"}
								</button>
							</div>
						</div>
					</div>
					{session && comment.user.id == session.user.id && (
						<button
							className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400"
							onClick={() => {
								setShowConfirm(true);
							}}
							disabled={isDeleting}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/>
							</svg>
						</button>
					)}
					<ConfirmationDialog
						isOpen={showConfirm}
						onConfirm={() => {
							setIsDeleting(true);
							deleteComment(comment.id);
						}}
						onCancel={() => setShowConfirm(false)}
						title="Are you sure to Delete comment?"
						message="This cannot be undone. All replies will also be deleted."
						confirmText={isDeleting ? "Deleting..." : "Delete"}
						cancelText="Cancel"
					/>
				</div>
			</div>

			{/* Replies */}
			{showReplyForm && (
				<div className="ml-6 mt-2">
					<CommentForm
						poemId={comment.poem_id}
						stanzaId={comment.stanza_id}
						parentId={comment.id}
						onSuccess={(reply) => {
							setReplies((prev) => [reply, ...prev]);
							setShowReplyForm(false);
							setShowReplies(true);
						}}
					/>
				</div>
			)}
			{showReplies && (
				<div className="ml-6 mt-2">
					{replies.map((reply) => (
						<div key={reply.id} className="mt-2   pl-4">
							<CommentItem
								comment={reply}
								session={session}
								setComments={setComments}
								onDelete={(id) => {
									setReplies((prev) => prev.filter((r) => r.id !== id));
								}}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CommentsPopup;
