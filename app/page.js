/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: necessity */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: necessity */
"use client";

import { ArrowLeft, Mail, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CopyButton from "@/components/copyButton";
import { getMailTemplateHtml } from "@/components/mailTemplate";
import PasteButton from "@/components/pasteButton";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	extractInformation,
	getAreaCodeFor,
	getPriorityFor,
} from "@/lib/rmcmapping";
import { performOCR } from "@/lib/sanxt";

export default function Component() {
	const [sanxtNotes, setSanxtNotes] = useState("");
	const [esbNotes, setEsbNotes] = useState("");
	const [rmcImage, setRmcImage] = useState("");
	const [rmcData, setRmcData] = useState();
	const [generatedContent, setGeneratedContent] = useState();
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [showGeneratedContent, setShowGeneratedContent] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [sanxtData, setSanxtData] = useState([]);
	const [selectedStreets, setSelectedStreets] = useState([]);
	const [subject, setSubject] = useState("");
	const [isChecked, setIsChecked] = useState(false);
	const [customersCount, setCustomersCount] = useState(0);
	const [isConverted, setIsConverted] = useState(false);
	const topRef = useRef(null);

	useEffect(() => {
		document.body.className = isDarkMode ? "dark" : "light";
	}, [isDarkMode]);

	useEffect(() => {
		if (sanxtNotes && esbNotes && rmcData && customersCount) {
			setIsLoading(false);
		} else {
			setIsLoading(true);
		}
	}, [sanxtNotes, esbNotes, rmcData, customersCount]);

	const handleInputSanxt = async () => {
		const img = document.querySelector("#sanxt-notes img");
		if (img && img.tagName === "IMG") {
			setSanxtNotes(img.outerHTML);
			try {
				const ocrData = await performOCR(img.src);
				setSanxtData(ocrData);
			} catch (error) {
				console.error("Error during OCR:", error);
				setSanxtData([]);
			}
		} else {
			setSanxtData([]);
		}
	};

	const handleInputEsb = () => {
		const img = document.querySelector("#esb-notes img");
		if (img && img.tagName === "IMG") {
			setEsbNotes(img.outerHTML);
		} else {
			setEsbNotes("");
		}
	};

	const handleInputRmcImage = () => {
		const img = document.querySelector("#rmc-image img");
		if (img && img.tagName === "IMG") {
			setRmcImage(img.outerHTML);
		} else {
			setRmcImage("");
		}
	};

	const handleInputRmc = (e) => {
		const extractedData = extractInformation(e.target.value);
		if (extractedData) {
			setRmcData(extractedData);
		}
	};

	const handleStreetSelection = (e) => {
		const streets = Array.from(
			document.querySelectorAll('input[type="checkbox"]:checked'),
		).map((el) => el.value);
		setSelectedStreets(streets);
		if (e.target !== e.currentTarget) return;
		const checkbox = e.target.querySelector('input[type="checkbox"]');
		if (checkbox) {
			checkbox.click();
		}
	};

	const handleEsbClick = (event) => {
		if (event.target === event.currentTarget) {
			setIsChecked((prev) => !prev);
		}
	};

	const handleCustomersCount = (event) => {
		const value = event.target.value;
		setCustomersCount(value);
		setIsConverted(false);
	};

	const handleSubjectChange = (event) => {
		const value = event.target.value;
		setSubject(value);
	};

	const generateEmail = () => {
		const data = {
			esb: isChecked ? "ESB Found" : "No ESB",
			node: rmcData.nodeName,
			macAddress: rmcData.macAddress,
			account: rmcData.accountNumber,
			streets: selectedStreets.length
				? selectedStreets.join(", ")
				: rmcData.streetAddress,
			zip: rmcData.zip,
			customersCount,
		};
		const content = getMailTemplateHtml(data);
		setGeneratedContent(content);
		const time = new Date().toLocaleTimeString("en-GB", {
			timeZone: "Europe/Dublin",
			hour: "2-digit",
			minute: "2-digit",
		});
		const priority = getPriorityFor(customersCount);
		const areaCode = getAreaCodeFor(rmcData.zip);
		setSubject(
			`|${priority}|${areaCode}|${time}|BRK|SANXT|Co ${rmcData.region}-${
				rmcData.area
			}-${
				selectedStreets.length
					? selectedStreets.join(", ")
					: rmcData.streetAddress
			}`,
		);
		setTimeout(() => {
			topRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 200);
		setShowGeneratedContent(true);
	};

	return (
		<div
			className={`min-h-screen transition-colors duration-300 ${
				isDarkMode
					? "bg-gradient-to-br from-gray-900 to-black text-white"
					: "bg-gradient-page text-gray-900"
			}`}
		>
			<nav className="bg-gradient-primary p-4 flex justify-between items-center shadow-colored sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
				<h1 className="text-2xl font-bold text-white drop-shadow-lg animate-fade-in">
					SANXT
				</h1>
				<Button
					variant="outline"
					size="icon"
					onClick={() => setIsDarkMode(!isDarkMode)}
					className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 backdrop-blur-sm"
				>
					<div className="transition-transform duration-300">
						{isDarkMode ? (
							<Sun className="h-[1.2rem] w-[1.2rem]" />
						) : (
							<Moon className="h-[1.2rem] w-[1.2rem]" />
						)}
					</div>
				</Button>
			</nav>

			<div className="container mx-auto p-8 animate-fade-in">
				{!showGeneratedContent ? (
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
							<div>
								<label
									htmlFor="customer-count"
									className="block text-sm font-medium mb-1"
								>
									Customer Count
								</label>
								<div className="flex gap-2">
									<Input
										name="customer-count"
										type="number"
										value={customersCount}
										onChange={handleCustomersCount}
									/>
									<Button
										variant="outline"
										onClick={() => {
											setCustomersCount(Math.round(customersCount * 0.75));
											setIsConverted(true);
										}}
										className="whitespace-nowrap"
										disabled={isConverted}
									>
										× 0.75
									</Button>
								</div>
							</div>
							<div>
								<div className="flex justify-between items-center mb-1">
									<label
										htmlFor="sanxt-notes"
										className="block text-sm font-medium"
									>
										SANXT Image
									</label>
									<PasteButton targetId="sanxt-notes" />
								</div>
								<div
									id="sanxt-notes"
									contentEditable
									onInput={handleInputSanxt}
									className={`mb-2 p-3 rounded-lg min-h-[100px] border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:shadow-glow ${
										isDarkMode
											? "bg-gray-800/50 text-white border-gray-600 hover:border-gray-500"
											: "bg-blue-50/50 text-gray-900 border-gray-300 hover:border-gray-400"
									}`}
								/>
							</div>
							{sanxtData ? (
								<div
									id="streets"
									className="flex flex-wrap gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-fade-in"
								>
									{sanxtData.map((street) => (
										<span
											className="flex items-center px-3 py-2 cursor-pointer select-none rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
											key={street}
											onKeyUp={handleStreetSelection}
										>
											<input
												className="scale-125 mx-2 cursor-pointer accent-pink-500"
												type="checkbox"
												name="streets"
												value={street}
											/>
											{street}
										</span>
									))}
								</div>
							) : (
								<>No Address Found</>
							)}
							<div>
								<div className="flex justify-between items-center mb-1">
									<label
										htmlFor="rmc-data"
										className="block text-sm font-medium mb-1"
									>
										RMC Mapping Tool Data
									</label>
									<PasteButton targetId="rmc-data" />
								</div>
								<Textarea
									id="rmc-data"
									onInput={handleInputRmc}
									rows={5}
									placeholder="Paste RMC Mapping Tool Data here"
									className={
										isDarkMode
											? "bg-gray-800/50 text-white border-gray-600 hover:border-gray-500"
											: "bg-blue-50/50 text-gray-900 border-gray-300 hover:border-gray-400"
									}
								/>
							</div>
							<div>
								<div className="flex justify-between items-center mb-1">
									<label
										htmlFor="esb-notes"
										className="block text-sm font-medium"
									>
										ESB Image
									</label>
									<PasteButton targetId="esb-notes" />
								</div>
								<div
									id="esb-notes"
									contentEditable
									onInput={handleInputEsb}
									className={`mb-2 p-3 rounded-lg min-h-[100px] border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:shadow-glow ${
										isDarkMode
											? "bg-gray-800/50 text-white border-gray-600 hover:border-gray-500"
											: "bg-blue-50/50 text-gray-900 border-gray-300 hover:border-gray-400"
									}`}
								/>
								<div
									onKeyUp={handleEsbClick}
									className="flex items-center cursor-pointer select-none"
								>
									<input
										className="scale-125 mx-2 cursor-pointer"
										type="checkbox"
										name="esbfound"
										checked={isChecked}
										onChange={(e) => setIsChecked(e.target.checked)}
									/>
									ESB Outage Found
								</div>
							</div>
							<div>
								<div className="flex justify-between items-center mb-1">
									<label
										htmlFor="rmc-image"
										className="block text-sm font-medium"
									>
										RMC Image
									</label>
									<PasteButton targetId="rmc-image" />
								</div>
								<div
									id="rmc-image"
									contentEditable
									onInput={handleInputRmcImage}
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
								onClick={generateEmail}
								className="w-full bg-gradient-primary hover:shadow-glow text-white flex justify-center items-center transition-all duration-200 hover:scale-105 font-semibold text-base py-6"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
								) : (
									"Generate Mail"
								)}
							</Button>
						</CardFooter>
					</Card>
				) : (
					<Card
						className={
							isDarkMode
								? "glass-card border-pink-500/30 animate-slide-up"
								: "bg-white border-red-300 shadow-colored animate-slide-up"
						}
						ref={topRef}
					>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="text-2xl text-gradient">
								Generated Email Content
							</CardTitle>
							<div className="flex space-x-2">
								<Button variant="outline" size="icon">
									<Link
										href={`https://outlook.office.com/mail/deeplink/compose?to=NetworkPerformanceTeam@virginmedia.ie;Mail2TicketUpdate@libertyglobal.com;VNOC@virginmedia.ie&subject=${subject}`}
										target="_blank"
										rel="noopener noreferrer"
										passHref
									>
										<Button asChild variant="outline" size="icon">
											<Mail className="h-4 w-4" />
										</Button>
									</Link>
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="hover:scale-110 transition-all duration-200"
									onClick={() => location.reload()}
								>
									<ArrowLeft className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="my-4">
								<label
									htmlFor="subject"
									className="block text-sm font-medium mb-1"
								>
									Edit Subject:
								</label>
								<Input
									name="subject"
									value={subject}
									onChange={handleSubjectChange}
								/>
							</div>
							<p className="block text-sm font-medium mb-1">
								Copy the below content:
							</p>
							<div
								className={`whitespace-pre-wrap p-6 rounded-lg bg-white text-black border-2 border-gray-300 relative shadow-lg transition-all duration-200 hover:shadow-xl`}
								id="mailContent"
							>
								<CopyButton className="absolute top-2 right-2 z-10" />
								<div
									contentEditable
									dangerouslySetInnerHTML={{ __html: generatedContent }}
								/>
								<div
									contentEditable
									dangerouslySetInnerHTML={{
										__html: sanxtNotes,
									}}
								/>
								<div
									contentEditable
									dangerouslySetInnerHTML={{
										__html: esbNotes,
									}}
								/>
								<div
									contentEditable
									dangerouslySetInnerHTML={{
										__html: rmcImage,
									}}
								/>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
