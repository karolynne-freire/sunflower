import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  containerStyle?: object;
}

export default function Input({ containerStyle, style, ...rest }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...rest}
        style={[styles.input, style]}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    color: "#333",
  },
});
