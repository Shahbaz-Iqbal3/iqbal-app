import React from "react";
import Tooltip from "../layout/Tooltip";

function PlayButton({ isPlaying, setIsPlaying , disabled }) {
	return (
		<Tooltip content={disabled ? "No audio available" : isPlaying? "Play" : "Pause"}>
		<button
			className=" p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
			onClick={() => {
				setIsPlaying(!isPlaying);
			}}
			disabled={disabled}
		>
			{disabled || isPlaying ? (
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
						d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
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
						d="M15.75 5.25v13.5m-7.5-13.5v13.5"
					/>
				</svg>
			)}
		</button></Tooltip>
	);
}

export default PlayButton;
