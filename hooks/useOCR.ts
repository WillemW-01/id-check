import { ocrSpace } from "@/custom-code/ocrSpace";

export function useOCR() {
  const getText = async (image: string | undefined) => {
    try {
      if (image) {
        console.log(image.slice(0, 100));
        const response = await ocrSpace(image, {
          apiKey: process.env.EXPO_PUBLIC_OCR_KEY,
        });
        console.log(response);
        if (response) {
          const results = response.ParsedResults;
          const text = results[0].ParsedText;
          const match = text.match(/\d{13}/);
          console.log(match);
          if (match && match.length > 0) {
            return match[0];
          } else return null;
        }
      }
    } catch (err) {
      console.log(`Ran into error: `, err);
    }

    return "";
  };

  return {
    getText,
  };
}
