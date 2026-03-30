import React from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface ModalConfirmacaoProps {
  visivel: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
  mensagem?: string;
}

export default function ModalConfirmacao({
  visivel,
  onConfirmar,
  onCancelar,
  mensagem,
}: ModalConfirmacaoProps) {
  return (
    <Modal visible={visivel} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.texto}>{mensagem || "Sair do jogo ?"}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.btn, styles.btnFicar]}
              onPress={onCancelar}
            >
              <Text style={styles.btnText}>Não </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSair]}
              onPress={onConfirmar}
            >
              <Text style={styles.btnSairText}>Sim </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
  },
  texto: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: "column",
    width: "100%",
    gap: 12,
  },
  btn: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  btnFicar: {
    backgroundColor: "#AEE1F9",
  },
  btnSair: {
    backgroundColor: "#FFBABA",
    borderWidth: 1,
    borderColor: "#FF6347",
  },
  btnText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  btnSairText: { fontSize: 18, fontWeight: "bold", color: "#D8000C" },
});
