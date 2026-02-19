import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  const getGamePhaseName = () => `Fase ${phaseIndex + 1}`;

  function startGame() {
    generateSequence();
    setPhase("memorize");
  }

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

  const screenWidth = Dimensions.get("window").width;
  const boxSize = sequence.length <= 4 ? screenWidth * 0.24 : screenWidth * 0.2;

  return (
    <View style={styles.container}>
      {phase === "intro" && (
        <View style={styles.center}>
          <Text style={styles.phaseText}>{getGamePhaseName()}</Text>
          <Text style={styles.subtitle}>Vamos jogar?</Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === "memorize" && (
        <View style={styles.center}>
          <Text style={styles.title}>Observe com calma 👀</Text>
          <Text style={styles.timer}>{timeLeft}s</Text>

          <View style={styles.sequenceRow}>
            {sequence.map((id, index) => {
              const color = COLORS.find((c) => c.id === id)?.color;
              return (
                <View
                  key={index}
                  style={[
                    styles.box,
                    { backgroundColor: color, width: boxSize, height: boxSize },
                  ]}
                />
              );
            })}
          </View>
        </View>
      )}

      {phase === "play" && (
        <View style={styles.center}>
          <Text style={styles.title}>Agora é sua vez! ⭐</Text>

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

          <Text style={styles.lives}>
            Vidas: {Array(lives).fill("❤️").join(" ")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    width: "95%",
    alignItems: "center",
  },
  phaseText: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 14,
  },
  timer: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 18,
  },
  lives: {
    fontSize: 22,
    marginTop: 30,
    color: "#FF4C4C",
    fontWeight: "bold",
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
    marginVertical: 20,
  },
  box: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#a0c3d07d",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorButton: {
    width: 155,
    height: 80,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#a0c3d07d",
  },
  buttonLabel: { fontWeight: "bold", fontSize: 18, color: "#333" },
  button: {
    backgroundColor: "#AEE1F9",
    marginTop: 20,
    paddingVertical: 28,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  buttonText: { fontSize: 22, fontWeight: "bold" },
});
