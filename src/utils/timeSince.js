export function timeSince(date) {
	const now = new Date();
	const past = new Date(date);

	if (isNaN(past)) return "Invalid date";

	const secondsElapsed = Math.floor((now - past) / 1000);

	const intervals = [
		{ unit: "year", seconds: 31536000 },
		{ unit: "month", seconds: 2592000 },
		{ unit: "day", seconds: 86400 },
		{ unit: "hour", seconds: 3600 },
		{ unit: "minute", seconds: 60 },
	];

	for (const interval of intervals) {
		const count = Math.floor(secondsElapsed / interval.seconds);
		if (count >= 1) {
			return count === 1 ? `1 ${interval.unit} ago` : `${count} ${interval.unit}s ago`;
		}
	}

	return "just now";
}
