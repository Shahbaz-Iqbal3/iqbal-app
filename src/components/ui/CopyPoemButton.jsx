// components/CopyButton.jsx
"use client";

import { useNotification } from "@/app/contexts/NotificationContext";
import { useState, useRef, useEffect } from "react";
import Tooltip from "../layout/Tooltip";

const CopyButton = ({ content }) => {
	const { addNotification } = useNotification();
	const [copied, setCopied] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const buttonRef = useRef(null);
	const timeoutRef = useRef(null);

	const copyFormats = [
		{ id: "urdu", label: "Urdu Only", fields: ["content_ur"] },
		{ id: "english", label: "English Only", fields: ["content_en"] },
		{ id: "roman", label: "Roman Only", fields: ["content_ro"] },
		{ id: "urdu_english", label: "Urdu + English", fields: ["content_ur", "content_en"] },
		{ id: "urdu_roman", label: "Urdu + Roman", fields: ["content_ur", "content_ro"] },
		{ id: "english_roman", label: "English + Roman", fields: ["content_en", "content_ro"] },
		{ id: "all", label: "All Versions", fields: ["content_ur", "content_en", "content_ro"] },
	];

	const formatText = (item, fields) => {
		return fields
			.map((field) => {
				// Handle both poem and stanza structures
				if (Array.isArray(content.stanzas)) {
					return (
						item[field]
							.split("|")
							.map((part) => part.trim())
							.join("\n") || ""
					);
				}
				return (
					content[field]
						.split("|")
						.map((part) => part.trim())
						.join("\n") || ""
				);
			})
			.filter(Boolean)
			.join("\n---\n");
	};

	const handleCopy = async (fields) => {
		try {
			let textToCopy;

			if (Array.isArray(content.stanzas)) {
				// Handle full poem (array of stanzas)
				textToCopy = content.stanzas
					.map((stanza) => formatText(stanza, fields))
					.filter(Boolean)
					.join("\n\n");
			} else {
				// Handle single field or stanza
				textToCopy = formatText(content, fields);
			}

			await navigator.clipboard.writeText(textToCopy);
			setShowOptions(false);
			setCopied(true);

			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Copy failed:", err);
		} finally {
			addNotification("Copied to clipboard", "success");
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (buttonRef.current && !buttonRef.current.contains(event.target)) {
				setShowOptions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<Tooltip content="Copy">
			<div
				onClick={() => setShowOptions(!showOptions)}
				className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
				aria-label="Copy options"
			>
				{copied ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="sm:size-6 size-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="sm:size-6 size-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
						/>
					</svg>
				)}
				{showOptions && (
					<div
						className="absolute left-0 z-20 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
						ref={buttonRef}
					>
						<div className="py-1" role="menu">
							{copyFormats.map((format) => (
								<div
									key={format.id}
									onClick={() => handleCopy(format.fields)}
									className="flex items-center justify-start gap-2  p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
									role="menuitem"
								>
									<div>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
											/>
										</svg>
									</div>
									<div>
										<span>{format.label}</span>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</Tooltip>
	);
};

export default CopyButton;
