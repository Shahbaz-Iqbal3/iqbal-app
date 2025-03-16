"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function CheckProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for session to be loaded
    if (status === "loading") return;

    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    // If authenticated, check profile
    if (status === "authenticated" && session?.user) {
      checkUserProfile(session.user);
    }
  }, [session, status, router]);

  // Function to check if user profile is complete and redirect accordingly
  const checkUserProfile = async (user) => {
    try {
      if (!user.email) {
        throw new Error("User email is missing");
      }
      
      // For new users, we need to look them up by email since username is null
      // Use query parameter 'email' to look up user
      // Request only basic profile data for performance - we only need to check username
      const response = await fetch(`/api/profile?email=${encodeURIComponent(user.email)}&basic=true`);
      
      if (response.ok) {
        const userData = await response.json();
        console.log("User data from profile check:", userData);
        
        // More strict check for username - it must be explicitly set and not empty
        const isProfileComplete = userData && 
          userData.username !== null && 
          userData.username !== undefined && 
          userData.username !== "";
        
        // Log the result for debugging
        console.log("Is profile complete:", isProfileComplete);
        
        // Redirect based on profile completeness
        if (isProfileComplete) {
          router.push('/'); // Redirect to home if profile is complete
        } else {
          router.push('/user/profile-builder'); // Redirect to profile builder if incomplete
        }
      } else {
        // If user not found, redirect to profile builder
        console.log("User not found in profile API");
        router.push('/user/profile-builder');
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      setError("Failed to check profile status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        {error ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Error</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/auth/login')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <Spinner size="lg" className="dark:border-gray-300 dark:border-t-gray-800" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Checking your profile...</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Please wait while we redirect you.</p>
          </>
        )}
      </div>
    </div>
  );
} 