import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const [currentSequenceLength, setCurrentSequenceLength] = useState(INITIAL_SEQUENCE_LENGTH);
  const [timeLeft, setTimeLeft] = useState(4);
  const [phase, setPhase] = useState<"intro" | "memorize" | "play">("intro");

  const getGamePhaseName = () => {
    if (currentSequenceLength === 4) return "Fase 1";
    if (currentSequenceLength === 5) return "Fase 2";
    return "Fase 3";
  };

  function startGame() {
    generateSequence();
    setPhase("memorize");
  }

  const generateSequence = () => {
    const seq: string[] = [];
    for (let i = 0; i < currentSequenceLength; i++) {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      seq.push(randomColor.id);
    }

    setSequence(seq);
    setUserAnswer([]);
    setShowSequence(true);
    setTimeLeft(4);
  };

  useEffect(() => {
    if (phase === "memorize") {
      setTimeLeft(4);
      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t === 1) {
            clearInterval(timer);
            setShowSequence(false);
            setPhase("play");
          }
          return t - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [phase]);

  useEffect(() => {
    generateSequence();
  }, [currentSequenceLength]);

  const handleSelect = (id: string) => {
    if (showSequence || lives <= 0 || phase !== "play") return;

    const updatedUserAnswer = [...userAnswer, id];
    setUserAnswer(updatedUserAnswer);

    if (updatedUserAnswer.length === sequence.length) {
      const isCorrect = updatedUserAnswer.every((v, i) => v === sequence[i]);

      if (isCorrect) {
        if (currentSequenceLength >= 6) {
          router.push("/resultado?status=vitoria");
          return;
        }

        setTimeout(() => {
          setCurrentSequenceLength((prev) => prev + 1);
          setPhase("intro");
        }, 900);
      } else {
        const newLives = lives - 1;
        setLives(newLives);

        if (newLives <= 0) {
          router.push("/resultado?status=derrota");
        } else {
          setTimeout(() => {
            generateSequence();
            setPhase("memorize");
          }, 900);
        }
      }
    }
  };

  const screenWidth = Dimensions.get("window").width;

  const boxSize =
    currentSequenceLength <= 4
      ? screenWidth * 0.24
      : currentSequenceLength === 5
      ? screenWidth * 0.22
      : screenWidth * 0.20;

  return (
    <View style={styles.container}>

      {phase === "intro" && (
        <View style={styles.center}>
          <Text style={styles.phaseText}>{getGamePhaseName()}</Text>
          <Text style={styles.subtitle}>Vamos jogar ? </Text>

          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FASE: MEMORIZAR */}
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

      {/* SUA VEZ */}
      {phase === "play" && (
        <View style={styles.center}>
          <Text style={styles.title}>Agora é sua vez! ⭐</Text>
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
                          <Text style={styles.lives}>Vidas: {Array(lives).fill("❤️").join(" ")}</Text>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#FAF8F0",
    alignItems:"center",
    justifyContent:"center"
  },

  center:{
    width:"95%",
    alignItems:"center"
  },

  phaseText:{
    color:"#333",
    fontSize:34,
    fontWeight:"bold",
    marginBottom:6
  },

  title:{
    fontSize:26,
    marginBottom:10
  },

  subtitle:{
    fontSize:22,
    marginBottom:14
  },

  timer:{
    fontSize:30,
    fontWeight:"bold",
    marginBottom:18
  },

  lives:{
    fontSize:22,
    marginBottom:12,
    marginTop:30,
    color:"#FF4C4C",
    fontWeight:"bold"
  },

  sequenceRow:{
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"center",
    gap:14,
    marginTop:10
  },

  answerRow:{
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"center",
    gap:14,
    marginVertical:20
  },

  box:{
    borderRadius:22,
    borderWidth:2,
    borderColor:"#a0c3d07d"
  },

  buttonsRow:{
    flexDirection:"row",
    gap:16,
    flexWrap:"wrap",
    justifyContent:"center",
    marginTop:10
  },

  colorButton:{
    width:155,
    height:80,
    borderRadius:10,
    alignItems:"center",
    justifyContent:"center",
    borderWidth:2,
    borderColor:"#a0c3d07d"
  },

  buttonLabel:{
    fontWeight:"bold",
    fontSize:18,
    color:"#333"
  },

  button:{
    backgroundColor:"#AEE1F9",
    marginTop:20,
    paddingVertical:28,
    paddingHorizontal:30,
    borderRadius:14
  },

  buttonText:{
    color:"#333",
    fontSize:22,
    fontWeight:"bold"
  }
});