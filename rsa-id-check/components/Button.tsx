import { useEffect, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type ButtonProps = {
  handlePress: () => void;
  label: string;
  color: string;
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  handlePress,
  label,
  color,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={handlePress}
    >
      <Text style={{ color: "white", fontSize: 25 }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    height: 80,
    borderRadius: 10,
    width: "100%",
  },
});
