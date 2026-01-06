import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageStyle,
  StyleSheet as RNStyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

import GameHeader from "../components/game-header";
import GameLayout from "../components/game-layout";

type Card = {
  id: number;
  img: any;
  flipped: boolean;
  matched: boolean;
};

// 🔥 IMAGENS
const levelImages = [
  [
    require("../assets/img/cobrinha.png"),
    require("../assets/img/cores.png"),
  ],
  [
    require("../assets/img/cobrinha.png"),
    require("../assets/img/cores.png"),
    require("../assets/img/memoria.png"),
  ],
  [
    require("../assets/img/cobrinha.png"),
    require("../assets/img/cores.png"),
    require("../assets/img/memoria.png"),
    require("../assets/img/quebra.png"),
  ],
  [
    require("../assets/img/cobrinha.png"),
    require("../assets/img/cores.png"),
    require("../assets/img/memoria.png"),
    require("../assets/img/quebra.png"),
    require("../assets/img/pergunta.png"),
  ],
];

export default function JogoMemoria() {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [errors, setErrors] = useState(0);
  const [showLevelMsg, setShowLevelMsg] = useState(true);

  const maxLevel = 4;

  function startLevel(currentLevel: number) {
    const imgs = levelImages[currentLevel - 1];
    const duplicated = [...imgs, ...imgs];

    const shuffled = duplicated
      .map((img, index) => ({
        id: index,
        img,
        flipped: false,
        matched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setMatchedPairs(0);
    setSelected([]);
    setShowLevelMsg(true);

    setTimeout(() => setShowLevelMsg(false), 1500);
  }

  useEffect(() => {
    startLevel(level);
  }, [level]);

  const handlePress = (card: Card) => {
    if (selected.length === 2 || card.flipped || card.matched) return;

    const flippedCards = cards.map((c) =>
      c.id === card.id ? { ...c, flipped: true } : c
    );
    setCards(flippedCards);

    const newSelected = [...selected, { ...card, flipped: true }];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;

      if (first.img === second.img) {
        setCards((prev) =>
          prev.map((c) =>
            c.img === first.img ? { ...c, matched: true } : c
          )
        );
        setMatchedPairs((prev) => prev + 1);
        setSelected([]);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id
                ? { ...c, flipped: false }
                : c
            )
          );
          setSelected([]);
        }, 800);
        setErrors((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    const totalPairs = levelImages[level - 1].length;

    if (matchedPairs === totalPairs) {
      if (level === maxLevel) {
        router.push("/resultado?status=vitoria");
      } else {
        setLevel((prev) => prev + 1);
      }
    }

    if (errors >= 3) {
      router.push("/resultado?status=derrota");
    }
  }, [matchedPairs, errors]);


  return (
    <GameLayout>
      <GameHeader title="Jogo da Memória" subtitle={`Nível ${level}`} />

      {showLevelMsg && (
        <View style={styles.levelBox}>
          <Text style={styles.levelText}>Nível {level}</Text>
        </View>
      )}

      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => handlePress(card)}
            activeOpacity={0.8}
          >
            {card.flipped || card.matched ? (
              <Image source={card.img} style={styles.image} />
            ) : (
              <View style={styles.cover} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.info}>Erros: {errors} / 3</Text>
    </GameLayout>
  );
}


// ---------------- STYLES FIXADOS ----------------

type Styles = {
  grid: ViewStyle;
  card: ViewStyle;
  cover: ViewStyle;
  image: ImageStyle;
  info: TextStyle;
  levelBox: ViewStyle;
  levelText: TextStyle;
};

const styles = RNStyleSheet.create<Styles>({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%",
  },

  card: {
    width: 150,
    height: 150,
    margin: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#AEE1F9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CDECF5",
  },

  cover: {
    width: "100%",
    height: "100%",
    backgroundColor: "#AEE1F9",
    borderRadius: 15,
  },

  image: {
    width: 100,
    height: 100,
  },

  info: {
    marginTop: 20,
    fontSize: 25,
    color: "#333",
  },

  levelBox: {
    ...RNStyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999,
  },

  levelText: {
    backgroundColor: "#FEB2B2",
    padding: 20,
    borderRadius: 10,
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
  },
});
