import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useHumor } from "../app/context/HumorContext";

type PerguntaProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Pergunta({ visible, onClose }: PerguntaProps) {
  const [question, setQuestion] = useState("");
  const { setHumor } = useHumor();

  const questions = [
    "Você sorriu hoje?",
    "Você se sentiu bem consigo mesmo(a)?",
    "Você fez algo que te deixou feliz?",
    "Você fez algo que te deixou ansioso?",
    "Você fez algo que te deixou bravo?",
  ];

  useEffect(() => {
    if (visible) {
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];
      setQuestion(randomQuestion);
    }
  }, [visible]);

  const handleAnswer = (answer: "sim" | "nao") => {
    let mood: "feliz" | "triste" | "ansioso" | "bravo" = "feliz";

    if (question.includes("ansioso")) {
      mood = answer === "sim" ? "ansioso" : "feliz";
    } else if (question.includes("bravo")) {
      mood = answer === "sim" ? "bravo" : "feliz";
    } else {
      mood = answer === "sim" ? "feliz" : "triste";
    }

    setHumor(mood);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalBox}>
                    <Image
            source={require("../assets/img/pergunta.png")}
            style={styles.character}
            resizeMode="contain"
          />

          {/* Texto */}
          <Text style={styles.question}>{question}</Text>

          {/* Botões */}
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => handleAnswer("sim")} style={styles.btnWhite}>
              <Text style={styles.btnWhiteText}>Sim</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleAnswer("nao")} style={styles.btnWhite}>
              <Text style={styles.btnWhiteText}>Não</Text>
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
    backgroundColor: "#F6AFA3", 
    width: "80%",
    padding: 20,
    borderRadius: 25,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },

  character: {
    width: 160,
    height: 160,
    position: "absolute",
    top: -50,
    right: -30,
  },

  question: {
    fontSize: 28,
    color: "#333",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
    fontWeight: "600",
    lineHeight: 24,
    width: "70%",
  },

  buttons: {
    flexDirection: "row",
    gap: 10,
  },

  btnWhite: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  btnWhiteText: {
    fontSize: 25,
    color: "#555",
    fontWeight: "600",
  },
});



