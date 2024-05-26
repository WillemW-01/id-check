import { ColorValue, View, type ViewProps } from "react-native";

import { useColor } from "@/hooks/useColor";
import { Colors } from "@/constants/Colors";

export type ThemedViewProps = ViewProps & {
  color?: keyof typeof Colors.light & keyof typeof Colors.dark;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ color, style, ...otherProps }: ThemedViewProps) {
  const backgroundColor: ColorValue = color ? useColor(color) : "transparent";
  console.log(`Returning background color: ${backgroundColor.toString()}`);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
