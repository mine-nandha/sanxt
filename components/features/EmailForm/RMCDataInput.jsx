"use client";

import PasteButton from "@/components/pasteButton";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/lib/context/ThemeContext";

/**
 * RMC Data Input Component
 * Text area for pasting RMC mapping tool data
 */
export default function RMCDataInput({ onInput }) {
	const { isDarkMode } = useTheme();

	return (
		<div>
			<div className="flex justify-between items-center mb-1">
				<label htmlFor="rmc-data" className="block text-sm font-medium mb-1">
					RMC Mapping Tool Data
				</label>
				<PasteButton targetId="rmc-data" />
			</div>
			<Textarea
				id="rmc-data"
				onInput={onInput}
				rows={5}
				placeholder="Paste RMC Mapping Tool Data here"
				className={
					isDarkMode
						? "bg-gray-800/50 text-white border-gray-600 hover:border-gray-500"
						: "bg-blue-50/50 text-gray-900 border-gray-300 hover:border-gray-400"
				}
			/>
		</div>
	);
}
