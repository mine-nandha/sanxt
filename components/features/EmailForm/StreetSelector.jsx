"use client";

import { useTheme } from "@/lib/context/ThemeContext";

/**
 * Street Selector Component
 * Displays checkboxes for extracted street names
 */
export default function StreetSelector({ streets, onSelectionChange }) {
	const { isDarkMode } = useTheme();

	if (!streets || streets.length === 0) {
		return <div>No addresses found</div>;
	}

	return (
		<div
			id="streets"
			className="flex flex-wrap gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-fade-in"
		>
			{streets.map((street) => (
				<label
					key={street}
					className={`flex items-center px-3 py-2 cursor-pointer select-none rounded-md transition-all duration-200 hover:scale-105 ${
						isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
					}`}
				>
					<input
						className="scale-125 mx-2 cursor-pointer accent-pink-500"
						type="checkbox"
						name="streets"
						value={street}
						onClick={onSelectionChange}
					/>
					{street}
				</label>
			))}
		</div>
	);
}
