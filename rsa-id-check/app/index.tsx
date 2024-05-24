import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScanningResult, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import { Scanner } from "./Scanner";

import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/Button";

const startData = {
  age: 0,
  sex: "",
  isForeign: false,
};

export default function Index() {
  const [id, setId] = useState("");
  const [data, setData] = useState(startData);
  const [isValid, setIsValid] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const stringToDigits = (str: String): number[] =>
    str.split("").map((char) => Number(char));

  const capitalize = (str: String): String =>
    str.slice(0, 1).toUpperCase() + str.slice(1);

  const sumArray = (arr: number[]): number =>
    arr.reduce((total, currentValue, idx) => {
      return total + currentValue;
    });

  const sumWithMod2 = (arr: number[], modRes: number) =>
    arr.reduce((total, currentValue, idx) => {
      if (idx % 2 == modRes) {
        return total + currentValue;
      } else return total;
    });

  const isValidId = (id: String) => {
    const checkDigit = Number(id.slice(12));
    const payload = id.slice(0, 12);
    const digits = stringToDigits(payload);
    const oddPositionsSum = sumWithMod2(digits, 0);

    let concat = "";
    digits.forEach((digit, idx) => {
      if (idx % 2 == 1) {
        concat += String(digit);
      }
    });

    const evenPositionSum = Number(concat) * 2;
    const evenDigits = stringToDigits(String(evenPositionSum));
    const evenDigitsSum = sumArray(evenDigits);

    const total = oddPositionsSum + evenDigitsSum;
    const lastDigit = total % 10;
    const calc1 = (10 - lastDigit) % 10;
    console.log(`Original: ${checkDigit}, calc1: ${calc1}`);

    return checkDigit == calc1;
  };

  const getAge = (dateOfBirth: String) => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDay();

    let year = Number(dateOfBirth.slice(0, 2));
    year += year < todayYear - 2000 ? 2000 : 1900;
    const month = Number(dateOfBirth.slice(2, 4));
    const day = Number(dateOfBirth.slice(4, 6));

    console.log(`Year: ${year}, month: ${month}, day: ${day}`);

    let yearDiff = todayYear - year;
    yearDiff -= todayMonth < month && todayDay < day ? 1 : 0;

    return yearDiff;
  };

  const getSex = (sex: String) => {
    // females -> 0000-4999,  males -> 5000-9999
    const sexNum = Number(sex);
    return sexNum < 5000 ? "female" : "male";
  };

  const extractInfo = (id: String) => {
    const dateOfBirth = id.slice(0, 6);
    console.log(dateOfBirth);
    const sexSlice = id.slice(6, 10);
    const isRsa = Boolean(id.slice(10, 11));

    const age = getAge(dateOfBirth);
    const sex = getSex(sexSlice);

    console.log(`Age: ${age}, sex: ${sex}, isRsa: ${isRsa}`);

    return { age: age, sex: sex, isForeign: isRsa };
  };

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
      const valid = isValidId(id);
      const info = extractInfo(id);
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

  useEffect(() => {
    if (hasChecked) {
      handlePress();
    }
  }, [hasChecked]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Request permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
            <View>
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
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    height: 50,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "green",
  },
});
