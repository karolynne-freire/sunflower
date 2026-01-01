import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GameHeader from "../components/game-header";
import GameLayout from "../components/game-layout";

// 🔹 SOMENTE NIVEL 1 (2 PEÇAS)
const puzzleImages: ImageSourcePropType[] = [
  require("../assets/img/puzzle/primeiro/cobrinha1.png"),
  require("../assets/img/puzzle/primeiro/cobrinha2.png"),
];

export default function Puzzler() {
  const [correctOrder] = useState(puzzleImages);
  const [pieces, setPieces] = useState<ImageSourcePropType[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    shuffle();
  }, []);

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

    // 🎉 GANHOU
    if (win) {
      router.push({
        pathname: "/resultado",
        params: {
          status: "vitoria",
          mensagem: "Você conseguiu montar o quebra-cabeça! 🎉",
        },
      });
      return;
    }

    // ❌ ERROU → perde tentativa
    const newLives = lives - 1;
    setLives(newLives);

    // 😢 PERDEU
    if (newLives <= 0) {
      router.push({
        pathname: "/resultado",
        params: {
          status: "derrota",
          mensagem: "Você usou todas as tentativas 😔",
        },
      });
    }
  }

  return (
    <GameLayout>
      <GameHeader title="Quebra-Cabeça" subtitle="Monte corretamente" />

      <Text style={styles.lives}>Tentativas restantes: {lives}</Text>

      <View style={styles.board}>
        {pieces.map((img, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.piece,
              selected === index && styles.selected,
            ]}
            onPress={() => handleSelect(index)}
          >
            <Image source={img} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={shuffle}>
        <Text style={styles.buttonText}>🔄 Embaralhar</Text>
      </TouchableOpacity>
    </GameLayout>
  );
}

const styles = StyleSheet.create({
  board: {
    width: 300,
    height: 350,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  lives: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  piece: {
    width: "50%",
    height: "100%",
    padding: 4,
  },

  selected: {
    borderWidth: 3,
    borderColor: "#facc15",
    borderRadius: 10,
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