import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  ColorValue,
} from "react-native";

import { useColor } from "@/hooks/useColor";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";

type ButtonProps = {
  handlePress: () => void;
  label: string;
  color: keyof typeof Colors.light | keyof typeof Colors.dark;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  handlePress,
  label,
  color,
  disabled,
  style,
}: ButtonProps) {
  const backgroundColor: ColorValue = color ? useColor(color) : "transparent";
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: backgroundColor, opacity: disabled ? 0.7 : 1 },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <ThemedText type="button">{label}</ThemedText>
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
