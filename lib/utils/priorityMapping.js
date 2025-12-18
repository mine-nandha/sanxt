/**
 * Priority ranges based on customer count
 */
const PRIORITY_RANGES = [
	{ max: 50, priority: "P4" },
	{ max: 499, priority: "P3" },
	{ max: 999, priority: "P2" },
	{ max: Infinity, priority: "P1" },
];

/**
 * Determine priority level based on number of affected customers
 * @param {number} customersCount - Number of affected customers
 * @returns {string|undefined} Priority level (P1-P4) or undefined if count is invalid
 */
export function getPriorityFor(customersCount) {
	if (customersCount <= 0) return undefined;

	const range = PRIORITY_RANGES.find((r) => customersCount <= r.max);
	return range?.priority;
}
