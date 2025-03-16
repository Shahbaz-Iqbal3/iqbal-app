// components/ConfirmationDialog.jsx
"use client";

import { useEffect, useRef, memo } from "react";

const ConfirmationDialog = memo(
	({
		isOpen,
		onConfirm,
		onCancel,
		title = "Are you sure?",
		message = "This action cannot be undone.",
		confirmText = "Confirm",
		cancelText = "Cancel",
	}) => {
		const dialogRef = useRef(null);

		useEffect(() => {
			const dialog = dialogRef.current;
			if (isOpen) {
				dialog.showModal();
				dialog.classList.add("open");
			} else {
				dialog.classList.remove("open");
				setTimeout(() => dialog.close(), 200); // Match transition duration
			}
		}, [isOpen]);

		const handleConfirm = () => {
			onConfirm();
			onCancel();
		};

		return (
			<dialog
				ref={dialogRef}
				className="fixed inset-0 z-50 bg-transparent backdrop:bg-black/50
                opacity-0 scale-95 transition-all duration-200
                [&.open]:opacity-100 [&.open]:scale-100"
				onCancel={onCancel}
			>
				<div className="bg-primary dark:bg-primary-dark rounded-lg p-6 max-w-md mx-4 shadow-xl text-primary-dark dark:text-primary">
					<h3 className="text-lg font-semibold ">{title}</h3>
					<p className="text-sm text-gray-400 mb-4">{message}</p>

					<div className="flex justify-end gap-3 mt-6">
						<button
							onClick={onCancel}
							className="px-4 py-2 text-white hover:text-gray-200 dark:hover:bg-gray-400 bg-gray-700 dark:bg-gray-500 rounded-lg transition-colors duration-200"
						>
							{cancelText}
						</button>
						<button
							onClick={handleConfirm}
							className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors duration-200"
						>
							{confirmText}
						</button>
					</div>
				</div>
			</dialog>
		);
	}
);

ConfirmationDialog.displayName = "ConfirmationDialog";
export default ConfirmationDialog;
