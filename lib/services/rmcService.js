"use client";

import {
	capitalizeWords,
	formatMacAddress,
	toCamelCase,
} from "../utils/textFormatters";

/**
 * Service for parsing RMC (Remote Monitoring Center) mapping tool data
 * Extracts structured information from raw text output
 */
class RMCService {
	/**
	 * Parse raw RMC mapping tool data
	 * @param {string} rawText - Raw text from RMC mapping tool
	 * @returns {{accountNumber: string, macAddress: string, nodeName: string, streetAddress: string, area: string, region: string, zip: string} | null}
	 */
	parseRMCData(rawText) {
		if (!rawText || typeof rawText !== "string") {
			return null;
		}

		// Define regex patterns
		const patterns = {
			account: /Account:\s*(\d+)/,
			mac: /Mac Addr:\s*([0-9A-Fa-f]{12})/,
			nodeName: /Node Name:\s*([A-Za-z0-9\s'`/-]+)/,
			zip: /->\s*([A-Za-z0-9]+)/,
			streetAddress: /Street:\s*([A-Za-z0-9\s'`/-]+)(?=\s*Locality|$)/,
			region: /([A-Za-z]+(?:\s+\d+[A-Za-z]*)?)\s*->/,
		};

		// Extract data
		const accountMatch = rawText.match(patterns.account);
		const macMatch = rawText.match(patterns.mac);
		const nodeNameMatch = rawText.match(patterns.nodeName);
		const zipMatch = rawText.match(patterns.zip);
		const streetAddressMatch = rawText.match(patterns.streetAddress);
		const regionMatch = rawText.match(patterns.region);

		// Format extracted data
		const accountNumber = accountMatch ? accountMatch[1] : "Not found";
		const macAddress = macMatch ? formatMacAddress(macMatch[1]) : "Not found";
		const nodeName = nodeNameMatch
			? toCamelCase(nodeNameMatch[1])
			: "Not found";
		const zip = zipMatch ? zipMatch[1] : "Not found";
		const streetAddress = streetAddressMatch
			? toCamelCase(streetAddressMatch[1])
			: "Not found";
		const region = regionMatch ? capitalizeWords(regionMatch[1]) : "Not found";

		// Extract area (text between street address and region)
		const areaRegex = new RegExp(
			`${streetAddress}\\s+([\\w\\s'\`]+?)\\s+${region}`,
			"i",
		);
		const areaMatch = rawText.match(areaRegex);
		const area = areaMatch ? capitalizeWords(areaMatch[1]) : "Not found";

		// Return null if no data was found
		if (
			!accountMatch &&
			!macMatch &&
			!nodeNameMatch &&
			!streetAddressMatch &&
			!areaMatch &&
			!regionMatch &&
			!zipMatch
		) {
			return null;
		}

		return {
			accountNumber,
			macAddress,
			nodeName,
			streetAddress,
			area,
			region,
			zip,
		};
	}

	/**
	 * Validate parsed RMC data
	 * @param {Object} rmcData - Parsed RMC data
	 * @returns {boolean} True if data contains required fields
	 */
	validateRMCData(rmcData) {
		if (!rmcData) return false;

		const requiredFields = ["nodeName", "macAddress", "streetAddress"];
		return requiredFields.every(
			(field) => rmcData[field] && rmcData[field] !== "Not found",
		);
	}
}

// Export singleton instance
export const rmcService = new RMCService();
