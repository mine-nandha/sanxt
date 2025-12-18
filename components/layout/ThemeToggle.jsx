"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/context/ThemeContext";

/**
 * Theme toggle button component
 * Switches between dark and light mode
 */
export default function ThemeToggle() {
	const { isDarkMode, toggleTheme } = useTheme();

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 backdrop-blur-sm"
			aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
		>
			<div className="transition-transform duration-300">
				{isDarkMode ? (
					<Sun className="h-[1.2rem] w-[1.2rem]" />
				) : (
					<Moon className="h-[1.2rem] w-[1.2rem]" />
				)}
			</div>
		</Button>
	);
}
