"use client";

import PasteButton from "@/components/pasteButton";
import { useTheme } from "@/lib/context/ThemeContext";

/**
 * SANXT Image Input Component
 * Handles SANXT image paste and triggers OCR
 */
export default function SanxtImageInput({ targetId, onInput }) {
	const { isDarkMode } = useTheme();

	return (
		<div>
			<div className="flex justify-between items-center mb-1">
				<label htmlFor={targetId} className="block text-sm font-medium">
					SANXT Image
				</label>
				<PasteButton targetId={targetId} />
			</div>
			<div
				id={targetId}
				contentEditable
				onInput={onInput}
				className={`mb-2 p-3 rounded-lg min-h-[100px] border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:shadow-glow ${
					isDarkMode
						? "bg-gray-800/50 text-white border-gray-600 hover:border-gray-500"
						: "bg-blue-50/50 text-gray-900 border-gray-300 hover:border-gray-400"
				}`}
			/>
		</div>
	);
}
