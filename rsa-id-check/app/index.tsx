import { useRef, useState } from "react";
import { StyleSheet, TextInput, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CameraSuspense from "@/components/CameraSuspense";
import Button from "@/components/Button";

import { useIdHandler } from "@/hooks/useIdHandler";
import { useOCR } from "@/hooks/useOCR";
import { Colors } from "@/constants/Colors";

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

  const cameraOptions = {
    base64: true,
    quality: 0.5,
  };

  const takePicture = async (ref: any): Promise<string | null> => {
    const image = await ref.current.takePictureAsync(cameraOptions);
    return image ? `data:image/jpeg;base64,${image.base64}` : null;
  };

  const extractText = async (imageString: string | null) => {
    if (!imageString) {
      return;
    }

    const result = await ocr.getText(imageString);
    console.log(result);
    if (result) {
      setId(result);
      validateId();
    }
  };

  const launchScanner = async () => {
    if (!cameraRef.current) {
      return;
    }

    try {
      setId("");
      const base64 = await takePicture(cameraRef);
      await extractText(base64);
    } catch (err) {
      console.log("Caught error in launchscanner: ", err);
    }
  };

  const validateId = () => {
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
              <View style={styles.informationContainer}>
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
                {!data.isForeign && (
                  <ThemedText type="button">Not South African</ThemedText>
                )}
              </View>
            ) : (
              <ThemedView color="text" style={styles.cameraContainer}>
                <CameraView
                  style={{ flex: 1, borderRadius: 12 }}
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
              onSubmitEditing={validateId}
            />
            <Button
              handlePress={launchScanner}
              label="Scan ID card"
              color="brand"
            />
            <Button
              handlePress={hasChecked ? clearState : validateId}
              label={hasChecked ? "Clear" : "Validate"}
              color="brand"
            />
          </ThemedView>
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
  informationContainer: {
    gap: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    aspectRatio: 1,
  },
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
