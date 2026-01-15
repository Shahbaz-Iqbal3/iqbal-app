import React from "react";
import { cn } from "@/utils/cn";

export function Button({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
