"use client";

import { useCallback, useState } from "react";

/**
 * Custom hook for handling image paste operations
 * Manage image HTML state and paste functionality
 * @param {string} targetId - ID of the target element for pasting
 * @returns {{imageHTML: string, pasteImage: () => Promise<void>, clearImage: () => void, extractImageSrc: () => string|null}}
 */
export function useImagePaste(targetId) {
	const [imageHTML, setImageHTML] = useState("");

	/**
	 * Extract image from contentEditable element
	 */
	const extractImageSrc = useCallback(() => {
		if (typeof document === "undefined") return null;

		const element = document.querySelector(`#${targetId}`);
		if (!element) return null;

		const img = element.querySelector("img");
		if (img && img.tagName === "IMG") {
			return img.src;
		}
		return null;
	}, [targetId]);

	/**
	 * Handle image input from contentEditable div
	 */
	const handleInput = useCallback(() => {
		const img = extractImageSrc();
		if (img) {
			const element = document.querySelector(`#${targetId}`);
			setImageHTML(element?.innerHTML || "");
		} else {
			setImageHTML("");
		}
	}, [targetId, extractImageSrc]);

	/**
	 * Clear image
	 */
	const clearImage = useCallback(() => {
		setImageHTML("");
		if (typeof document !== "undefined") {
			const element = document.querySelector(`#${targetId}`);
			if (element) {
				element.innerHTML = "";
			}
		}
	}, [targetId]);

	return {
		imageHTML,
		handleInput,
		extractImageSrc,
		clearImage,
	};
}
