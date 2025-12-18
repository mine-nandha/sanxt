"use client";

import PasteButton from "@/components/pasteButton";
import { useTheme } from "@/lib/context/ThemeContext";

/**
 * ESB Input Component
 * Handles ESB image and checkbox for ESB outage status
 */
export default function ESBInput({
	targetId,
	onInput,
	isChecked,
	onCheckChange,
}) {
	const { isDarkMode } = useTheme();

	return (
		<div>
			<div className="flex justify-between items-center mb-1">
				<label htmlFor={targetId} className="block text-sm font-medium">
					ESB Image
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
			<label className="flex items-center cursor-pointer select-none">
				<input
					className="scale-125 mx-2 cursor-pointer accent-pink-500"
					type="checkbox"
					name="esbfound"
					checked={isChecked}
					onChange={(e) => onCheckChange(e.target.checked)}
				/>
				ESB Outage Found
			</label>
		</div>
	);
}
