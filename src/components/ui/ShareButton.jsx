// components/ShareButton.jsx
"use client";

import { useNotification } from "@/app/contexts/NotificationContext";
import { useState, useRef, useEffect } from "react";
import Tooltip from "../layout/Tooltip";
import { FaFacebook, FaWhatsapp, FaTwitter, FaLink } from "react-icons/fa";

const ShareButton = ({ book, poem, stanzaId, shareText }) => {
	const { addNotification } = useNotification();
	const [showOptions, setShowOptions] = useState(false);
	const buttonRef = useRef(null);
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

	const getShareData = () => {
		const poemSlug = poem.toLowerCase().replace(/ /g, "-");

		// Construct production URLs
		const poemUrl = `${baseUrl}/books/${book}/${poemSlug}`;
		const stanzaUrl = stanzaId ? `${poemUrl}#stanza-${stanzaId}` : poemUrl;

		// Prepare share text
		const defaultText = `Read "${poem}" by Allama Iqbal`;
		const stanzaText = stanzaId ? `${shareText}\n\nFrom "${poem}" written in "${book}"\n` : "";

		return {
			url: stanzaUrl,
			text: stanzaId ? stanzaText : defaultText,
		};
	};

	const shareOptions = [
		{
			name: "WhatsApp",
			icon: <FaWhatsapp />,
			action: () => {
				const { url, text } = getShareData();
				window.open(
					`https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n\n${url}`)}`,
					"_blank"
				);
			},
		},
		{
			name: "Facebook",
			icon: <FaFacebook />,
			action: () => {
				const { url } = getShareData();
				window.open(
					`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
					"_blank"
				);
			},
		},
		{
			name: "Twitter",
			icon: <FaTwitter />,
			action: () => {
				const { url, text } = getShareData();
				window.open(
					`https://twitter.com/intent/tweet?text=${encodeURIComponent(
						text
					)}&url=${encodeURIComponent(url)}`,
					"_blank"
				);
			},
		},
		{
			name: "Copy Link",
			icon: <FaLink />,
			action: async () => {
				try {
					const { url } = getShareData();
					await navigator.clipboard.writeText(url);
					addNotification("Link copied to clipboard!", "success");
				} catch (err) {
					addNotification("Failed to copy link", "error");
					console.error("Copy failed:", err);
				}
			},
		},
	];

	// Click outside handler
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
		<>
			<Tooltip content="Share">
				<div
					onClick={() => setShowOptions(!showOptions)}
					className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
					aria-label="Share options"
				>
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
							d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
						/>
					</svg>

					{showOptions && (
						<div
							className="absolute left-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
							ref={buttonRef}
						>
							<div className="py-1" role="menu">
								{shareOptions.map((option) => (
									<button
										key={option.name}
										onClick={() => {
											option.action();
											setShowOptions(false);
										}}
										className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  transition-colors"
										role="menuitem"
									>
										<span className="mr-2 text-lg">{option.icon}</span>
										<span>{option.name}</span>
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</Tooltip>
		</>
	);
};

export default ShareButton;
