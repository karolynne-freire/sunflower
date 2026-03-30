import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ModalConfirmacao from "../components/ModalConfirmacao";

const COLORS = [
  { id: "vermelho", color: "#FEB2B2" },
  { id: "amarelo", color: "#FFF5A1" },
  { id: "verde", color: "#C6F6D5" },
  { id: "azul", color: "#BEE3F8" },
];

const PHASES = [3, 4, 5, 5, 6, 6, 7, 8];
const TOTAL_PHASES = PHASES.length;

export default function JogoCores() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showSequence, setShowSequence] = useState(true);
  const [lives, setLives] = useState(3);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState<"intro" | "memorize" | "play">("intro");
  const [modalVisivel, setModalVisivel] = useState(false);

  const getGamePhaseName = () => `Fase ${phaseIndex + 1}`;

  function startGame() {
    generateSequence();
    setPhase("memorize");
  }

  const handleReset = () => {
    setPhaseIndex(0);
    setPhase("intro");
    setLives(3);
  };

  const generateSequence = () => {
    const length = PHASES[phaseIndex];
    const seq: string[] = [];
    for (let i = 0; i < length; i++) {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      seq.push(randomColor.id);
    }
    setSequence(seq);
    setUserAnswer([]);
    setShowSequence(true);
    setTimeLeft(length * 2 + 2);
  };

  useEffect(() => {
    if (phase === "memorize") {
      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timer);
            setShowSequence(false);
            setPhase("play");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "intro") {
      generateSequence();
    }
  }, [phaseIndex]);

  const handleSelect = (id: string) => {
    if (showSequence || lives <= 0 || phase !== "play") return;
    const updatedUserAnswer = [...userAnswer, id];
    setUserAnswer(updatedUserAnswer);

    if (updatedUserAnswer.length === sequence.length) {
      const isCorrect = updatedUserAnswer.every((v, i) => v === sequence[i]);
      if (isCorrect) {
        if (phaseIndex === TOTAL_PHASES - 1) {
          router.push({
            pathname: "/resultado",
            params: {
              status: "vitoria",
              jogoId: "cores",
              niveisConcluidos: TOTAL_PHASES,
              totalDoJogo: TOTAL_PHASES,
            },
          });
          return;
        }
        setTimeout(() => {
          setPhaseIndex((prev) => prev + 1);
          setPhase("intro");
        }, 1200);
      } else {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          router.push({
            pathname: "/resultado",
            params: {
              status: "derrota",
              jogoId: "cores",
              niveisConcluidos: phaseIndex,
              totalDoJogo: TOTAL_PHASES,
            },
          });
        } else {
          setTimeout(() => {
            generateSequence();
            setPhase("memorize");
          }, 1200);
        }
      }
    }
  };

  const abrirModalSair = () => setModalVisivel(true);
  const confirmarSaida = () => {
    setModalVisivel(false);
    router.back();
  };

  const screenWidth = Dimensions.get("window").width;
  const boxSize = sequence.length <= 4 ? screenWidth * 0.24 : screenWidth * 0.2;

  return (
    <View style={styles.container}>
      {/* HEADER PADRONIZADO */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={abrirModalSair}
        >
          <Text style={{ fontSize: 24 }}>⬅️</Text>
        </TouchableOpacity>

        {/* PLACAR SÓ APARECE NA HORA DE JOGAR (PLAY) */}
        {phase === "play" && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreItem}>
              ⭐ {phaseIndex + 1}/{TOTAL_PHASES}
            </Text>
            <Text style={styles.scoreItem}>❤️ {lives}</Text>
          </View>
        )}
      </View>

      <View style={styles.gameContainer}>
        {phase === "intro" && (
          <View style={styles.centerBox}>
            <Text style={styles.title}>{getGamePhaseName()}</Text>
            <Text style={styles.subtitle}>Vamos jogar?</Text>
            <TouchableOpacity style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>Começar</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === "memorize" && (
          <View style={styles.centerBox}>
            <Text style={styles.instruction}>Observe com calma 👀</Text>
            <Text style={styles.timerText}>{timeLeft}s</Text>
            <View style={styles.sequenceRow}>
              {sequence.map((id, index) => {
                const color = COLORS.find((c) => c.id === id)?.color;
                return (
                  <View
                    key={index}
                    style={[
                      styles.box,
                      {
                        backgroundColor: color,
                        width: boxSize,
                        height: boxSize,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        )}

        {phase === "play" && (
          <View style={styles.centerBox}>
            <Text style={styles.instruction}>Repita as cores!</Text>
            <View style={styles.answerRow}>
              {sequence.map((_, i) => {
                const colorId = userAnswer[i];
                const color = COLORS.find((c) => c.id === colorId)?.color;
                const borderColor = colorId
                  ? colorId === sequence[i]
                    ? "#4CAF50"
                    : "#FF3D3D"
                  : "#ccc";
                return (
                  <View
                    key={i}
                    style={[
                      styles.box,
                      {
                        backgroundColor: color || "#EDEDED",
                        borderColor,
                        width: boxSize,
                        height: boxSize,
                      },
                    ]}
                  />
                );
              })}
            </View>

            <View style={styles.buttonsRow}>
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.colorButton, { backgroundColor: c.color }]}
                  onPress={() => handleSelect(c.id)}
                  disabled={userAnswer.length >= sequence.length}
                >
                  <Text style={styles.buttonLabel}>{c.id.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <ModalConfirmacao
        visivel={modalVisivel}
        onConfirmar={confirmarSaida}
        onCancelar={() => setModalVisivel(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF8F0" },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    height: 110,
    position: "absolute",
    top: 0,
    zIndex: 10,
  },
  backIconButton: {
    width: 55,
    height: 55,
    backgroundColor: "#FFF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    borderWidth: 2,
    borderColor: "#AEE1F9",
  },
  scoreContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#AEE1F9",
    gap: 15,
  },
  scoreItem: { fontSize: 18, fontWeight: "bold", color: "#333" },
  gameContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  centerBox: { width: "100%", alignItems: "center", paddingHorizontal: 10 },
  title: { fontSize: 40, fontWeight: "bold", color: "#333", marginBottom: 5 },
  subtitle: { fontSize: 24, color: "#666", marginBottom: 20 },
  instruction: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  timerText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#333",
  },
  sequenceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  answerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginBottom: 30,
  },
  box: { borderRadius: 22, borderWidth: 3, borderColor: "#a0c3d07d" },
  buttonsRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorButton: {
    width: 155,
    height: 85,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#a0c3d07d",
  },
  buttonLabel: { fontWeight: "bold", fontSize: 18, color: "#333" },
  button: {
    backgroundColor: "#AEE1F9",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 18,
    minWidth: 250,
    alignItems: "center",

    borderBottomColor: "#7EC8E3",
  },
  buttonText: { color: "#333", fontSize: 24, fontWeight: "bold" },
});
