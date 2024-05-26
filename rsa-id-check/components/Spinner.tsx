import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";

// const imgSource = require("../../assets/logos/wuerth-logo-smaller.png");

/**
 * This component renders a simple spinner that pops up whenever the user must wait
 * @returns
 */
export default function Spinner() {
  const rotation = useRef(new Animated.Value(0)).current;
  const theme = useColorScheme() ?? "light";

  useEffect(() => {
    // starts the animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500, // Duration for one complete rotation (in milliseconds)
        useNativeDriver: true,
      })
    );

    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, [rotation]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            backgroundColor: Colors[theme]["brandMid"],
            transform: [{ rotate: rotateInterpolation }],
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
          },
        ]}
      ></Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: 120,
    height: 120,
  },
});
