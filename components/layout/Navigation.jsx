"use client";

import ThemeToggle from "./ThemeToggle";

/**
 * Main navigation bar component
 * Displays app title and theme toggle
 */
export default function Navigation() {
	return (
		<nav className="bg-gradient-primary p-4 flex justify-between items-center shadow-colored sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
			<h1 className="text-2xl font-bold text-white drop-shadow-lg animate-fade-in">
				SANXT
			</h1>
			<ThemeToggle />
		</nav>
	);
}
