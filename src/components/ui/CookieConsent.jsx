"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setShowConsent(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setShowConsent(false);
    };

    const declineCookies = () => {
        localStorage.setItem('cookieConsent', 'declined');
        setShowConsent(false);
    };

    if (!showConsent) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                    <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                        Learn more
                    </Link>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={declineCookies}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
} 