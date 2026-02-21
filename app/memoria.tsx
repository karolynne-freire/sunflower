import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type CardType = {
  id: number;
  img: any;
  flipped: boolean;
  matched: boolean;
};

export default function Memoria() {
  const [step, setStep] = useState<
    "intro" | "memorize" | "transition" | "game"
  >("intro");
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<CardType[]>([]);
  const [memorizeTime, setMemorizeTime] = useState(6);
  const [selected, setSelected] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);

  const TOTAL_LEVELS = 8;

  const allImages = [
    require("../assets/img/cobrinha.png"),
    require("../assets/img/cores.png"),
    require("../assets/img/memoria.png"),
    require("../assets/img/quebra.png"),
    require("../assets/img/pergunta.png"),
    require("../assets/img/bravo.png"),
    require("../assets/img/estrela.png"),
    require("../assets/img/feliz.png"),
    require("../assets/img/triste.png"),
  ];

  const memorizeByLevel = [5, 6, 7, 8, 10, 11, 12, 13];

  function getCardSize() {
    if (level <= 2) return SCREEN_WIDTH * 0.42;
    if (level <= 4) return SCREEN_WIDTH * 0.3;
    return SCREEN_WIDTH * 0.28;
  }

  const cardSize = getCardSize();

  function createCards() {
    const pairs = level + 1;
    const imgs = allImages.slice(0, pairs);

    const duplicated = [...imgs, ...imgs]
      .map((img, index) => ({
        id: index,
        img,
        flipped: step === "memorize",
        matched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(duplicated);
    setErrors(0);
    setSelected([]);
  }

  useEffect(() => {
    createCards();
  }, [level]);

  useEffect(() => {
    if (step === "memorize") {
      setMemorizeTime(memorizeByLevel[level - 1]);

      const timer = setInterval(() => {
        setMemorizeTime((old) => {
          if (old <= 1) {
            clearInterval(timer);
            setStep("transition");
            setTimeout(() => {
              setCards((prev) => prev.map((c) => ({ ...c, flipped: false })));
              setStep("game");
            }, 1200);
            return 0;
          }
          return old - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step]);

  function handleCardPress(id: number) {
    if (step !== "game") return;
    if (selected.length >= 2) return;

    const updated = cards.map((c) =>
      c.id === id && !c.flipped && !c.matched ? { ...c, flipped: true } : c,
    );

    setCards(updated);
    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [a, b] = newSelected;
      const cardA = updated.find((c) => c.id === a);
      const cardB = updated.find((c) => c.id === b);

      if (cardA?.img === cardB?.img) {
        const matchedCards = updated.map((c) =>
          c.img === cardA?.img ? { ...c, matched: true } : c,
        );
        setCards(matchedCards);

        if (matchedCards.every((c) => c.matched)) {
          setTimeout(() => {
            if (level === TOTAL_LEVELS) {
              router.push({
                pathname: "/resultado",
                params: {
                  status: "vitoria",
                  jogoId: "memoria",
                  niveisConcluidos: TOTAL_LEVELS,
                  totalDoJogo: TOTAL_LEVELS,
                },
              });
            } else {
              setLevel((prev) => prev + 1);
              setStep("intro");
            }
          }, 2500);
        }
      } else {
        setErrors((prev) => {
          const updatedErrors = prev + 1;
          if (updatedErrors >= 3) {
            setTimeout(() => {
              router.push({
                pathname: "/resultado",
                params: {
                  status: "derrota",
                  jogoId: "memoria",
                  niveisConcluidos: level - 1,
                  totalDoJogo: TOTAL_LEVELS,
                },
              });
            }, 2500);
          }
          return updatedErrors;
        });

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, flipped: false } : c,
            ),
          );
        }, 1500);
      }
      setTimeout(() => setSelected([]), 1600);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === "intro" && (
          <View style={styles.centerBox}>
            <Text style={styles.levelText}>Fase {level}</Text>
            <Text style={styles.simpleMessage}>Vamos jogar?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setStep("memorize")}
            >
              <Text style={styles.buttonText}>Começar</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "memorize" && (
          <View style={styles.centerBox}>
            <Text style={styles.simpleMessage}>Observe com calma 👀</Text>
            <Text style={styles.timerText}>{memorizeTime}s</Text>
            <View style={styles.grid}>
              {cards.map((card) => (
                <View
                  key={card.id}
                  style={[
                    styles.cardOpen,
                    { width: cardSize, height: cardSize },
                  ]}
                >
                  <Image
                    source={card.img}
                    style={{ width: cardSize * 0.8, height: cardSize * 0.8 }}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {step === "transition" && (
          <View style={styles.centerBox}>
            <Text style={styles.simpleMessage}>Agora é sua vez! 😄</Text>
            <Text style={styles.simpleMessage}>As cartas estão virando…</Text>
          </View>
        )}

        {step === "game" && (
          <View style={styles.centerBox}>
            <Text style={styles.simpleMessage}>Encontre os pares ⭐</Text>
            <Text style={styles.errorText}>Erros: {errors} / 3</Text>
            <View style={styles.grid}>
              {cards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  onPress={() => handleCardPress(card.id)}
                  activeOpacity={0.8}
                  style={[
                    card.flipped || card.matched
                      ? styles.cardOpen
                      : styles.cardClosed,
                    { width: cardSize, height: cardSize },
                  ]}
                >
                  {card.flipped || card.matched ? (
                    <Image
                      source={card.img}
                      style={{ width: cardSize * 0.8, height: cardSize * 0.8 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text
                      style={[styles.question, { fontSize: cardSize * 0.4 }]}
                    >
                      ?
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F0",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  centerBox: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  levelText: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 6,
  },
  simpleMessage: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
  },
  timerText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  errorText: {
    fontSize: 22,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#AEE1F9",
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 14,
  },
  buttonText: {
    color: "#333",
    fontSize: 22,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 5,
  },
  cardOpen: {
    margin: 5,
    backgroundColor: "#AEE1F9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#7EC8E3",
  },
  cardClosed: {
    margin: 5,
    backgroundColor: "#BDBDBD",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  question: {
    fontWeight: "bold",
    color: "#FFF",
  },
});
