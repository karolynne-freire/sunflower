import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F0",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
});
