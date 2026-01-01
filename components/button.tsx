import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  backgroundColor?: string;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  backgroundColor = "#AEE3F0",
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 30,
  },
});
