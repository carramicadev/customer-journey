import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg"; // Optional size prop
  color?: string; // Optional color prop
}

const Loader: React.FC<LoaderProps> = ({ size = "md", color = "blue" }) => {
  // Determine the size of the loader
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  // Determine the color of the loader
  const colorClasses = {
    blue: "border-blue-500",
    red: "border-red-500",
    green: "border-green-500",
    purple: "border-purple-500",
    indigo: "border-indigo-500",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white ">
      <div
        className={`animate-spin rounded-full border-b-2 border-t-2 ${
          colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
        } ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md}`}
      ></div>
    </div>
  );
};

export default Loader;
