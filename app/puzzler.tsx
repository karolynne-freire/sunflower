import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const level1: ImageSourcePropType[] = [
  require("../assets/img/puzzle/primeiro/cobrinha1.png"),
  require("../assets/img/puzzle/primeiro/cobrinha2.png"),
];

const level2: ImageSourcePropType[] = [
  require("../assets/img/puzzle/segundo/cobrinha1.png"),
  require("../assets/img/puzzle/segundo/cobrinha2.png"),
  require("../assets/img/puzzle/segundo/cobrinha3.png"),
  require("../assets/img/puzzle/segundo/cobrinha4.png"),
];

export default function Puzzler() {
  const [level, setLevel] = useState(1);
  const [correctOrder, setCorrectOrder] = useState<ImageSourcePropType[]>([]);
  const [pieces, setPieces] = useState<ImageSourcePropType[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (level === 1) setCorrectOrder(level1);
    if (level === 2) setCorrectOrder(level2);
  }, [level]);

  useEffect(() => {
    if (correctOrder.length > 0) shuffle();
  }, [correctOrder]);

  function shuffle() {
    const shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setSelected(null);
  }

  function handleSelect(index: number) {
    if (selected === null) {
      setSelected(index);
    } else {
      swapPieces(selected, index);
      setSelected(null);
    }
  }

  function swapPieces(i: number, j: number) {
    const newPieces = [...pieces];
    [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
    setPieces(newPieces);
    checkWin(newPieces);
  }

  function checkWin(arr: ImageSourcePropType[]) {
    const win = arr.every((img, index) => img === correctOrder[index]);

    if (!win) return;

    if (level === 1) {
      Alert.alert("Muito bem! 🎉", "Vamos para o nível 2!", [
        { text: "Continuar", onPress: () => setLevel(2) },
      ]);
    } else {
      Alert.alert("Parabéns 🎉", "Você completou todos os níveis!");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🧩 Quebra-Cabeça — Nível {level}</Text>
      </View>

      <View style={styles.card}>
        <View style={[styles.board, level === 1 && { flexDirection: "row" }]}>
          {pieces.map((img, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.piece,
                level === 1 && styles.level1Piece,
                level === 2 && styles.level2Piece,
                selected === index && styles.selected,
              ]}
              onPress={() => handleSelect(index)}
            >
              <Image source={img} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={shuffle}>
        <Text style={styles.buttonText}>🔄 Embaralhar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF8F0",
    paddingTop: 20,
  },

  header: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  back: {
    fontSize: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#CDECF5",
    width: 340,
    height: 360,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },

  board: {
    width: 300,
    height: 300,
    flexWrap: "wrap",
  },

  level1Piece: {
    width: "50%",
    height: "100%",
    padding: 4,
  },

  level2Piece: {
    width: "50%",
    height: "50%",
    padding: 4,
  },

  selected: {
    borderWidth: 3,
    borderColor: "#facc15",
    borderRadius: 10,
  },

  piece: {
    padding: 4,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  button: {
    marginTop: 30,
    backgroundColor: "#FFD84C",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 15,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5A3A00",
  },
});