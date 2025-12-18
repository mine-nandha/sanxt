"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

/**
 * Theme Provider Component
 * Manages dark/light mode state globally
 */
export function ThemeProvider({ children }) {
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Apply theme class to body
	useEffect(() => {
		document.body.className = isDarkMode ? "dark" : "light";
	}, [isDarkMode]);

	const toggleTheme = () => {
		setIsDarkMode((prev) => !prev);
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

/**
 * Hook to access theme context
 * @returns {{isDarkMode: boolean, toggleTheme: () => void}}
 * @throws {Error} If used outside ThemeProvider
 */
export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
