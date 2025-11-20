import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLORS = [
  { id: "vermelho", color: "#FEB2B2" },
  { id: "amarelo", color: "#FFF5A1" },
  { id: "verde", color: "#C6F6D5" },
  { id: "azul", color: "#BEE3F8" },
];
const INITIAL_SEQUENCE_LENGTH = 4;

export default function JogoCores() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showSequence, setShowSequence] = useState(true);
  const [lives, setLives] = useState(3);
  const [currentSequenceLength, setCurrentSequenceLength] = useState(
    INITIAL_SEQUENCE_LENGTH
  );

  const generateSequence = () => {
    const seq: string[] = [];
    for (let i = 0; i < currentSequenceLength; i++) {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      seq.push(randomColor.id);
    }
    setSequence(seq);
    setUserAnswer([]);
    setShowSequence(true);
    const displayTime = Math.max(2500, currentSequenceLength * 700);
    setTimeout(() => setShowSequence(false), displayTime);
  };

  useEffect(() => {
    generateSequence();
  }, [currentSequenceLength]);

  const handleSelect = (id: string) => {
    if (showSequence || lives <= 0) return;

    const updatedUserAnswer = [...userAnswer, id];
    setUserAnswer(updatedUserAnswer);

    if (updatedUserAnswer.length === sequence.length) {
      const isCorrect = updatedUserAnswer.every((v, i) => v === sequence[i]);

      if (isCorrect) {
        if (currentSequenceLength >= 6) {
          router.push("/resultado?status=vitoria");
          return;
        }
        setTimeout(() => setCurrentSequenceLength((prev) => prev + 1), 1000);
      } else {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          router.push("/resultado?status=derrota");
        } else {
          setTimeout(() => generateSequence(), 1000);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memorize a sequência</Text>
      <Text style={styles.lives}>Vidas: {Array(lives).fill("❤️").join(" ")}</Text>
      <Text style={styles.info}>Rodada: {currentSequenceLength} Cores</Text>

      <View style={styles.sequenceRow}>
        {sequence.map((id, index) => {
          const color = COLORS.find((c) => c.id === id)?.color;
          return (
            <View
              key={index}
              style={[
                styles.box,
                {
                  backgroundColor: showSequence ? color : "#fff",
                  opacity: showSequence ? 1 : 0.2,
                  borderColor: "#fff",
                },
              ]}
            />
          );
        })}
      </View>

      <Text style={styles.subtitle}>
        {showSequence ? "👀 Olhe bem!" : "Sua vez! Escolha as cores:"}
      </Text>

      <View style={styles.answerRow}>
        {Array(sequence.length)
          .fill(null)
          .map((_, i) => {
            const colorId = userAnswer[i];
            const color = COLORS.find((c) => c.id === colorId)?.color;

            let borderColor = "#ccc";
            if (colorId) {
              if (colorId === sequence[i]) borderColor = "#4CAF50";
              else borderColor = "#FF3D3D";
            }

            return (
              <View
                key={i}
                style={[
                  styles.box,
                  {
                    backgroundColor: color ? color : "#f0f0f0",
                    borderColor,
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
            disabled={showSequence || lives <= 0 || userAnswer.length >= sequence.length}
          >
            <Text style={styles.buttonText}>{c.id.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
    color: "#333",
  },
  lives: {
    fontSize: 22,
    color: "#FF4C4C",
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 20,
    color: "#555",
    textAlign: "center",
  },
  sequenceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  answerRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  box: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#ccc",
  },
 buttonsRow: {
  flexDirection: "row",
  gap: 20, 
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: 30, 
},
colorButton: {
  width: 140, 
  height: 80, 
  borderRadius: 25, 
  alignItems: "center",
  justifyContent: "center",
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 6,
},
buttonText: {
  color: "#333",
  fontWeight: "700",
  fontSize: 20, // aumenta o texto
},

});
