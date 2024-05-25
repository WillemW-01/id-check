import { Text, View, StyleSheet, Button } from "react-native";

type props = {
  requestPermission: () => void;
};

export default function CameraSuspense({ requestPermission }: props) {
  return (
    <View style={styles.container}>
      <Text style={{ textAlign: "center", fontSize: 20 }}>
        We need your permission to use the camera.
      </Text>
      <Button onPress={() => requestPermission()} title="Grant permission" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
