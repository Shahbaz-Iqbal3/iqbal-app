import React, { useEffect, useRef } from "react";
import Link from "next/link";

function LoginSuggestion({ onClose, message = "complete this action" }) {
  const wrapperRef = useRef(null);

  // Handle click outside and escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Focus management for accessibility
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.focus();
    }
  }, []);

  return (
    <div 
      ref={wrapperRef}
      role="dialog"
      aria-labelledby="login-heading"
      aria-describedby="login-description"
      className="absolute left-0  z-20 mt-2"
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-md p-4 mx-auto w-[240px]">
        <div className="flex items-center mb-3">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <h3 id="login-heading" className="text-lg font-semibold text-gray-800">
            Login Required
          </h3>
        </div>

        <p id="login-description" className="text-gray-600 mb-4">
          Please sign in or create an account to {message}.
        </p>

        <div className="flex justify-between gap-2">
          <Link
            href="/auth/login"
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex-1 text-center"
          >
            Sign In
          </Link>
          
        </div>
      </div>
    </div>
  );
}

export default LoginSuggestion;