'use client';
import React from "react";
import clsx from "clsx";

interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const MainButton: React.FC<MainButtonProps> = ({ variant = "primary", className, ...props }) => {
  return (
    <button
      className={clsx(
        "px-10 py-4 rounded-lg shadow-md transition-all duration-300 font-semibold focus:ring-4 text-base sm:text-lg",
        variant === "primary"
          ? "bg-yellow-500 hover:bg-yellow-400 text-black focus:ring-yellow-300"
          : "bg-neutral-900 hover:bg-gray-800 text-yellow-400 focus:ring-gray-600",
        className
      )}
      {...props}
    />
  );
};

export default MainButton;