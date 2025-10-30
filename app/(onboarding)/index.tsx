import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/button";

export default function Presentation1() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/img/feliz.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Olá, amiguinho(a)!</Text>
      <Text style={styles.subtitle}>Eu sou o Sunny!</Text>

      <Text style={styles.text}>
        Aqui, nós vamos brincar e aprender juntos!{"\n"}
        Durante o jogo, eu vou te fazer algumas perguntinhas.
      </Text>

<Link href="/presentation2" asChild>
  <Button title="Avançar" />
</Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FAF8F0", padding: 20 },
  image: { width: 180, height: 180, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 22, marginBottom: 10, color: "#333" },
  text: { textAlign: "center", fontSize: 16, color: "#333", marginBottom: 30 },
});
