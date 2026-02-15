import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import { Image, StyleSheet, Text, View, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/button";
import { useHumor } from "./context/HumorContext";

export default function Home() {
  const { name } = useLocalSearchParams();
  const { humor } = useHumor();
  const [progresso, setProgresso] = useState(0);
  const larguraAnimada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const carregarDados = async () => {
      const valor = await AsyncStorage.getItem("@energia_sunny");
      const num = valor ? parseInt(valor) : 0;
      setProgresso(num);

      Animated.timing(larguraAnimada, {
        toValue: num,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    };
    carregarDados();
  }, [humor]);

  const widthInterpolation = larguraAnimada.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const getEmotionData = () => {
    if (humor === "calculando") {
      return {
        avatar: require("../assets/img/perfil-feliz.png"),
        image: require("../assets/img/sunny-ideia.png"),
        text: "Hmmm... estou fazendo minhas contas ainda! Vamos jogar mais uma?",
      };
    }
    switch (humor) {
      case "feliz": return { avatar: require("../assets/img/perfil-feliz.png"), image: require("../assets/img/feliz.png"), text: "Seu girassol está feliz, assim como você!" };
      case "triste": return { avatar: require("../assets/img/perfil-triste.png"), image: require("../assets/img/triste.png"), text: "Seu girassol está triste, talvez precise de carinho." };
      case "bravo": return { avatar: require("../assets/img/perfil-bravo.png"), image: require("../assets/img/bravo.png"), text: "Seu girassol está bravo, algo te incomodou hoje." };
      case "ansioso": return { avatar: require("../assets/img/perfil-ansioso.png"), image: require("../assets/img/ansioso.png"), text: "Seu girassol está ansioso, respire fundo..." };
      default: return { avatar: require("../assets/img/perfil-feliz.png"), image: require("../assets/img/sunny-ideia.png"), text: "Seu girassol está calmo e tranquilo." };
    }
  };

  const emotion = getEmotionData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sunflowerCircle}>
          <Image source={emotion.avatar} style={styles.sunflower} resizeMode="contain" />
        </View>
        <View style={styles.nameBox}>
          <Text style={styles.nameText}>Olá, {name || "Amigo"}!</Text>
        </View>
      </View>

      <View style={styles.regadorContainer}>
        <View style={styles.regadorHeader}>
          <Image source={require("../assets/img/regador.png")} style={styles.regadorIcone} resizeMode="contain" />
          <Text style={styles.regadorTexto}>Gotinhas de Carinho</Text>
          <Text style={styles.regadorPorcentagem}>{progresso}%</Text>
        </View>
        <View style={styles.barraFundo}>
          <Animated.View style={[styles.barraAgua, { width: widthInterpolation }]} />
        </View>
      </View>

      <View style={styles.emotionBox}>
        <Text style={styles.emotionText}>{emotion.text}</Text>
        <Image source={emotion.image} style={styles.emotionImage} resizeMode="contain" />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Jogar" backgroundColor="#A8E6CF" onPress={() => router.push("/jogos")} />
        <Button title="Reiniciar" backgroundColor="#CDECF5" onPress={() => {
           AsyncStorage.multiRemove(["@respostas_contagem", "@energia_sunny"]);
           setProgresso(0);
           router.replace("/");
        }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF8F0", alignItems: "center", paddingTop: 40, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "95%", height: "15%", marginBottom: 10, backgroundColor: "#CDECF5", borderRadius: 10,paddingHorizontal: 40, },
  sunflowerCircle: { backgroundColor: "#FFF", borderRadius: 50, width: 80, height: 80, alignItems: "center", justifyContent: "center", marginRight: 10 },
  sunflower: { width: 90, height: 90 },
  nameBox: { backgroundColor: "#CDECF5", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  nameText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  regadorContainer: { width: "90%", marginBottom: 25 },
  regadorHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  regadorIcone: { width: 100, height: 80, marginRight: 10 },
  regadorTexto: { fontSize: 16, fontWeight: "600", color: "#555", flex: 1 },
  regadorPorcentagem: { fontSize: 25, fontWeight: "bold", color: "#4FC3F7" },
  barraFundo: { width: "100%", height: 18, backgroundColor: "#E0E0E0", borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "#B3E5FC" },
  barraAgua: { height: "100%", backgroundColor: "#4FC3F7" },
  emotionBox: { backgroundColor: "#FBD38D", borderRadius: 20, width: "95%", padding: 20, alignItems: "center", marginBottom: 30 },
  emotionText: { fontSize: 24, color: "#333", textAlign: "center", marginBottom: 15, fontWeight: "500" },
  emotionImage: { width: 200, height: 200 },
  buttonContainer: { width: "80%", gap: 15 }
});