"use client";

import { memo } from "react";
import styles from "./Notifications.module.css";
import { useNotification } from "@/app/contexts/NotificationContext";

const Notification = memo(({ id, message, type }) => {
	const { removeNotification } = useNotification();

	return (
		<div
			className={`${styles.notification} ${type ? styles[type] : ""} flex gap-2 font-sans text-primary bg-primary-dark  transition-colors duration-300`}
			onClick={() => removeNotification(id)}
		>
			<div className="text-primary" style={{ color: `var(--icon-color)` }}>
				{type === "success" ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-current"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="m9 12 2 2 4-4" />
					</svg>
				) : type === "error" ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-current"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="m15 9-6 6" />
						<path d="m9 9 6 6" />
					</svg>
				) : type === "info" ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-current"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="M12 16v-4" />
						<path d="M12 8h.01" />
					</svg>
				) : null}
			</div>
			<div className=" dark:text-gray-100">{message}</div>
		</div>
	);
});

export const Notifications = () => {
	const { notifications } = useNotification();

	return (
		<div className={`${styles.container} z-50`}>
			{notifications.map((notification) => (
				<Notification key={notification.id} {...notification} />
			))}
		</div>
	);
};
