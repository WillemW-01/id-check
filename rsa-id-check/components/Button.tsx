import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type ButtonProps = {
  handlePress: () => void;
  label: string;
  color: string;
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
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color, opacity: disabled ? 0.7 : 1 },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
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
