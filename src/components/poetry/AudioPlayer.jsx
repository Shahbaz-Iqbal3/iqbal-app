"use client";
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Repeat } from "lucide-react";

const formatTime = (time) => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AudioPlayer = ({ audioSrc, isPlayed, onPlayStateChange }) => {

	const [isPlaying, setIsPlaying] = useState(isPlayed);
	const [showPlayer, setShowPlayer] = useState(false);
	const [volume, setVolume] = useState(() => {
		// Initialize volume from localStorage
		if (typeof window !== "undefined") {
			const savedVolume = localStorage.getItem("audioVolume");
			return savedVolume ? parseFloat(savedVolume) : 1;
		}
		return 1;
	});
	const [progress, setProgress] = useState(0);
	const [buffered, setBuffered] = useState(0);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isSeeking, setIsSeeking] = useState(false);
	const [isAdjustingVolume, setIsAdjustingVolume] = useState(false);
	const [isRepeating, setIsRepeating] = useState(false);

	const audioRef = useRef(null);
	const progressBarRef = useRef(null);
	const volumeBarRef = useRef(null);

	useEffect(() => {
		setIsPlaying(isPlayed);
		togglePlay();
	}, [isPlayed]);

	const togglePlay = () => {
		onPlayStateChange(isPlaying); // Send new state to parent

		if (!audioRef.current) return;
		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
			setShowPlayer(true);
		}
	};

	const toggleRepeat = () => {
		setIsRepeating((prev) => !prev);
		if (audioRef.current) {
			audioRef.current.loop = !isRepeating;
		}
	};

	const handleSeek = (e) => {
		if (!audioRef.current || !progressBarRef.current) return;
		const rect = progressBarRef.current.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const newProgress = (clickX / rect.width) * 100;
		const newTime = (newProgress / 100) * duration;
		setProgress(newProgress);
		setCurrentTime(newTime);
		if (!isSeeking) {
			audioRef.current.currentTime = newTime;
		}
	};

	const handleSeekStart = () => setIsSeeking(true);
	const handleSeekEnd = () => {
		setIsSeeking(false);
		if (audioRef.current) {
			audioRef.current.currentTime = (progress / 100) * duration;
		}
	};

	const handleVolumeChange = (e) => {
		if (!audioRef.current || !volumeBarRef.current) return;
		const rect = volumeBarRef.current.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const newVolume = Math.min(Math.max(clickX / rect.width, 0), 1);

		audioRef.current.volume = newVolume;
		setVolume(newVolume);
		// Save volume to localStorage
		localStorage.setItem("audioVolume", newVolume);
	};
	const toggleVolume = () => {
		if (audioRef.current) {
			if (volume > 0) {
				// Store current volume before muting
				localStorage.setItem("audioVolume", volume);
				audioRef.current.volume = 0;
				setVolume(0);
			} else {
				// Retrieve stored volume or use default 1
				const savedVolume = parseFloat(localStorage.getItem("audioVolume")) || 1;
				audioRef.current.volume = savedVolume;
				setVolume(savedVolume);
			}
		}
	};

	const handleVolumeStart = () => setIsAdjustingVolume(true);
	const handleVolumeEnd = () => setIsAdjustingVolume(false);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => {
			if (!isSeeking && audio.duration) {
				setProgress((audio.currentTime / audio.duration) * 100);
				setCurrentTime(audio.currentTime);
			}
		};

		const onLoadedMetadata = () => {
			setDuration(audio.duration);
			setIsLoading(false);
		};

		const onProgress = () => {
			if (audio.buffered.length > 0) {
				const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
				setBuffered((bufferedEnd / audio.duration) * 100);
			}
		};

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", onLoadedMetadata);
		audio.addEventListener("progress", onProgress);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", onLoadedMetadata);
			audio.removeEventListener("progress", onProgress);
		};
	}, [isSeeking]);

	return (
		<div className="p-4">
			{showPlayer &&
				(isLoading ? (
					<div className="text-white">Loading audio...</div>
				) : (
					<div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex items-center space-x-4 z-[500]">
						<button onClick={togglePlay} className="p-2">
							{isPlaying ? <Pause size={24} /> : <Play size={24} />}
						</button>
						<div className="flex w-full items-center justify-center gap-2">
							<span className="text-sm">{formatTime(currentTime)}</span>

							<div
								className="relative w-full h-1 bg-gray-700 rounded-full cursor-pointer"
								ref={progressBarRef}
								onMouseDown={handleSeekStart}
								onMouseUp={handleSeekEnd}
								onMouseMove={(e) => isSeeking && handleSeek(e)}
								onClick={handleSeek}
							>
								<div
									className="absolute top-0 left-0 h-1 bg-gray-500 rounded-full"
									style={{ width: `${buffered}%` }}
								></div>
								<div
									className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full"
									style={{ width: `${progress}%` }}
								>
									<div className="absolute top-[-4px] left-[calc(100%-6px)] w-3 h-3 bg-blue-500 rounded-full"></div>
								</div>
							</div>

							<span className="text-sm">{formatTime(duration)}</span>
						</div>

						<button onClick={toggleVolume} className="p-2">
							{volume > 0 ? <Volume2 size={24} /> : <VolumeX size={24} />}
						</button>

						<div
							className="relative w-24 h-1 bg-gray-700 rounded-full cursor-pointer"
							ref={volumeBarRef}
							onMouseDown={handleVolumeStart}
							onMouseUp={handleVolumeEnd}
							onMouseMove={(e) => isAdjustingVolume && handleVolumeChange(e)}
							onClick={handleVolumeChange}
						>
							<div
								className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full"
								style={{ width: `${volume * 100}%` }}
							>
								<div className="absolute top-[-4px] left-[calc(100%-6px)] w-3 h-3 bg-blue-500  rounded-full"></div>
							</div>
						</div>
						<button
							onClick={toggleRepeat}
							className={`p-2 ${isRepeating ? "text-blue-500" : ""}`}
						>
							<Repeat size={24} />
						</button>
					</div>
				))}

			<audio
				ref={audioRef}
				src={audioSrc}
				onEnded={() => {
					setProgress(0);
					setCurrentTime(0);
					onPlayStateChange(true);
				}}
				className="hidden"
			/>
		</div>
	);
};

export default AudioPlayer;
