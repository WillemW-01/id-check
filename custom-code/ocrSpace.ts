import fs from "fs";
// import axios from "axios";
import FormData from "form-data";
// prettier-ignore
type OcrSpaceLanguages =
  | "ara" | "bul" | "chs" | "cht" | "hrv" | "cze" | "dan" | "dut" | "eng" | "fin" | "fre" | "ger" | "gre" | "hun" | "kor" | "ita" | "jpn" | "pol" | "por" | "rus" | "slv" | "spa" | "swe" | "tur" // The following are only supported by OCREngine = '3'
  | "hin" | "kan" | "per" | "tel" | "tam" | "tai" | "vie";
type OcrSpaceFileTypes = string | "PDF" | "GIF" | "PNG" | "JPG" | "TIF" | "BMP";

export type OcrSpaceOptions = {
  apiKey?: string;
  ocrUrl?: string;
  language?: OcrSpaceLanguages;
  isOverlayRequired?: boolean;
  filetype?: OcrSpaceFileTypes;
  detectOrientation?: boolean;
  isCreateSearchablePdf?: boolean;
  isSearchablePdfHideTextLayer?: boolean;
  scale?: boolean;
  isTable?: boolean;
  OCREngine?: "1" | "2" | "3";
};

type OcrSpaceResponse = {
  ErrorMessage: string;
  ErrorDetails: string;
  IsErroredOnProcessing: boolean;
  OCRExitCode: number;
  ParsedResults: {
    ErrorMessage: string;
    ErrorDetails: string;
    FileParseExitCode: 0 | 1 | -10 | -20 | -30 | -99;
    HasOverlay: boolean;
    Message: string;
    ParsedText: string;
    TextOverlay: any;
  }[];
  ProcessingTimeInMilliseconds: number;
  SearchablePDFURL: string;
};

/**
 * Detect the input type between url, file path or base64 image
 * @param {string} input Input string
 * @return {string} input type
 */
function detectInput(input: string): string {
  if (input.startsWith("http")) return "url";
  if (input.startsWith("data:")) return "base64Image";
  return "file";
}

/**
 * Call OCR Space APIs
 * @param {string} input Input file as url, file path or base64 image (required)
 * @param {object} options Options
 * @return {object} OCR results
 */
export async function ocrSpace(
  input: string,
  options: OcrSpaceOptions
): Promise<OcrSpaceResponse | undefined> {
  try {
    if (!input || typeof input !== "string") {
      throw Error("Param input is required and must be typeof string");
    }
    const {
      apiKey,
      ocrUrl,
      language,
      isOverlayRequired,
      filetype,
      detectOrientation,
      isCreateSearchablePdf,
      isSearchablePdfHideTextLayer,
      scale,
      isTable,
      OCREngine,
    } = options;
    const formData = new FormData();
    console.log("Sending formData: ", formData);
    const detectedInput = detectInput(input);
    switch (detectedInput) {
      case "file":
        formData.append("file", fs.createReadStream(input));
        break;
      case "url":
      case "base64Image":
        formData.append(detectedInput, input);
        break;
    }
    formData.append("language", String(language || "eng"));
    formData.append("isOverlayRequired", String(isOverlayRequired || "false"));
    if (filetype) {
      formData.append("filetype", String(filetype));
    }
    formData.append("detectOrientation", String(detectOrientation || "false"));
    formData.append(
      "isCreateSearchablePdf",
      String(isCreateSearchablePdf || "false")
    );
    formData.append(
      "isSearchablePdfHideTextLayer",
      String(isSearchablePdfHideTextLayer || "false")
    );
    formData.append("scale", String(scale || "false"));
    formData.append("isTable", String(isTable || "false"));
    formData.append("OCREngine", String(OCREngine || "1"));

    const url = String(ocrUrl || "https://api.ocr.space/parse/image");
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        apikey: String(apiKey || "helloworld"),
      },
      body: formData as unknown as BodyInit,
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data as OcrSpaceResponse;
  } catch (error) {
    console.error(error);
  }
}
