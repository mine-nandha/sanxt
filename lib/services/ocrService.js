"use client";

import Tesseract from "tesseract.js";

/**
 * Service for performing OCR (Optical Character Recognition) operations
 * Encapsulates Tesseract.js and provides a clean interface for text extraction
 */
class OCRService {
	/**
	 * Find coordinates of "Street Address" header in OCR data
	 * @private
	 * @param {Array} words - Array of word objects from Tesseract
	 * @returns {{x0: number, x1: number, y1: number} | null} Coordinates or null if not found
	 */
	_findStreetAddressCoordinates(words) {
		let x0 = null;
		let x1 = null;
		let y1 = null;

		// First try to find MAC/Status for y1, Offline for x0, Map/Create for x1
		for (let i = 0; i < words.length; i++) {
			if (words[i].text === "MAC" || words[i].text.toLowerCase() === "status") {
				y1 = words[i].bbox.y1;
			}
			if (
				words[i].text.toLowerCase() === "offline" ||
				words[i].text.toLowerCase() === "offine"
			) {
				x0 = words[i].bbox.x1;
			}
			if (
				words[i].text.toLowerCase() === "map" ||
				words[i].text.toLowerCase() === "create"
			) {
				x1 = words[i].bbox.x0 - 2 * (words[i].bbox.x1 - words[i].bbox.x0);
			}
			if (x0 && x1 && y1) {
				return { x0, x1, y1 };
			}
		}

		// Fallback: Find "Street Address" text
		for (let i = 0; i < words.length; i++) {
			if (words[i].text.toLowerCase() === "street") {
				if (words[i + 1]?.text.toLowerCase() === "address") {
					x0 = words[i].bbox.x0;
					x1 = words[i + 1].bbox.x1;
					y1 = words[i + 1].bbox.y1;
					const width = x1 - x0;
					const newX1 = x1 + width;
					return { x0, x1: newX1, y1 };
				}
			}
		}

		return null;
	}

	/**
	 * Extract street addresses from OCR word data based on coordinates
	 * @private
	 * @param {Array} words - Array of word objects from Tesseract
	 * @returns {Set<string>} Set of extracted street names
	 */
	_extractWordsBetweenCoordinates(words) {
		const coordinates = this._findStreetAddressCoordinates(words);
		if (!coordinates) return new Set();

		const extractedLines = new Set();
		let currentLine = "";
		let currentY0 = null;

		for (let i = 0; i < words.length; i++) {
			const word = words[i];

			// Check if word falls within the street address column
			if (
				word.bbox.x0 >= coordinates.x0 &&
				word.bbox.x1 <= coordinates.x1 &&
				word.bbox.y0 >= coordinates.y1
			) {
				if (currentY0 === null) {
					currentY0 = word.bbox.y0;
				}

				// Ignore short numbers
				if (!/^[A-Za-z]+$/.test(word.text.trim()) && word.text.length <= 3) {
					continue;
				}

				// Check if on same line and word not already included
				if (
					word.line.text.includes(currentLine) &&
					!currentLine.includes(word.text)
				) {
					currentLine += `${word.text} `;
				} else {
					// New line - save current and start new
					const camelCase = currentLine
						.trim()
						.toLowerCase()
						.replace(/\b\w/g, (char) => char.toUpperCase());

					if (/^[A-Za-z\s]+$/.test(camelCase) && camelCase.length > 3) {
						extractedLines.add(camelCase);
					}

					currentLine = `${word.text} `;
					currentY0 = word.bbox.y0;
				}
			}
		}

		return extractedLines;
	}

	/**
	 * Convert image to grayscale for better OCR accuracy
	 * @private
	 * @param {string} base64Image - Base64 encoded image
	 * @returns {Promise<string>} Grayscale base64 image
	 */
	async _convertToGrayscale(base64Image) {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = base64Image;

			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				canvas.width = img.width;
				canvas.height = img.height;

				// Draw image
				ctx.drawImage(img, 0, 0, img.width, img.height);

				// Get and convert pixels to grayscale
				const imageData = ctx.getImageData(0, 0, img.width, img.height);
				const data = imageData.data;

				for (let i = 0; i < data.length; i += 4) {
					const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
					data[i] = data[i + 1] = data[i + 2] = grayscale;
				}

				ctx.putImageData(imageData, 0, 0);
				resolve(canvas.toDataURL());
			};
		});
	}

	/**
	 * Perform OCR on an image and extract street addresses
	 * @param {string} imageSrc - Image source (base64 or URL)
	 * @returns {Promise<string[]>} Array of extracted street names
	 * @throws {Error} If OCR fails
	 */
	async performOCR(imageSrc) {
		try {
			const imageData = await this._convertToGrayscale(imageSrc);

			const job = await Tesseract.recognize(imageData, "eng");
			const { data } = await job;

			const streets = Array.from(
				this._extractWordsBetweenCoordinates(data.words),
			);
			return streets;
		} catch (error) {
			console.error("OCR Service Error:", error);
			throw new Error(`OCR processing failed: ${error.message}`);
		}
	}
}

// Export singleton instance
export const ocrService = new OCRService();
