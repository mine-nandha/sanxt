"use client";

import { useCallback, useMemo, useState } from "react";
import { emailService } from "../services/emailService";

/**
 * Custom hook for email generation logic
 * Handles email content and subject generation
 * @returns {{subject: string, emailContent: string, isGenerated: boolean, generate: (data) => void, reset: () => void, mailToLink: string}}
 */
export function useEmailGenerator() {
	const [subject, setSubject] = useState("");
	const [emailContent, setEmailContent] = useState("");
	const [isGenerated, setIsGenerated] = useState(false);

	/**
	 * Generate email subject and content
	 * @param {{rmcData: Object, customersCount: number, selectedStreets: string[], esbFound: boolean, sanxtHTML: string, esbHTML: string, rmcImageHTML: string}} data
	 */
	const generate = useCallback((data) => {
		try {
			// Generate subject
			const generatedSubject = emailService.generateSubject({
				rmcData: data.rmcData,
				customersCount: data.customersCount,
				selectedStreets: data.selectedStreets,
			});
			setSubject(generatedSubject);

			// Generate email content
			const content = emailService.generateEmailContent({
				rmcData: data.rmcData,
				selectedStreets: data.selectedStreets,
				customersCount: data.customersCount,
				esbFound: data.esbFound,
			});
			setEmailContent(content);

			setIsGenerated(true);
		} catch (error) {
			console.error("Email generation error:", error);
			throw error;
		}
	}, []);

	/**
	 * Reset email state
	 */
	const reset = useCallback(() => {
		setSubject("");
		setEmailContent("");
		setIsGenerated(false);
	}, []);

	/**
	 * Generate mailto link
	 */
	const mailToLink = useMemo(() => {
		if (!subject) return "";
		return emailService.generateMailToLink(subject);
	}, [subject]);

	return {
		subject,
		setSubject,
		emailContent,
		isGenerated,
		generate,
		reset,
		mailToLink,
	};
}
