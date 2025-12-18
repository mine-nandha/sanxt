"use client";

import { useRef, useState } from "react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import EmailFormContainer from "@/components/features/EmailForm";
import EmailOutputContainer from "@/components/features/EmailOutput";
import Navigation from "@/components/layout/Navigation";
import { useEmailGenerator } from "@/lib/hooks/useEmailGenerator";

/**
 * Main SANXT Application Page
 * Orchestrates the email generation workflow
 */
export default function SANXTPage() {
	const [showOutput, setShowOutput] = useState(false);
	const [formData, setFormData] = useState(null);
	const emailGenerator = useEmailGenerator();
	const topRef = useRef(null);

	/**
	 * Handle email generation from form data
	 */
	const handleGenerate = (data) => {
		setFormData(data);

		// Generate email
		emailGenerator.generate(data);

		// Show output view
		setShowOutput(true);

		// Scroll to top after brief delay
		setTimeout(() => {
			topRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 200);
	};

	/**
	 * Handle back to form
	 */
	const handleBack = () => {
		window.location.reload();
	};

	return (
		<div className="min-h-screen transition-colors duration-300 bg-gradient-page dark:bg-gradient-to-br dark:from-gray-900 dark:to-black text-gray-900 dark:text-white">
			<Navigation />

			<main className="container mx-auto p-8 animate-fade-in">
				<ErrorBoundary>
					{!showOutput ? (
						<EmailFormContainer onGenerate={handleGenerate} />
					) : (
						<EmailOutputContainer
							ref={topRef}
							subject={emailGenerator.subject}
							onSubjectChange={(e) => emailGenerator.setSubject(e.target.value)}
							emailContent={emailGenerator.emailContent}
							sanxtHTML={formData?.sanxtHTML || ""}
							esbHTML={formData?.esbHTML || ""}
							rmcImageHTML={formData?.rmcImageHTML || ""}
							mailToLink={emailGenerator.mailToLink}
							onBack={handleBack}
						/>
					)}
				</ErrorBoundary>
			</main>
		</div>
	);
}
