import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PerguntaEmocional from "../components/pergunta";

const CONFIG_JOGOS = {
  snake: {
    nome: "Jogo da Cobrinha",
    corTopo: "#DDF2E4",
    icone: require("../assets/img/cobrinha.png"),
  },
  memoria: {
    nome: "Jogo da Memória",
    corTopo: "#FFE4E1",
    icone: require("../assets/img/memoria.png"),
  },
  cores: {
    nome: "Jogo das Cores",
    corTopo: "#E0F4FF",
    icone: require("../assets/img/cores.png"),
  },
  formas: {
    nome: "Jogo Quebra-Cabeça",
    corTopo: "#FFF9E0",
    icone: require("../assets/img/quebra.png"),
  },
};

export default function Resultado() {
  const { jogoId, niveisConcluidos } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [historicoExibir, setHistoricoExibir] = useState<number[]>([]);

  // Identifica qual jogo é. Se não vier nada, assume 'snake' por segurança.
  const idAtual = (jogoId as keyof typeof CONFIG_JOGOS) || "snake";
  const config = CONFIG_JOGOS[idAtual];

  const totalNiveis = 4;
  const numConcluidos = Number(niveisConcluidos) || 0;
  const porcentagemAtual = (numConcluidos / totalNiveis) * 100;

  useEffect(() => {
    const processarHistorico = async () => {
      try {
        const chave = `@historico_${idAtual}`;
        const salvo = await AsyncStorage.getItem(chave);
        let lista = salvo ? JSON.parse(salvo) : [];

        const novaLista = [numConcluidos, ...lista].slice(0, 5);
        await AsyncStorage.setItem(chave, JSON.stringify(novaLista));

        setHistoricoExibir(novaLista.map((n) => (n / totalNiveis) * 100));
      } catch (e) {
        console.log("Erro no storage", e);
      }
    };

    processarHistorico();
    const timer = setTimeout(() => setShowModal(true), 2000);
    return () => clearTimeout(timer);
  }, [idAtual, niveisConcluidos]);

  const handleClose = () => {
    setShowModal(false);
    router.push("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* TOPO DINÂMICO: Muda a cor conforme o jogo */}
      <View style={[styles.topSection, { backgroundColor: config.corTopo }]}>
        <Image
          source={require("../assets/img/estrela.png")}
          style={styles.starIcon}
        />

        <View style={styles.circleContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.percentageText}>{porcentagemAtual}%</Text>
          </View>
          <Image
            source={require("../assets/img/sunny-ideia.png")}
            style={styles.brainIcon}
          />
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {porcentagemAtual === 100 ? "Excelente!" : "Muito Bem!"}
          </Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scoreCard}
        >
          {historicoExibir.map((score, index) => (
            <View key={index} style={styles.scoreRow}>
              <Image source={config.icone} style={styles.scoreIcon} />
              <Text style={styles.scoreValueText}>{score}%</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <PerguntaEmocional visible={showModal} onClose={handleClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  topSection: {
    flex: 1.3,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 40,
  },
  starIcon: {
    position: "absolute",
    left: 90,
    width: 95,
    height: 95,
    resizeMode: "contain",
    bottom: 300,
    zIndex: 10,
  },
  circleContainer: { alignItems: "center", justifyContent: "center" },
  progressCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 10,
    borderColor: "#BDE0FE",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  percentageText: { fontSize: 44, fontWeight: "bold", color: "#444" },
  brainIcon: {
    position: "absolute",
    bottom: -40,
    right: -60,
    width: 130,
    height: 190,
    resizeMode: "contain",
  },
  badge: {
    backgroundColor: "#BDE0FE",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  badgeText: { fontSize: 20, fontWeight: "bold", color: "#333" },
  bottomSection: { flex: 1, paddingHorizontal: 25, paddingTop: 20 },
  scoreCard: { backgroundColor: "#E9F5F9", borderRadius: 25, padding: 10 },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  scoreIcon: { width: 60, height: 60, resizeMode: "contain" },
  scoreValueText: { fontSize: 32, fontWeight: "500", color: "#444" },
});
