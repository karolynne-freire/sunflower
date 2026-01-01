import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import PerguntaEmocional from "../components/pergunta";

export default function Resultado() {
  const { status, mensagem } = useLocalSearchParams();

  const isVitoria = status === "vitoria";

  const [showModal, setShowModal] = useState(false);

  // ABRE O MODAL EM 2s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowModal(false);
    router.push("/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isVitoria ? "Parabéns! Você venceu!" : "Ops! Você perdeu!"}
      </Text>

      {/* MENSAGEM PERSONALIZADA DO JOGO */}
      {mensagem && (
        <Text style={styles.messageText}>{mensagem}</Text>
      )}

      <Image
        source={
          isVitoria
            ? require("../assets/img/feliz.png")
            : require("../assets/img/triste.png")
        }
        style={styles.image}
      />

      <PerguntaEmocional visible={showModal} onClose={handleClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF8F0",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  messageText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
});
