"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CopyButton({ text, className = "" }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      const htmlContent = document.querySelector("#mailContent").innerHTML;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });
      await navigator.clipboard.write([clipboardItem]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      console.log("Content copied with images!");
    } catch (error) {
      console.error("Failed to copy content:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={copyToClipboard}
      aria-label={isCopied ? "Copied" : "Copy to clipboard"}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
