"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CopyButton({ className = "" }) {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			const htmlContent = document.querySelector("#mailContent").innerHTML;
			const blob = new Blob([htmlContent], { type: "text/html" });
			const clipboardItem = new ClipboardItem({ "text/html": blob });
			await navigator.clipboard.write([clipboardItem]);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
			console.log("Content copied with images!");
		} catch (error) {
			console.error("Failed to copy content:", error);
		}
	};

	return (
		<Button
			variant="outline"
			size="icon"
			className={`${className} transition-all duration-200 hover:scale-110 active:scale-95 ${isCopied ? "bg-green-100 dark:bg-green-900 animate-pulse-glow" : ""}`}
			onClick={copyToClipboard}
			aria-label={isCopied ? "Copied" : "Copy to clipboard"}
		>
			<div className="transition-transform duration-200">
				{isCopied ? (
					<Check className="h-4 w-4 text-green-600 dark:text-green-400" />
				) : (
					<Copy className="h-4 w-4" />
				)}
			</div>
		</Button>
	);
}
