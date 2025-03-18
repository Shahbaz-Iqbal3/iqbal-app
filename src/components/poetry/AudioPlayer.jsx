"use client";
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Repeat, Maximize2, Minimize2 } from "lucide-react";

const formatTime = (time) => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AudioPlayer = ({ audioSrc, isPlayed, onPlayStateChange }) => {
	const [isPlaying, setIsPlaying] = useState(isPlayed);
	const [showPlayer, setShowPlayer] = useState(false);
	const [volume, setVolume] = useState(() => {
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
	const [isExpanded, setIsExpanded] = useState(false);
	const [showVolumeSlider, setShowVolumeSlider] = useState(false);

	const audioRef = useRef(null);
	const progressBarRef = useRef(null);
	const volumeBarRef = useRef(null);
	const seekHandleRef = useRef(null);
	const isDraggingRef = useRef(false);

	useEffect(() => {
		setIsPlaying(isPlayed);
		togglePlay();
	}, [isPlayed]);

	const togglePlay = () => {
		onPlayStateChange(isPlaying);
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

	const calculateProgress = (clientX) => {
		if (!progressBarRef.current) return 0;
		const rect = progressBarRef.current.getBoundingClientRect();
		const position = clientX - rect.left;
		return Math.min(Math.max((position / rect.width) * 100, 0), 100);
	};

	const handleSeek = (e) => {
		if (!audioRef.current || !progressBarRef.current) return;
		
		const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
		const newProgress = calculateProgress(clientX);
		const newTime = (newProgress / 100) * duration;
		
		setProgress(newProgress);
		setCurrentTime(newTime);
		audioRef.current.currentTime = newTime;
	};

	const handleSeekStart = (e) => {
		e.preventDefault();
		isDraggingRef.current = true;
		setIsSeeking(true);
		handleSeek(e);
	};

	const handleSeekMove = (e) => {
		if (!isDraggingRef.current) return;
		e.preventDefault();
		handleSeek(e);
	};

	const handleSeekEnd = (e) => {
		if (!isDraggingRef.current) return;
		e.preventDefault();
		isDraggingRef.current = false;
		setIsSeeking(false);
		if (audioRef.current) {
			audioRef.current.currentTime = (progress / 100) * duration;
		}
	};

	// Add global event listeners for mouse/touch events
	useEffect(() => {
		const handleGlobalMouseMove = (e) => {
			if (isDraggingRef.current) {
				handleSeekMove(e);
			}
		};

		const handleGlobalMouseUp = (e) => {
			if (isDraggingRef.current) {
				handleSeekEnd(e);
			}
		};

		window.addEventListener('mousemove', handleGlobalMouseMove);
		window.addEventListener('mouseup', handleGlobalMouseUp);
		window.addEventListener('touchmove', handleGlobalMouseMove, { passive: false });
		window.addEventListener('touchend', handleGlobalMouseUp);

		return () => {
			window.removeEventListener('mousemove', handleGlobalMouseMove);
			window.removeEventListener('mouseup', handleGlobalMouseUp);
			window.removeEventListener('touchmove', handleGlobalMouseMove);
			window.removeEventListener('touchend', handleGlobalMouseUp);
		};
	}, [progress, duration]);

	const handleVolumeChange = (e) => {
		if (!audioRef.current || !volumeBarRef.current) return;
		const rect = volumeBarRef.current.getBoundingClientRect();
		const clickX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
		const newVolume = Math.min(Math.max((clickX - rect.left) / rect.width, 0), 1);
		audioRef.current.volume = newVolume;
		setVolume(newVolume);
		localStorage.setItem("audioVolume", newVolume);
	};

	const toggleVolume = () => {
		if (audioRef.current) {
			if (volume > 0) {
				localStorage.setItem("audioVolume", volume);
				audioRef.current.volume = 0;
				setVolume(0);
			} else {
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

	// Add this new useEffect for initial volume setup
	useEffect(() => {
		if (audioRef.current) {
			const savedVolume = localStorage.getItem("audioVolume");
			const initialVolume = savedVolume ? parseFloat(savedVolume) : 1;
			audioRef.current.volume = initialVolume;
			setVolume(initialVolume);
		}
	}, [audioRef.current]); // Only run when audio element is available

	return (
		<div className="p-4">
			{showPlayer && (
				isLoading ? (
					<div className="text-white">Loading audio...</div>
				) : (
					<div 
						className={`fixed bottom-0 left-0 w-full bg-gray-900 text-white transition-all duration-300 ease-in-out z-[500] ${
							isExpanded ? 'h-32' : 'h-20'
						}`}
					>
						<div className="p-4">
							<div className="flex items-center justify-between mb-2">
								<button 
									onClick={() => setIsExpanded(!isExpanded)}
									className="p-2 hover:bg-gray-800 rounded-full"
								>
									{isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
								</button>
								<div className="text-sm font-medium">
									{formatTime(currentTime)} / {formatTime(duration)}
								</div>
							</div>

							<div
								className="relative w-full h-1 bg-gray-700 rounded-full cursor-pointer touch-none select-none"
								ref={progressBarRef}
								onMouseDown={handleSeekStart}
								onTouchStart={handleSeekStart}
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
									<div
										ref={seekHandleRef}
										className="absolute top-[-4px] left-[calc(100%-6px)] w-3 h-3 bg-blue-500 rounded-full "
									></div>
								</div>
							</div>

							<div className="flex items-center justify-between mt-4">
								<div className="flex items-center space-x-4">
									<button 
										onClick={togglePlay} 
										className="p-2 hover:bg-gray-800 rounded-full transition-colors"
									>
										{isPlaying ? <Pause size={20} /> : <Play size={20} />}
									</button>
									<button
										onClick={toggleRepeat}
										className={`p-2 hover:bg-gray-800 rounded-full ${isRepeating ? "text-blue-500" : ""}`}
									>
										<Repeat size={20} />
									</button>
								</div>

								<div className="flex items-center space-x-2">
									<button 
										onClick={toggleVolume} 
										className="p-2 hover:bg-gray-800 rounded-full"
									>
										{volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
									</button>
									{isExpanded && (
										<div
											className="relative w-24 h-1 bg-gray-700 rounded-full cursor-pointer touch-none"
											ref={volumeBarRef}
											onMouseDown={handleVolumeStart}
											onMouseUp={handleVolumeEnd}
											onMouseMove={(e) => isAdjustingVolume && handleVolumeChange(e)}
											onClick={handleVolumeChange}
											onTouchStart={handleVolumeStart}
											onTouchMove={(e) => isAdjustingVolume && handleVolumeChange(e)}
											onTouchEnd={handleVolumeEnd}
										>
											<div
												className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full"
												style={{ width: `${volume * 100}%` }}
											>
												<div className="absolute top-[-4px] left-[calc(100%-6px)] w-3 h-3 bg-blue-500 rounded-full"></div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				)
			)}

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
