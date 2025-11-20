import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Card = {
  id: number;
  img: any;
  flipped: boolean;
  matched: boolean;
};

const images = [
  require("../assets/img/cobrinha.png"),
  require("../assets/img/cores.png"),
];

export default function JogoMemoria() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [errors, setErrors] = useState(0);

  useEffect(() => {
    const duplicated = [...images, ...images];
    const shuffled = duplicated
      .map((img, index) => ({
        id: index,
        img,
        flipped: false,
        matched: false,
      }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

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
        }, 1000);
        setErrors((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs === images.length) {
      router.push("/resultado?status=vitoria");
    } else if (errors >= 3) {
      router.push("/resultado?status=derrota");
    }
  }, [matchedPairs, errors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Memória</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#333",
    marginBottom: 30,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%",
  },
  card: {
    width: 120,
    height: 120,
    margin: 10,
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
    width: 80,
    height: 80,
  },
  info: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
});

