import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScanningResult, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";

import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/Button";

import { useIdHandler } from "@/hooks/useIdHandler";

import { Scanner } from "./Scanner";
import CameraSuspense from "@/components/CameraSuspense";

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

  const idHandler = useIdHandler();
  const [permission, requestPermission] = useCameraPermissions();

  function handleScanResult(result: ScanningResult) {
    console.log(`Got result with data: ${result.data}`);
    setId(result.data);
    setHasChecked(true);
  }

  const launchScanner = () => {
    setId("");
    Scanner().getCode(handleScanResult);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {!permission.granted ? (
        <CameraSuspense requestPermission={handlePermission} />
      ) : (
        <ThemedView style={styles.container}>
          <Text style={{ fontSize: 40, fontWeight: "bold" }}>RSA ID CHECK</Text>
          <View style={styles.inputContainer}>
            <Button
              handlePress={launchScanner}
              label="Scan id card"
              color="black"
            />
            <TextInput
              style={styles.input}
              placeholder="enter id"
              placeholderTextColor="white"
              value={id}
              onChangeText={setId}
              onSubmitEditing={handlePress}
            />
            <Button
              handlePress={handlePress}
              label="Press to validate"
              color="black"
              disabled={hasChecked}
            />
          </View>

          {hasChecked && (
            <View style={{ gap: 20 }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {isValid ? (
                  <AntDesign name="checkcircleo" size={120} color="green" />
                ) : (
                  <AntDesign name="closecircleo" size={120} color="red" />
                )}
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ fontSize: 35, fontWeight: "bold", marginBottom: 15 }}
                >
                  More information:
                </Text>
                <Text style={{ fontSize: 35 }}>Age {data.age}</Text>
                <Text style={{ fontSize: 35 }}>{capitalize(data.sex)}</Text>
                {!data.isForeign && <Text>Not South African</Text>}
              </View>
            </View>
          )}
          <Button
            handlePress={clearState}
            label="Clear"
            color="black"
            style={{ position: "absolute", bottom: 0, height: 50 }}
          />
        </ThemedView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    padding: 10,
  },
  heading: { fontSize: 35 },
  inputContainer: {
    width: "100%",
    gap: 20,
    alignItems: "center",
  },
  input: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#CC5500",
    width: "100%",
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
});
