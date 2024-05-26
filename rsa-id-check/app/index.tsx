import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, ScanningResult, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";

import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/Button";

import { useIdHandler } from "@/hooks/useIdHandler";
import { useOCR } from "@/hooks/useOCR";

import { Scanner } from "./Scanner";
import CameraSuspense from "@/components/CameraSuspense";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const startData = {
  age: 0,
  sex: "",
  isForeign: false,
};

const capitalize = (str: String): String =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

export default function Index() {
  const [id, setId] = useState("");
  const [data, setData] = useState(startData);
  const [isValid, setIsValid] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const cameraRef = useRef<CameraView | null>(null);

  const theme = useColorScheme() ?? "light";
  const ocr = useOCR();
  const idHandler = useIdHandler();
  const [permission, requestPermission] = useCameraPermissions();

  function handleScanResult(result: ScanningResult) {
    console.log(`Got result with data: ${result.data}`);
    setId(result.data);
    setHasChecked(true);
  }

  const launchScanner = async () => {
    setId("");
    if (cameraRef && cameraRef.current) {
      try {
        const image = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });
        // console.log(image.base64);
        if (image) {
          const result = await ocr.getText(
            `data:image/jpeg;base64,${image.base64}`
          );
          console.log(result);
          if (result) {
            setId(result);
            setHasChecked(true);
          }
        }
      } catch (err) {
        console.log("Caught error in launchscanner: ", err);
      }
    }
    // Scanner().getCode(handleScanResult);
  };

  const handlePress = () => {
    if (id.length == 13) {
      setHasChecked(false);
      const valid = idHandler.isValidId(id);
      const info = idHandler.extractInfo(id);
      setData(info);
      setIsValid(valid);
      setHasChecked(true);
    }
  };

  const clearState = () => {
    setHasChecked(false);
    setId("");
    setData(startData);
    setIsValid(false);
  };

  const handlePermission = () => {
    console.log(requestPermission);
    console.log("Requesting permission");
    requestPermission();
  };

  useEffect(() => {
    if (hasChecked) {
      handlePress();
    }
  }, [hasChecked]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  return (
    <SafeAreaView
      style={{
        ...styles.safeContainer,
        backgroundColor: Colors[theme]["background"],
      }}
    >
      <StatusBar style="light" />
      {!permission.granted ? (
        <CameraSuspense requestPermission={handlePermission} />
      ) : (
        <ThemedView color="background" style={styles.container}>
          <ThemedText type="title">RSA ID CHECKER</ThemedText>

          <ThemedView style={styles.resultContainer}>
            <ThemedText type="subtitle">
              {hasChecked ? "Result" : "Preview"}
            </ThemedText>
            {hasChecked ? (
              <View
                style={{
                  gap: 30,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  aspectRatio: 1,
                }}
              >
                {isValid ? (
                  <AntDesign
                    name="checkcircleo"
                    size={150}
                    color={Colors[theme]["success"]}
                  />
                ) : (
                  <AntDesign
                    name="closecircleo"
                    size={150}
                    color={Colors[theme]["fail"]}
                  />
                )}
                <ThemedText type="button">Age {data.age}</ThemedText>
                <ThemedText type="button">{capitalize(data.sex)}</ThemedText>
                {!data.isForeign && <Text>Not South African</Text>}
              </View>
            ) : (
              <ThemedView color="text" style={styles.cameraContainer}>
                <CameraView
                  style={{ width: "100%", aspectRatio: 1 }}
                  facing="back"
                  ref={cameraRef}
                  flash="auto"
                />
              </ThemedView>
            )}
          </ThemedView>
          <ThemedView color="brandMid" style={styles.buttonContainer}>
            <TextInput
              style={[styles.input, { color: Colors[theme]["text"] }]}
              placeholder="enter id"
              placeholderTextColor={Colors[theme]["faded"]}
              value={id}
              onChangeText={setId}
              onSubmitEditing={handlePress}
            />
            <Button
              handlePress={launchScanner}
              label="Scan ID card"
              color="brand"
            />
            <Button
              handlePress={hasChecked ? clearState : handlePress}
              label={hasChecked ? "Clear" : "Validate"}
              color="brand"
            />
          </ThemedView>

          {/* <Button
            handlePress={clearState}
            label="Clear"
            color="black"
            style={{ position: "absolute", bottom: 0, height: 50 }}
          /> */}
        </ThemedView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  heading: { fontSize: 35 },
  resultContainer: { width: "100%", alignItems: "center", gap: 10 },
  cameraContainer: { width: "100%", aspectRatio: 1, borderRadius: 12 },
  buttonContainer: {
    width: "100%",
    gap: 15,
    alignItems: "center",
    borderRadius: 12,
    padding: 5,
  },
  input: {
    height: 50,
    borderRadius: 10,
    width: "100%",
    textAlign: "center",
    color: "",
    fontSize: 30,
  },
});
