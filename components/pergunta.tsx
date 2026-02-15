import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHumor, Humor } from "../app/context/HumorContext";

type PerguntaProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Pergunta({ visible, onClose }: PerguntaProps) {
  const { setHumor } = useHumor();
  const [etapa, setEtapa] = useState<number>(0);

  const perguntasProfessor = [
    { infantil: "Você gosta quando os amigos te chamam para brincar?", emocao: "feliz" },
    { infantil: "Alguém já pegou um brinquedo seu sem pedir licença?", emocao: "bravo" },
    { infantil: "Você já ficou esperando muito tempo por uma surpresa?", emocao: "ansioso" },
  ];

  useEffect(() => {
    const verificarEtapa = async () => {
      const salvas = await AsyncStorage.getItem("@respostas_contagem");
      const lista = salvas ? JSON.parse(salvas) : [];
      setEtapa(lista.length < 3 ? lista.length : 0);
    };
    if (visible) verificarEtapa();
  }, [visible]);

  const handleAnswer = async (answer: "sim" | "nao") => {
    try {
      const salvas = await AsyncStorage.getItem("@respostas_contagem");
      let lista = salvas ? JSON.parse(salvas) : [];
      
      lista.push({ 
        emocao: perguntasProfessor[etapa].emocao, 
        confirmou: answer === "sim" 
      });
      
      await AsyncStorage.setItem("@respostas_contagem", JSON.stringify(lista));

      // Atualiza a barra de energia (33% por pergunta)
      const novaEnergia = Math.min((lista.length * 33.4), 100);
      await AsyncStorage.setItem("@energia_sunny", Math.round(novaEnergia).toString());

      // Lógica de Contexto
      if (lista.length >= 3) {
        const confirmadas = lista.filter((r: any) => r.confirmou);
        const final = confirmadas.length > 0 ? confirmadas[confirmadas.length - 1].emocao : "calmo";
        setHumor(final as Humor);
      } else {
        setHumor("calculando");
      }

      onClose();
    } catch (e) {
      console.log("Erro ao processar resposta:", e);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalBox}>
          <Image source={require("../assets/img/pergunta.png")} style={styles.character} resizeMode="contain" />
          <Text style={styles.question}>{perguntasProfessor[etapa]?.infantil}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => handleAnswer("sim")} style={styles.btnWhite}>
              <Text style={styles.btnText}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAnswer("nao")} style={styles.btnWhite}>
              <Text style={styles.btnText}>Não</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox: { backgroundColor: "#F6AFA3", width: "80%", padding: 20, borderRadius: 25, alignItems: "center" },
  character: { width: 150, height: 150, position: "absolute", top: -60, right: -20 },
  question: { fontSize: 24, color: "#333", textAlign: "center", marginTop: 40, marginBottom: 20, fontWeight: "600", width: "80%" },
  buttons: { flexDirection: "row", gap: 10 },
  btnWhite: { backgroundColor: "#FFF", paddingVertical: 10, paddingHorizontal: 25, borderRadius: 12, borderWidth: 1, borderColor: "#ddd" },
  btnText: { fontSize: 22, color: "#555", fontWeight: "600" },
});