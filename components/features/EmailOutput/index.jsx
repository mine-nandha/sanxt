/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Email template requires HTML rendering */
"use client";

import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";
import CopyButton from "@/components/copyButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/lib/context/ThemeContext";

/**
 * Email Output Container Component
 * Displays generated email with subject editor and content
 */
const EmailOutputContainer = forwardRef(
	(
		{
			subject,
			onSubjectChange,
			emailContent,
			sanxtHTML,
			esbHTML,
			rmcImageHTML,
			mailToLink,
			onBack,
		},
		ref,
	) => {
		const { isDarkMode } = useTheme();

		return (
			<Card
				ref={ref}
				className={
					isDarkMode
						? "glass-card border-pink-500/30 animate-slide-up"
						: "bg-white border-red-300 shadow-colored animate-slide-up"
				}
			>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-2xl text-gradient">
						Generated Email Content
					</CardTitle>
					<div className="flex space-x-2">
						<Button asChild variant="outline" size="icon">
							<Link
								href={mailToLink}
								target="_blank"
								rel="noopener noreferrer"
								passHref
							>
								<Mail className="h-4 w-4" />
							</Link>
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="hover:scale-110 transition-all duration-200"
							onClick={onBack}
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="my-4">
						<label htmlFor="subject" className="block text-sm font-medium mb-1">
							Edit Subject:
						</label>
						<Input name="subject" value={subject} onChange={onSubjectChange} />
					</div>
					<p className="block text-sm font-medium mb-1">
						Copy the below content:
					</p>
					<div
						className="whitespace-pre-wrap p-6 rounded-lg bg-white text-black border-2 border-gray-300 relative shadow-lg transition-all duration-200 hover:shadow-xl"
						id="mailContent"
					>
						<CopyButton className="absolute top-2 right-2 z-10" />
						<div
							contentEditable
							dangerouslySetInnerHTML={{ __html: emailContent }}
						/>
						<div
							contentEditable
							dangerouslySetInnerHTML={{ __html: sanxtHTML }}
						/>
						<div
							contentEditable
							dangerouslySetInnerHTML={{ __html: esbHTML }}
						/>
						<div
							contentEditable
							dangerouslySetInnerHTML={{ __html: rmcImageHTML }}
						/>
					</div>
				</CardContent>
			</Card>
		);
	},
);

EmailOutputContainer.displayName = "EmailOutputContainer";

export default EmailOutputContainer;
