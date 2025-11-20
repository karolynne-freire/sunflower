import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useHumor } from "../app/context/HumorContext";

// Tipagem correta das props
type PerguntaProps = {
  visible: boolean;     // controla abertura do modal
  onClose: () => void;  // função para fechar e continuar fluxo
};

export default function Pergunta({ visible, onClose }: PerguntaProps) {
  const [question, setQuestion] = useState("");
  const { setHumor } = useHumor();

  const questions = [
    "Você sorriu hoje?",
    "Você se sentiu bem consigo mesmo(a)?",
    "Você fez algo que te deixou feliz?",
  ];

  // Escolhe pergunta aleatória quando o modal abre
  useEffect(() => {
    if (visible) {
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];
      setQuestion(randomQuestion);
    }
  }, [visible]);

  const handleAnswer = (answer: "sim" | "nao") => {
    const mood = answer === "sim" ? "feliz" : "triste";
    setHumor(mood);
    onClose(); // fecha modal e volta pro fluxo (ex: Home)
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
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
  );
}

const styles = StyleSheet.create({
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
    width: "80%",
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

