"use client";

import { getMailTemplateHtml } from "@/components/mailTemplate";
import { getAreaCodeFor } from "../utils/areaMapping";
import { getPriorityFor } from "../utils/priorityMapping";

/**
 * Service for generating email content and subjects
 * Handles all email-related business logic
 */
class EmailService {
	/**
	 * Generate email subject line
	 * @param {{rmcData: Object, customersCount: number, selectedStreets: string[]}} data
	 * @returns {string} Generated subject line
	 */
	generateSubject(data) {
		const { rmcData, customersCount, selectedStreets } = data;

		if (!rmcData) {
			throw new Error("RMC data is required to generate subject");
		}

		const time = new Date().toLocaleTimeString("en-GB", {
			timeZone: "Europe/Dublin",
			hour: "2-digit",
			minute: "2-digit",
		});

		const priority = getPriorityFor(customersCount) || "P4";
		const areaCode = getAreaCodeFor(rmcData.zip);
		const location =
			selectedStreets.length > 0
				? selectedStreets.join(", ")
				: rmcData.streetAddress;

		return `|${priority}|${areaCode}|${time}|BRK|SANXT|Co ${rmcData.region}-${rmcData.area}-${location}`;
	}

	/**
	 * Generate email body content
	 * @param {{esb: string, node: string, macAddress: string, account: string, streets: string, zip: string, customersCount: number}} data
	 * @returns {string} Generated HTML email content
	 */
	generateEmailContent(data) {
		const emailData = {
			esb: data.esbFound ? "ESB Found" : "No ESB",
			node: data.rmcData.nodeName,
			macAddress: data.rmcData.macAddress,
			account: data.rmcData.accountNumber,
			streets:
				data.selectedStreets.length > 0
					? data.selectedStreets.join(", ")
					: data.rmcData.streetAddress,
			zip: data.rmcData.zip,
			customersCount: data.customersCount,
		};

		return getMailTemplateHtml(emailData);
	}

	/**
	 * Generate mailto link for email client
	 * @param {string} subject - Email subject
	 * @returns {string} Mailto URL
	 */
	generateMailToLink(subject) {
		const recipients = [
			"NetworkPerformanceTeam@virginmedia.ie",
			"Mail2TicketUpdate@libertyglobal.com",
		].join(";");

		return `https://outlook.office.com/mail/deeplink/compose?to=${recipients}&subject=${encodeURIComponent(subject)}`;
	}
}

// Export singleton instance
export const emailService = new EmailService();
