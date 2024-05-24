import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export function Scanner() {
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
