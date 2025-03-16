"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/Spinner";

const LoginPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check if user is already logged in
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            // Just redirect to check-profile which will handle the routing logic
            router.push('/auth/check-profile');
        }
    }, [session, status, router]);

    // Handle Google login
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Initiate Google sign-in
            await signIn("google", { 
                callbackUrl: "/auth/check-profile" // Temporary callback URL to handle redirection
            });
        } catch (error) {
            console.error("Login error:", error);
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800 dark:text-blue-400">Login</h2>
                
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <div className="flex flex-col items-center justify-center">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center transition-colors"
                    >
                        {loading ? (
                            <Spinner size="sm" className="border-white border-t-red-300" />
                        ) : (
                            <>
                                <FaGoogle className="mr-2" />
                                Login with Google
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
