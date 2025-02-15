import React from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="w-10 h-10 flex items-center justify-center transition"
    >
      {isDarkMode ? (
        <SunIcon className="w-6 h-6 text-neutral-100" />
      ) : (
        <MoonIcon className="w-6 h-6 text-gray-800 dark:text-gray-100" />
      )}
    </button>
  );
}
