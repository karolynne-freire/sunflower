import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button";

export default function Presentation2() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        No final de um jogo, eu vou te fazer uma perguntinha.{"\n\n"}
        As suas respostas me ajudam a entender como você está.{"\n\n"}E o meu
        rostinho pode mudar de humor conforme o que você sente.
      </Text>

      <Image
        source={require("../../assets/img/sunny-ideia.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={[styles.text]}>Vamos começar nossa aventura?!</Text>

      <Link href="/login" asChild>
        <Button title="Começar" style={styles.btn} />
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
  text: {
    textAlign: "center",
    fontSize: 30,
    color: "#333",
  },

  image: { width: 250, height: 250, marginVertical: 20 },

  btn: {
    marginTop: 15,
  },
});
