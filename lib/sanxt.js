"use client";

import Tesseract from "tesseract.js";

// Function to find the coordinates of "Street Address"
function findStreetAddressCoordinates(words) {
  let x0 = null;
  let x1 = null;
  let y1 = null;
  for (let i = 0; i < words.length; i++) {
    // finding the word "Mac" or "Status"
    //for y1(down) and finding the word "Offline" to get x0(right), finding
    // the word "Map" or "Create" to get x1(right)
    if (words[i].text === "MAC" || words[i].text.toLowerCase() === "status") {
      y1 = words[i].bbox.y1;
    }
    if (
      words[i].text.toLowerCase() === "offline" ||
      words[i].text.toLowerCase() === "offine"
    ) {
      x0 = words[i].bbox.x1;
    }
    if (
      words[i].text.toLowerCase() === "map" ||
      words[i].text.toLowerCase() === "create"
    ) {
      x1 = words[i].bbox.x0 - 2 * (words[i].bbox.x1 - words[i].bbox.x0);
    }
    if (x0 && x1 && y1) {
      return { x0, x1, y1 };
    }
  }
  // Loop through all the words and find the bounding boxes of "Street" and "Address"
  for (let i = 0; i < words.length; i++) {
    // Check if the word is "Street" and the next word is "Address"
    if (words[i].text.toLowerCase() === "street") {
      if (words[i + 1].text.toLowerCase() === "address") {
        x0 = words[i].bbox.x0; // Get x0 value of "Street"
        x1 = words[i + 1].bbox.x1; // Get x1 value of "Address"
        y1 = words[i + 1].bbox.y1; // Get y1
        let width = x1 - x0;
        let newX1 = x1 + width;
        return { x0, x1: newX1, y1 }; // Stop searching once "Street" and "Address" are found
      }
    }
  }

  return null; // Return null if either "Street" or "Address" is not found
}

// Function to extract words between x0 and x1
function extractWordsBetweenCoordinates(words) {
  const coordinates = findStreetAddressCoordinates(words);
  let extractedLines = new Set();
  let currentLine = ""; // String to accumulate words for a single line
  let currentY0 = null; // To store the y0 value of the first word in the current line

  // Loop through the words and extract those that fall between x0 and x1
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Check if the word falls within the x0 and x1 range and has the same y0 value as the first word in the line
    if (
      word.bbox.x0 >= coordinates.x0 &&
      word.bbox.x1 <= coordinates.x1 &&
      word.bbox.y0 >= coordinates.y1
    ) {
      if (currentY0 === null) {
        // Set currentY0 if it's the first word
        currentY0 = word.bbox.y0;
      }

      // Ignore the word if it's a number (check if it's not a number)
      if (!/^[A-Za-z]+$/.test(word.text.trim()) && word.text.length <= 3) {
        continue;
      }

      // Check if the current word is on the same line (same y0 value) and the line has no repeated words
      if (
        word.line.text.includes(currentLine) &&
        !currentLine.includes(word.text)
      ) {
        // If it's on the same line, add the word to the current line
        currentLine += word.text + " ";
      } else {
        // If we find a new line (different y0 value), push the current line to extractedLines
        let camelCase = currentLine
          .trim()
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase());
        /^[A-Za-z\s]+$/.test(camelCase) && // if it has only alphabets
          camelCase.length > 3 && //if it has more than 3 alphabets
          extractedLines.add(camelCase); // add it to set
        currentLine = word.text + " "; // Start a new line with the current word
        currentY0 = word.bbox.y0; // Update currentY0 for the new line
      }
    }
  }
  return extractedLines; // Return the array of extracted lines
}

// Convert a base64 image to grayscale
async function convertToGrayscale(base64Image) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      // Convert each pixel to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Calculate average (you could also use luminosity formula)
        const grayscale = (r + g + b) / 3;

        // Set each channel to the grayscale value
        data[i] = grayscale;
        data[i + 1] = grayscale;
        data[i + 2] = grayscale;
      }

      // Put the modified data back
      ctx.putImageData(imageData, 0, 0);

      // Convert canvas back to base64
      resolve(canvas.toDataURL());
    };
  });
}

export async function performOCR(imageSrc) {
  let job;
  let imageData = await convertToGrayscale(imageSrc);
  try {
    job = await Tesseract.recognize(
      imageData, // Image URL or base64 string
      "eng" // Language (English in this case)
    );
    const { data } = await job;
    const streets = Array.from(extractWordsBetweenCoordinates(data.words));
    return streets;
  } catch (e) {
    console.error("Error performing OCR:", e);
  }
}
