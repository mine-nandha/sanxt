"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Moon, Sun, Copy, ArrowLeft, Mail } from "lucide-react";
import {
  extractInformation,
  getAreaCodeFor,
  getPriorityFor,
} from "@/lib/rmcmapping";
import { performOCR } from "@/lib/sanxt";
import { getMailTemplateHtml } from "@/components/mailTemplate";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Component() {
  const [sanxtNotes, setSanxtNotes] = useState("");
  const [esbNotes, setEsbNotes] = useState("");
  const [rmcData, setRmcData] = useState();
  const [generatedContent, setGeneratedContent] = useState();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);
  const generatedContentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sanxtData, setSanxtData] = useState([]);
  const [selectedStreets, setSelectedStreets] = useState([]);
  const [subject, setSubject] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  useEffect(() => {
    // Check if all necessary notes and data are filled before setting isLoading to false
    if (
      sanxtNotes &&
      esbNotes &&
      rmcData &&
      sanxtData &&
      selectedStreets.length &&
      customersCount
    ) {
      setIsLoading(false); // All data is ready, loading is complete
    } else {
      setIsLoading(true); // One of the fields is missing, still loading
    }
  }, [
    sanxtNotes,
    esbNotes,
    rmcData,
    sanxtData,
    selectedStreets,
    customersCount,
  ]); // Effect depends on these states

  const handleInputSanxt = async () => {
    let img = document.querySelector("#sanxt-notes img");
    if (img && img.tagName === "IMG") {
      setSanxtNotes(img.outerHTML); // Set the image HTML
      try {
        const ocrData = await performOCR(img.src); // Wait for the OCR to complete
        setSanxtData(ocrData); // Set the OCR result once it's ready
      } catch (error) {
        console.error("Error during OCR:", error);
        setSanxtData([]); // Optionally set empty data if OCR fails
      }
    } else {
      setSanxtData([]); // Clear if there's no image
    }
  };

  const handleInputEsb = () => {
    let img = document.querySelector("#esb-notes img");
    if (img && img.tagName === "IMG") {
      setEsbNotes(img.outerHTML);
    } else {
      setEsbNotes("");
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
      document.querySelectorAll('input[type="checkbox"]:checked')
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
    // Ensure that only numbers are accepted
    const value = event.target.value;
    setCustomersCount(value);
  };
  const copyToClipboard = async () => {
    try {
      const htmlContent = document.querySelector("#mailContent").innerHTML;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });
      await navigator.clipboard.write([clipboardItem]);
      console.log("Content copied with images!");
    } catch (error) {
      console.error("Failed to copy content:", error);
    }
  };
  const generateEmail = () => {
    const data = {
      esb: isChecked ? "ESB Found" : "No ESB",
      node: rmcData.nodeName,
      macAddress: rmcData.macAddress,
      account: rmcData.accountNumber,
      streets: selectedStreets,
      zip: rmcData.zip,
      customersCount,
    };
    let content = getMailTemplateHtml(data);
    setGeneratedContent(content);
    let time = new Date().toLocaleTimeString("en-GB", {
      timeZone: "Europe/Dublin",
      hour: "2-digit",
      minute: "2-digit",
    });
    let priority = getPriorityFor(customersCount);
    let areaCode = getAreaCodeFor(rmcData.zip);
    setSubject(
      `|${priority}|${areaCode}|${time}|BRK|SANXT|Co ${rmcData.region}-${
        rmcData.area
      }-${selectedStreets.join(", ")}`
    );
    setShowGeneratedContent(true);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-black text-white" : "bg-blue-100 text-gray-900"
      }`}
    >
      <nav className="bg-red-600 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">SANXT</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="bg-transparent border-white text-white hover:bg-red-700"
        >
          {isDarkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </nav>

      <div className="container mx-auto p-8">
        {!showGeneratedContent ? (
          <>
            <div className="flex justify-end mb-8 space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Upload Excel
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`sm:max-w-[425px] ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  <DialogHeader>
                    <DialogTitle>Upload Excel File</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="excel-file" className="text-right">
                        Excel File
                      </label>
                      <input
                        id="excel-file"
                        type="file"
                        accept=".xlsx,.xls"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Upload
                  </Button>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Download Excel
              </Button>
            </div>

            <Card
              className={`mb-8 ${
                isDarkMode
                  ? "bg-gray-800 border-red-600"
                  : "bg-white border-red-600"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl text-red-500">
                  Input Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label
                    htmlFor="sanxt-notes"
                    className="block text-sm font-medium mb-1"
                  >
                    SANXT Image
                  </label>
                  <div
                    id="sanxt-notes"
                    contentEditable
                    onInput={handleInputSanxt}
                    className={`mb-2 p-2 rounded min-h-[100px] focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-blue-50 text-gray-900 border-gray-300"
                    }`}
                  />
                </div>
                {sanxtData ? (
                  <div
                    id="streets"
                    className="flex flex-wrap gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  >
                    {sanxtData.map((street) => (
                      <span
                        className="flex items-center px-2 cursor-pointer select-none"
                        key={street}
                        onClick={handleStreetSelection}
                      >
                        <input
                          className="scale-125 mx-2 cursor-pointer"
                          type="checkbox"
                          name="streets"
                          value={street}
                        />
                        {street}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div>
                  <label
                    htmlFor="rmc-data"
                    className="block text-sm font-medium mb-1"
                  >
                    RMC Mapping Tool Data
                  </label>
                  <Textarea
                    id="rmc-data"
                    onInput={handleInputRmc}
                    rows={5}
                    placeholder="Paste RMC Mapping Tool Data here"
                    className={
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-blue-50 text-gray-900 border-gray-300"
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="customer-count"
                    className="block text-sm font-medium mb-1"
                  >
                    Customer Count
                  </label>
                  <Input
                    name="customer-count"
                    type="number"
                    value={customersCount}
                    onChange={handleCustomersCount}
                  />
                </div>
                <div>
                  <label
                    htmlFor="esb-notes"
                    className="block text-sm font-medium mb-1"
                  >
                    ESB Image
                  </label>
                  <div
                    id="esb-notes"
                    contentEditable
                    onInput={handleInputEsb}
                    className={`mb-2 p-2 rounded min-h-[100px] focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-blue-50 text-gray-900 border-gray-300"
                    }`}
                  />
                  <div
                    onClick={handleEsbClick}
                    className="flex items-center cursor-pointer select-none"
                  >
                    <input
                      className="scale-125 mx-2 cursor-pointer"
                      type="checkbox"
                      name="esbfound"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)} // updates checkbox state
                    />
                    ESB Outage Found
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={generateEmail}
                  className="w-full bg-red-600 hover:bg-red-700 text-white flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Generate Mail"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </>
        ) : (
          <Card
            className={
              isDarkMode
                ? "bg-gray-800 border-red-600"
                : "bg-white border-red-600"
            }
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl text-red-500">
                Generated Email Content
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <Link
                    href={`https://outlook.office.com/mail/deeplink/compose?to=NetworkPerformanceTeam@virginmedia.ie;Mail2TicketUpdate@libertyglobal.com&subject=${subject}`}
                    target="_blank"
                  >
                    <Mail className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => location.reload()}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`whitespace-pre-wrap p-6 rounded bg-white text-black border border-gray-300`}
                id="mailContent"
              >
                <div
                  ref={generatedContentRef}
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
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
