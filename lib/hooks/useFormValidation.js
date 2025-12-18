"use client";

import { useMemo } from "react";

/**
 * Custom hook for form validation
 * Validates that all required fields are filled
 * @param {{sanxtImage: boolean, esbImage: boolean, rmcData: Object|null, customersCount: number}} formData
 * @returns {{isValid: boolean, errors: string[]}}
 */ export function useFormValidation(formData) {
	const validation = useMemo(() => {
		const errors = [];

		if (!formData.sanxtImage) {
			errors.push("SANXT image is required");
		}

		if (!formData.esbImage) {
			errors.push("ESB image is required");
		}

		if (!formData.rmcData) {
			errors.push("RMC data is required");
		}

		if (!formData.customersCount || formData.customersCount <= 0) {
			errors.push("Customer count must be greater than 0");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}, [formData]);

	return validation;
}
