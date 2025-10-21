import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PerguntaEmocional() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [mood, setMood] = useState<"feliz" | "triste" | null>(null);
  const [question, setQuestion] = useState<string>("");

  const questions: string[] = [
    "Você sorriu hoje?",
    "Você se sentiu bem consigo mesmo(a)?",
    "Você fez algo que te deixou feliz?",
  ];

  // Faz o modal aparecer de tempos em tempos
  useEffect(() => {
    const interval = setInterval(() => {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      setQuestion(randomQuestion);
      setShowModal(true);
    }, 15000); // aparece a cada 15 segundos

    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (answer: "sim" | "nao") => {
    setMood(answer === "sim" ? "feliz" : "triste");
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {mood === "feliz" && (
        <Image source={require("../assets/img/feliz.png")} style={styles.image} />
      )}

      {mood === "triste" && (
        <Image source={require("../assets/img/triste.png")} style={styles.image} />
      )}

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.question}>{question}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity
                onPress={() => handleAnswer("sim")}
                style={[styles.btn, { backgroundColor: "#4CAF50" }]}
              >
                <Text style={styles.btnText}>Sim</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleAnswer("nao")}
                style={[styles.btn, { backgroundColor: "#f44336" }]}
              >
                <Text style={styles.btnText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  question: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    width: 80,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});
