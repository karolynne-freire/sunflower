import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Jogos() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Jogos</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: "#BEE3F8" }]}
          onPress={() => router.push("/memoria")}
      >
        <Image
          source={require("../assets/img/memoria.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Memória</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: "#FBD38D" }]}
        onPress={() => router.push("/memoria")}
      >
        <Image
          source={require("../assets/img/quebra.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Quebra-Cabeça</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: "#C6F6D5" }]}
        onPress={() => router.push("/jogoCobrinha")}
      >
        <Image
          source={require("../assets/img/cobrinha.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Cobrinha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: "#FEB2B2" }]}
        onPress={() => router.push("/jogoCores")}
      >
        <Image
          source={require("../assets/img/cores.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Cores</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FAF8F0",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  close: {
    fontSize: 24,
    color: "#666",
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
});

