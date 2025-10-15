"use client";

import { useState } from "react";
import { Check, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PasteButton({ targetId, className = "" }) {
  const [isPasted, setIsPasted] = useState(false);

  const pasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      const targetElement = document.querySelector(`#${targetId}`);

      if (!targetElement) return;

      for (const item of clipboardItems) {
        // Handle images
        if (item.types.some((type) => type.startsWith("image/"))) {
          const imageType = item.types.find((type) =>
            type.startsWith("image/")
          );
          const blob = await item.getType(imageType);
          const url = URL.createObjectURL(blob);

          const img = document.createElement("img");
          img.src = url;
          img.style.maxWidth = "100%";

          targetElement.innerHTML = "";
          targetElement.appendChild(img);
          targetElement.dispatchEvent(new Event("input", { bubbles: true }));

          setIsPasted(true);
          setTimeout(() => setIsPasted(false), 2000);
          return;
        }

        // Handle HTML
        if (item.types.includes("text/html")) {
          const blob = await item.getType("text/html");
          const htmlContent = await blob.text();
          targetElement.innerHTML = htmlContent;
          targetElement.dispatchEvent(new Event("input", { bubbles: true }));
          setIsPasted(true);
          setTimeout(() => setIsPasted(false), 2000);
          return;
        }
      }

      // Fallback to plain text
      const text = await navigator.clipboard.readText();
      targetElement.textContent = text;
      targetElement.dispatchEvent(new Event("input", { bubbles: true }));
      setIsPasted(true);
      setTimeout(() => setIsPasted(false), 2000);
    } catch (error) {
      console.error("Failed to paste content:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={pasteFromClipboard}
      aria-label={isPasted ? "Pasted" : "Paste from clipboard"}
    >
      {isPasted ? (
        <Check className="h-4 w-4" />
      ) : (
        <Clipboard className="h-4 w-4" />
      )}
    </Button>
  );
}
