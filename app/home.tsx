import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { Humor, useHumor } from "./context/HumorContext";

export default function Home() {
  const { name } = useLocalSearchParams();
  const { humor, setHumor } = useHumor();

  const [progresso, setProgresso] = useState(0);
  const [estaCalculando, setEstaCalculando] = useState(false);
  const larguraAnimada = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const verificarProgresso = async () => {
        const valorEnergia = await AsyncStorage.getItem("@energia_sunny");
        const num = valorEnergia ? parseInt(valorEnergia) : 0;
        setProgresso(num);

        Animated.timing(larguraAnimada, {
          toValue: num,
          duration: 1000,
          useNativeDriver: false,
        }).start();

        const salvas = await AsyncStorage.getItem("@respostas_contagem");
        const lista = salvas ? JSON.parse(salvas) : [];

        if (lista.length > 0 && lista.length < 3) {
          setEstaCalculando(true);
        } else if (lista.length >= 3 && humor === "calculando") {
          setEstaCalculando(true);
          executarCalculoFinal(lista);
        } else {
          setEstaCalculando(false);
        }
      };

      verificarProgresso();
    }, [humor]),
  );

  const executarCalculoFinal = (lista: any[]) => {
    setTimeout(async () => {
      const confirmadas = lista.filter((r: any) => r.confirmou);
      const resultadoFinal =
        confirmadas.length > 0
          ? confirmadas[confirmadas.length - 1].emocao
          : "calmo";

      setHumor(resultadoFinal as Humor);
      setEstaCalculando(false);
    }, 3000);
  };

  const getEmotionData = () => {
    if (estaCalculando) {
      return {
        avatar: require("../assets/img/perfil-feliz.png"),
        image: require("../assets/img/sunny-ideia.png"),
        text: "Hmmm... estou fazendo minhas continhas aqui! Só um segundinho...",
      };
    }

    if (humor === "inicio" || humor === "calculando") {
      return {
        avatar: require("../assets/img/perfil-feliz.png"),
        image: require("../assets/img/sunny-ideia.png"),
        text: "Olá! Seja bem-vindo(a)! Vamos jogar e descobrir como seu girassol está hoje?",
      };
    }

    const emotions: any = {
      feliz: {
        avatar: require("../assets/img/perfil-feliz.png"),
        image: require("../assets/img/feliz.png"),
        text: "Seu girassol está feliz!",
      },
      triste: {
        avatar: require("../assets/img/perfil-triste.png"),
        image: require("../assets/img/triste.png"),
        text: "Seu girassol está triste...",
      },
      bravo: {
        avatar: require("../assets/img/perfil-bravo.png"),
        image: require("../assets/img/bravo.png"),
        text: "Seu girassol está bravo!",
      },
      ansioso: {
        avatar: require("../assets/img/perfil-ansioso.png"),
        image: require("../assets/img/ansioso.png"),
        text: "Seu girassol está ansioso...",
      },
    };

    return (
      emotions[humor] || {
        avatar: require("../assets/img/perfil-feliz.png"),
        image: require("../assets/img/sunny-ideia.png"),
        text: "Seu girassol está calmo e tranquilo.",
      }
    );
  };

  const emotion = getEmotionData();
  const widthInterpolation = larguraAnimada.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sunflowerCircle}>
          <Image source={emotion.avatar} style={styles.sunflower} />
        </View>
        <Text style={styles.nameText}>Olá, {name || "Amigo"}!</Text>
      </View>

      <View style={styles.regadorContainer}>
        <View style={styles.regadorHeader}>
          <Image
            source={require("../assets/img/regador.png")}
            style={styles.regadorIcone}
          />
          <Text style={styles.regadorTexto}>Gotinhas de Carinho</Text>
          <Text style={styles.regadorPorcentagem}>{progresso}%</Text>
        </View>
        <View style={styles.barraFundo}>
          <Animated.View
            style={[styles.barraAgua, { width: widthInterpolation }]}
          />
        </View>
      </View>

      <View style={styles.emotionBox}>
        <Text style={styles.emotionText}>{emotion.text}</Text>
        <Image source={emotion.image} style={styles.emotionImage} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Jogar"
          backgroundColor="#A8E6CF"
          onPress={() => router.push("/jogos")}
        />
        <Button
          title="Sair"
          onPress={async () => {
            await AsyncStorage.clear();
            setHumor("inicio");
            router.replace("/");
          }}
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
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
    height: "15%",
    marginBottom: 10,
    backgroundColor: "#CDECF5",
    borderRadius: 10,
    paddingHorizontal: 40,
  },
  sunflowerCircle: {
    backgroundColor: "#FFF",
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  sunflower: {
    width: 90,
    height: 90,
  },
  nameBox: {
    backgroundColor: "#CDECF5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  regadorContainer: {
    width: "90%",
    marginBottom: 25,
  },
  regadorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  regadorIcone: {
    width: 100,
    height: 80,
    marginRight: 10,
  },
  regadorTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    flex: 1,
  },
  regadorPorcentagem: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#4FC3F7",
  },
  barraFundo: {
    width: "100%",
    height: 18,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#B3E5FC",
  },
  barraAgua: {
    height: "100%",
    backgroundColor: "#4FC3F7",
  },
  emotionBox: {
    backgroundColor: "#FBD38D",
    borderRadius: 20,
    width: "95%",
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
  },
  emotionText: {
    fontSize: 30,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "500",
  },
  emotionImage: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    width: "80%",
    gap: 10,
  },
});
