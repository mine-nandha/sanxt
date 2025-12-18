"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Customer count input with ×0.75 conversion button
 */
export default function CustomerCountInput({
	value,
	onChange,
	isConverted,
	onConvert,
	isDarkMode,
}) {
	return (
		<div>
			<label
				htmlFor="customer-count"
				className="block text-sm font-medium mb-1"
			>
				Customer Count
			</label>
			<div className="flex gap-2">
				<Input
					name="customer-count"
					type="number"
					value={value}
					onChange={(e) => onChange(Number.parseInt(e.target.value, 10) || 0)}
					className={
						isDarkMode
							? "bg-gray-800/50 text-white border-gray-600 hover:border-gray-500"
							: "bg-blue-50/50 text-gray-900 border-gray-300 hover:border-gray-400"
					}
				/>
				<Button
					variant="outline"
					onClick={() => onConvert(Math.round(value * 0.75))}
					className="whitespace-nowrap"
					disabled={isConverted}
				>
					× 0.75
				</Button>
			</div>
		</div>
	);
}
