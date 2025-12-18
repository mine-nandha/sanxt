"use client";

import { useCallback, useState } from "react";
import { ocrService } from "../services/ocrService";

/**
 * Custom hook for handling OCR operations
 * Manages OCR processing state, results, and errors
 * @returns {{streets: string[], isProcessing: boolean, error: Error|null, processImage: (imageSrc: string) => Promise<void>, reset: () => void}}
 */
export function useOCR() {
	const [streets, setStreets] = useState([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState(null);

	const processImage = useCallback(async (imageSrc) => {
		if (!imageSrc) {
			setStreets([]);
			return;
		}

		setIsProcessing(true);
		setError(null);

		try {
			const extractedStreets = await ocrService.performOCR(imageSrc);
			setStreets(extractedStreets);
		} catch (err) {
			console.error("OCR Error:", err);
			setError(err);
			setStreets([]);
		} finally {
			setIsProcessing(false);
		}
	}, []);

	const reset = useCallback(() => {
		setStreets([]);
		setError(null);
		setIsProcessing(false);
	}, []);

	return {
		streets,
		isProcessing,
		error,
		processImage,
		reset,
	};
}
