import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../components/button";

export default function Home() {
  const { name } = useLocalSearchParams();

  const formatName = (text: string | undefined) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sunflowerCircle}>
          <Image
            source={require("../assets/img/perfil-bravo.png")}
            style={styles.sunflower}
            resizeMode="contain"
          />
        </View>

        <View style={styles.nameBox}>
          <Text style={styles.nameText}>Olá, {formatName(name as string)}!</Text>
        </View>
      </View>

      <View style={styles.emotionBox}>
        <Text style={styles.emotionText}>
          Seu girassol está bravo, assim como você pode estar se sentindo agora.
        </Text>

        <Image
          source={require("../assets/img/bravo.png")}
          style={styles.emotionImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Jogar"
          backgroundColor="#A8E6CF"
          onPress={() => router.push("/jogos")}
        />
        <Button
          title="Sair"
          backgroundColor="#CDECF5"
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F0",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height:"15%",
    marginBottom: 30,
    backgroundColor: "#CDECF5",
    borderRadius: 10,
  },
  sunflowerCircle: {
    backgroundColor: "#FFF",
    borderRadius: 50,
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  sunflower: {
    width: 100,
    height: 100,
  },
  nameBox: {
    backgroundColor: "#CDECF5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  emotionBox: {
    backgroundColor: "#FBD38D",
    borderRadius: 10,
    width: "90%",
    padding: 20,
    alignItems: "center",
    marginBottom: 40,
  },
  emotionText: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  emotionImage: {
    width: 220,
    height: 220,
  },
  buttonContainer: {
    width: "80%",
    gap: 15,
  },
});

