import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/button";

export default function Presentation1() {
  return (
        <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={require("../../assets/img/sunny-apresent.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.textBox}>
          <Text style={styles.title}>Olá, amiguinho(a)!</Text>
          <Text style={styles.subtitle}>Eu sou o Sunny!</Text>
        </View>
      </View>

      <Text style={styles.text}>
        Aqui, nós vamos brincar e aprender juntos!{"\n"}
        Durante o jogo, eu vou te fazer algumas perguntinhas.
      </Text>

     <Link href="/Presentation2" asChild>
    <Button title="Avançar" />
  </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF8F0",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginRight: -15,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom:5,
    color: "#333",
  },
  subtitle: {
    fontSize: 25,
    color: "#333",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    color: "#333",
    marginBottom: 30,
  },
});