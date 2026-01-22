import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

/* =======================
   IMAGENS POR NÍVEL
======================= */
const level1 = [
  require("../assets/img/puzzle/primeiro/cores1.png"),
  require("../assets/img/puzzle/primeiro/cores2.png"),
];

const level2 = [
  require("../assets/img/puzzle/segundo/cores1.png"),
  require("../assets/img/puzzle/segundo/cores2.png"),
  require("../assets/img/puzzle/segundo/cores3.png"),
  require("../assets/img/puzzle/segundo/cores4.png"),
];

const level3 = [
  require("../assets/img/puzzle/terceiro/cores1.png"),
  require("../assets/img/puzzle/terceiro/cores2.png"),
  require("../assets/img/puzzle/terceiro/cores3.png"),
  require("../assets/img/puzzle/terceiro/cores4.png"),
  require("../assets/img/puzzle/terceiro/cores5.png"),
  require("../assets/img/puzzle/terceiro/cores6.png"),
  require("../assets/img/puzzle/terceiro/cores7.png"),
  require("../assets/img/puzzle/terceiro/cores8.png"),
  require("../assets/img/puzzle/terceiro/cores9.png"),
];

const LEVELS = [level1, level2, level3];

export default function Puzzler() {
  const [phase, setPhase] = useState<"intro" | "observe" | "play">("intro");
  const [level, setLevel] = useState(0);
  const [pieces, setPieces] = useState<ImageSourcePropType[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(4);

  /* =======================
     LÓGICA DE INÍCIO DE FASE
  ======================= */
  const startPhase = () => {
    // Definir vidas baseado no nível: Nível 3 (índice 2) ganha 5 vidas
    if (level === 2) {
      setLives(5);
    } else {
      setLives(3);
    }
    setPhase("observe");
  };

  /* =======================
     LÓGICA DE DIMENSÃO
  ======================= */
  const totalPieces = LEVELS[level].length;
  const BOARD_WIDTH = width * 0.95;

  let cardWidth = 0;
  let cardHeight = 0;

  if (totalPieces === 2) {
    cardWidth = (BOARD_WIDTH - 10) / 2;
    cardHeight = cardWidth * 1.5;
  } else if (totalPieces <= 4) {
    cardWidth = (BOARD_WIDTH - 80) / 2;
    cardHeight = cardWidth;
  } else {
    cardWidth = (BOARD_WIDTH - 90) / 3;
    cardHeight = cardWidth;
  }

  useEffect(() => {
    if (phase === "observe") {
      setTimer(4);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            shuffle();
            setPhase("play");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase, level]);

  function shuffle() {
    const base = [...LEVELS[level]];
    let shuffled = [...base];
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (shuffled.every((img, i) => img === base[i]));
    setPieces(shuffled);
    setSelected(null);
  }

  function handleSelect(index: number) {
    if (selected === null) {
      setSelected(index);
      return;
    } else {
      setLives((l) => {
        if (l <= 1) {
          // DERROTA
          router.push({
            pathname: "/resultado",
            params: {
              status: "derrota",
              jogoId: "puzzler",
              niveisConcluidos: level, // Se perdeu no nível 1 (index 0), concluiu 0. Se no nível 2 (index 1), concluiu 1.
            },
          });
          return 0;
        }
        return l - 1;
      });
    }

    const newPieces = [...pieces];
    [newPieces[selected], newPieces[index]] = [
      newPieces[index],
      newPieces[selected],
    ];
    setPieces(newPieces);
    setSelected(null);

    if (newPieces.every((img, i) => img === LEVELS[level][i])) {
      if (level === LEVELS.length - 1) {
        // VITÓRIA TOTAL
        router.push({
          pathname: "/resultado",
          params: {
            status: "vitoria",
            jogoId: "puzzler", // ID que definimos na config do resultado
            niveisConcluidos: 3,
            totalDoJogo: 3, // Envia 4 para marcar 100%
          },
        });
      } else {
        setLevel(level + 1);
        setPhase("intro");
      }
    }
  }

  const displayPieces = phase === "observe" ? LEVELS[level] : pieces;

  return (
    <View style={styles.container}>
      {phase === "intro" && (
        <View style={styles.center}>
          <Text style={styles.title}>Fase {level + 1}</Text>
          <Text style={styles.subtitle}> Vamos jogar? </Text>
          <TouchableOpacity style={styles.button} onPress={startPhase}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      )}

      {(phase === "observe" || phase === "play") && (
        <View style={styles.center}>
          <View style={styles.textContainer}>
            {phase === "observe" ? (
              <View style={styles.center}>
                <Text style={styles.instructionTitle}>
                  Observe com calma 👀
                </Text>
                <Text style={styles.infoText}>Memorize: {timer}s</Text>
              </View>
            ) : (
              <View style={styles.center}>
                <Text style={styles.instructionTitle}>Agora é sua vez!</Text>
                <Text style={styles.instructionSub}>
                  Toque em uma peça e na outra para trocar
                </Text>
                <Text style={styles.livesSmall}>
                  Vidas: {"❤️".repeat(lives)}
                </Text>
              </View>
            )}
          </View>

          <View
            style={[
              styles.board,
              {
                width: BOARD_WIDTH,
                flexWrap: totalPieces === 2 ? "nowrap" : "wrap",
              },
            ]}
          >
            {displayPieces.map((img, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelect(i)}
                disabled={phase === "observe"}
                style={[
                  styles.card,
                  {
                    width: cardWidth,
                    height: cardHeight,
                    margin: totalPieces === 2 ? 4 : 8,
                  },
                  selected === i && styles.selectedCard,
                ]}
              >
                <Image
                  source={img}
                  style={styles.image}
                  resizeMode={totalPieces === 2 ? "contain" : "cover"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 26,
    marginBottom: 10,
  },
  textContainer: {
    marginBottom: 20,
    minHeight: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 5,
  },
  instructionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  instructionSub: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  livesSmall: {
    fontSize: 18,
    marginTop: 8,
  },
  board: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#7EC8E3",
  },
  card: {
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F9F9F9",
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: "#7EC8E3",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#AEE1F9",
    marginTop: 20,
    paddingVertical: 28,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  buttonText: { color: "#333", fontSize: 22, fontWeight: "bold" },
});
