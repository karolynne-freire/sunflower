import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "../../components/Input";

export default function Login() {
  const [name, setName] = useState("");

  const handleStart = () => {
    if (!name.trim()) return;
    router.push({ pathname: "/home", params: { name } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageCircle}>
        <Image
          source={require("../../assets/img/perfil-feliz.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.label}>Nome</Text>
      <Input
        placeholder="Digite seu nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startText}>Começar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.exitButton]}
        onPress={() => router.back()}
      >
        <Text style={styles.exitText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageCircle: {
    borderWidth: 3,
    borderColor: "#AEE1F9",
    borderRadius: 100,
    padding: 10,
    marginBottom: 25,
  },
  image: {
    width: 150,
    height: 150,
  },
  label: {
    fontSize: 30,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    width: 250,
    height: 60,
    borderColor: "#AEE1F9",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  startButton: {
    width: 250,
    height: 60,
    backgroundColor: "#A8DADC",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  startText: {
    color: "#333",
    fontSize: 30,
    fontWeight: "bold",
  },
  exitButton: {
    width: 250,
    height: 60,
    backgroundColor: "#CDECF5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  exitText: {
    color: "#333",
    fontSize: 30,
    fontWeight: "bold",
  },
});
