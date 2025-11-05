import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/button";
import Input from "../../components/input";

export default function Login() {
  const [name, setName] = useState("");

  const handleStart = () => {
    if (!name.trim()) return;
    console.log("Nome digitado:", name);
    router.push("/home"); // leva para a tela principal
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/img/feliz.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.label}>Nome</Text>

      <Input placeholder="Digite seu nome" value={name} onChangeText={setName} />

      <Button title="Começar" onPress={handleStart} />
      <Button title="Sair" backgroundColor="#CDECF5" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FAF8F0", padding: 20 },
  image: { width: 150, height: 150, marginBottom: 30 },
  label: { fontSize: 18, color: "#333", marginBottom: 5 },
});
