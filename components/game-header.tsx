import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
};

export default function GameHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Voltar</Text>
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={{ width: 50 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  back: {
     fontSize: 20 },

  title: { 
   fontSize: 26,
    color: "#333",
    marginBottom: 10,
    fontWeight: "bold" },

  subtitle: { 
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#444"},
});
