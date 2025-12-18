/**
 * Convert a string to CamelCase format
 * @param {string} str - Input string
 * @returns {string} CamelCase formatted string
 */
export function toCamelCase(str) {
	return str
		.trim()
		.toLowerCase()
		.replace(/(\b\w|!(?<=[`'])\w)/g, (char) => char.toUpperCase())
		.replace(/(?<=[`'])\w/g, (char) => char.toLowerCase());
}

/**
 * Format MAC address by inserting colons every two characters
 * @param {string} mac - Raw MAC address (12 hex characters)
 * @returns {string} Formatted MAC address (XX:XX:XX:XX:XX:XX)
 */
export function formatMacAddress(mac) {
	return mac.replace(/(.{2})(?=.)/g, "$1:");
}

/**
 * Capitalize first letter of each word
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export function capitalizeWords(str) {
	return str
		.trim()
		.toLowerCase()
		.replace(/\b\w/g, (char) => char.toUpperCase());
}
