"use client";

export const Spinner = ({ size = "md", className = "" }) => {
  // Size variants
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4"
  };

  const sizeClass = sizes[size] || sizes.md;
  
  return (
    <div className={`${sizeClass} ${className} rounded-full border-blue-500 dark:border-blue-400 border-t-transparent animate-spin`} 
      role="status" 
      aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
}; 