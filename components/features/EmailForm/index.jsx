"use client";

import { useCallback, useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/lib/context/ThemeContext";
import { useImagePaste } from "@/lib/hooks/useImagePaste";
import { useOCR } from "@/lib/hooks/useOCR";
import { rmcService } from "@/lib/services/rmcService";
import CustomerCountInput from "./CustomerCountInput";
import ESBInput from "./ESBInput";
import RMCDataInput from "./RMCDataInput";
import SanxtImageInput from "./SanxtImageInput";
import StreetSelector from "./StreetSelector";

/**
 * Main Email Form Container (Smart Component)
 * Orchestrates all form inputs and state management
 */
export default function EmailFormContainer({ onGenerate }) {
	const { isDarkMode } = useTheme();
	const { streets, isProcessing, processImage } = useOCR();
	const sanxtImage = useImagePaste("sanxt-notes");
	const esbImage = useImagePaste("esb-notes");
	const rmcImagePaste = useImagePaste("rmc-image");

	const [rmcData, setRmcData] = useState(null);
	const [selectedStreets, setSelectedStreets] = useState([]);
	const [customersCount, setCustomersCount] = useState(0);
	const [isConverted, setIsConverted] = useState(false);
	const [esbFound, setEsbFound] = useState(false);

	// Handle SANXT image input and OCR
	const handleSanxtInput = useCallback(async () => {
		sanxtImage.handleInput();
		const imageSrc = sanxtImage.extractImageSrc();
		if (imageSrc) {
			await processImage(imageSrc);
		}
	}, [sanxtImage, processImage]);

	// Handle RMC data input
	const handleRMCInput = useCallback((e) => {
		const parsedData = rmcService.parseRMCData(e.target.value);
		if (parsedData) {
			setRmcData(parsedData);
		}
	}, []);

	// Handle street selection
	const handleStreetSelection = useCallback(() => {
		const checked = Array.from(
			document.querySelectorAll('input[name="streets"]:checked'),
		).map((el) => el.value);
		setSelectedStreets(checked);
	}, []);

	// Handle customer count conversion
	const handleConvert = useCallback((convertedValue) => {
		setCustomersCount(convertedValue);
		setIsConverted(true);
	}, []);

	// Check if form is valid
	const isFormValid =
		sanxtImage.imageHTML && esbImage.imageHTML && rmcData && customersCount > 0;

	// Handle form submission
	const handleSubmit = () => {
		if (isFormValid) {
			onGenerate({
				sanxtHTML: sanxtImage.imageHTML,
				esbHTML: esbImage.imageHTML,
				rmcImageHTML: rmcImagePaste.imageHTML,
				rmcData,
				selectedStreets,
				customersCount,
				esbFound,
			});
		}
	};

	return (
		<Card
			className={`mb-8 animate-slide-up ${
				isDarkMode
					? "glass-card border-pink-500/30"
					: "bg-white border-red-300 shadow-colored"
			}`}
		>
			<CardHeader>
				<CardTitle className="text-2xl text-gradient animate-fade-in">
					Input Data
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<CustomerCountInput
					value={customersCount}
					onChange={(val) => {
						setCustomersCount(val);
						setIsConverted(false);
					}}
					isConverted={isConverted}
					onConvert={handleConvert}
					isDarkMode={isDarkMode}
				/>

				<SanxtImageInput targetId="sanxt-notes" onInput={handleSanxtInput} />

				{isProcessing ? (
					<div className="flex justify-center py-4">
						<LoadingSpinner size="lg" />
					</div>
				) : (
					<StreetSelector
						streets={streets}
						onSelectionChange={handleStreetSelection}
					/>
				)}

				<RMCDataInput onInput={handleRMCInput} />

				<ESBInput
					targetId="esb-notes"
					onInput={esbImage.handleInput}
					isChecked={esbFound}
					onCheckChange={setEsbFound}
				/>

				<div>
					<div className="flex justify-between items-center mb-1">
						<label htmlFor="rmc-image" className="block text-sm font-medium">
							RMC Image
						</label>
						<div>
							<span className="text-xs text-gray-500">Optional</span>
						</div>
					</div>
					<div
						id="rmc-image"
						contentEditable
						onInput={rmcImagePaste.handleInput}
						className={`mb-2 p-3 rounded-lg min-h-[100px] border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:shadow-glow ${
							isDarkMode
								? "bg-gray-800/50 text-white border-gray-600 hover:border-gray-500"
								: "bg-blue-50/50 text-gray-900 border-gray-300 hover:border-gray-400"
						}`}
					/>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					onClick={handleSubmit}
					className="w-full bg-gradient-primary hover:shadow-glow text-white flex justify-center items-center transition-all duration-200 hover:scale-105 font-semibold text-base py-6"
					disabled={!isFormValid}
				>
					{!isFormValid ? <LoadingSpinner size="md" /> : "Generate Mail"}
				</Button>
			</CardFooter>
		</Card>
	);
}
