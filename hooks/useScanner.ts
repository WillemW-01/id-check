import { CameraView } from "expo-camera";

export function useScanner() {
  async function getCode(listeningFunction: Function) {
    CameraView.onModernBarcodeScanned((result) => {
      listeningFunction(result);
      CameraView.dismissScanner();
    });
    CameraView.launchScanner({
      isHighlightingEnabled: true,
      barcodeTypes: ["code39"],
    });
  }

  return { getCode };
}
