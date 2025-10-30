import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/button";

export default function Presentation2() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Não tem resposta certa ou errada, tá bem?{"\n"}
        As suas respostas me ajudam a entender como você está.{"\n\n"}
        E o meu rostinho pode mudar de humor conforme o que você sente.
      </Text>

      <Image
        source={require("../../assets/img/sunny-apresent.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={[styles.text, { marginTop: 20 }]}>
        Vamos começar nossa aventura?!
      </Text>

<Link href="/login" asChild>
  <Button title="Começar" />
</Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FAF8F0", padding: 20 },
  text: { textAlign: "center", fontSize: 18, color: "#333" },
  image: { width: 150, height: 150, marginVertical: 20 },
});
