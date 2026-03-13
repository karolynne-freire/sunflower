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

const THEMES = [
  {
    id: 0,
    preview: require("../assets/img/cores.png"),
    levels: [
      [
        require("../assets/img/puzzle/primeiro/cores1.png"),
        require("../assets/img/puzzle/primeiro/cores2.png"),
      ],
      [
        require("../assets/img/puzzle/segundo/cores1.png"),
        require("../assets/img/puzzle/segundo/cores2.png"),
        require("../assets/img/puzzle/segundo/cores3.png"),
        require("../assets/img/puzzle/segundo/cores4.png"),
      ],
      [
        require("../assets/img/puzzle/terceiro/cores1.png"),
        require("../assets/img/puzzle/terceiro/cores2.png"),
        require("../assets/img/puzzle/terceiro/cores3.png"),
        require("../assets/img/puzzle/terceiro/cores4.png"),
        require("../assets/img/puzzle/terceiro/cores5.png"),
        require("../assets/img/puzzle/terceiro/cores6.png"),
        require("../assets/img/puzzle/terceiro/cores7.png"),
        require("../assets/img/puzzle/terceiro/cores8.png"),
        require("../assets/img/puzzle/terceiro/cores9.png"),
      ],
    ],
  },
  {
    id: 1,
    preview: require("../assets/img/cobrinha.png"),
    levels: [
      [
        require("../assets/img/puzzle/primeiro/cobrinha1.png"),
        require("../assets/img/puzzle/primeiro/cobrinha2.png"),
      ],
      [
        require("../assets/img/puzzle/segundo/cobrinha1.png"),
        require("../assets/img/puzzle/segundo/cobrinha2.png"),
        require("../assets/img/puzzle/segundo/cobrinha3.png"),
        require("../assets/img/puzzle/segundo/cobrinha4.png"),
      ],
      [
        require("../assets/img/puzzle/terceiro/cobrinha1.png"),
        require("../assets/img/puzzle/terceiro/cobrinha2.png"),
        require("../assets/img/puzzle/terceiro/cobrinha3.png"),
        require("../assets/img/puzzle/terceiro/cobrinha4.png"),
        require("../assets/img/puzzle/terceiro/cobrinha5.png"),
        require("../assets/img/puzzle/terceiro/cobrinha6.png"),
        require("../assets/img/puzzle/terceiro/cobrinha7.png"),
        require("../assets/img/puzzle/terceiro/cobrinha8.png"),
        require("../assets/img/puzzle/terceiro/cobrinha9.png"),
      ],
    ],
  },
  {
    id: 2,
    preview: require("../assets/img/memoria.png"),
    levels: [
      [
        require("../assets/img/puzzle/primeiro/memoria1.png"),
        require("../assets/img/puzzle/primeiro/memoria2.png"),
      ],
      [
        require("../assets/img/puzzle/segundo/memoria1.png"),
        require("../assets/img/puzzle/segundo/memoria2.png"),
        require("../assets/img/puzzle/segundo/memoria3.png"),
        require("../assets/img/puzzle/segundo/memoria4.png"),
      ],
      [
        require("../assets/img/puzzle/terceiro/memoria1.png"),
        require("../assets/img/puzzle/terceiro/memoria2.png"),
        require("../assets/img/puzzle/terceiro/memoria3.png"),
        require("../assets/img/puzzle/terceiro/memoria4.png"),
        require("../assets/img/puzzle/terceiro/memoria5.png"),
        require("../assets/img/puzzle/terceiro/memoria6.png"),
        require("../assets/img/puzzle/terceiro/memoria7.png"),
        require("../assets/img/puzzle/terceiro/memoria8.png"),
        require("../assets/img/puzzle/terceiro/memoria9.png"),
      ],
    ],
  },
];

export default function Puzzler() {
  const [phase, setPhase] = useState<
    "selection" | "intro" | "observe" | "play"
  >("selection");
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [level, setLevel] = useState(0);
  const [pieces, setPieces] = useState<ImageSourcePropType[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(4);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentLevelImages = THEMES[selectedTheme].levels[level];
  const totalPieces = currentLevelImages.length;
  const BOARD_WIDTH = Math.floor(width * 0.95);

  const isSolved =
    pieces.length > 0 &&
    pieces.every((img, i) => img === currentLevelImages[i]);

  let cardWidth = Math.floor(
    totalPieces === 2
      ? (BOARD_WIDTH - (isSolved ? 0 : 20)) / 2
      : totalPieces <= 4
        ? (BOARD_WIDTH - (isSolved ? 0 : 40)) / 2
        : (BOARD_WIDTH - (isSolved ? 0 : 40)) / 3,
  );

  let cardHeight = totalPieces === 2 ? Math.floor(cardWidth * 1.5) : cardWidth;

  const startPhase = () => {
    setLives(level === 2 ? 5 : 3);
    setPhase("observe");
    setIsProcessing(false);
  };

  const handleThemeChoice = (themeIndex: number) => {
    setSelectedTheme(themeIndex);
    setPhase("intro");
  };

  const resetToSelection = () => {
    setLevel(0);
    setPhase("selection");
    setPieces([]);
  };

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
    const base = [...currentLevelImages];
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
    if (phase !== "play" || isProcessing) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }

    const newPieces = [...pieces];
    [newPieces[selected], newPieces[index]] = [
      newPieces[index],
      newPieces[selected],
    ];
    setPieces(newPieces);
    setSelected(null);

    const checkWin = newPieces.every((img, i) => img === currentLevelImages[i]);

    if (!checkWin) {
      setLives((l) => {
        if (l <= 1) {
          setIsProcessing(true);
          setTimeout(() => {
            router.push({
              pathname: "/resultado",
              params: {
                status: "derrota",
                jogoId: "puzzler",
                niveisConcluidos: level,
              },
            });
          }, 1500);
          return 0;
        }
        return l - 1;
      });
    } else if (checkWin) {
      setIsProcessing(true);
      setTimeout(() => {
        if (level === THEMES[selectedTheme].levels.length - 1) {
          router.push({
            pathname: "/resultado",
            params: {
              status: "vitoria",
              jogoId: "puzzler",
              niveisConcluidos: 3,
              totalDoJogo: 3,
            },
          });
        } else {
          setLevel(level + 1);
          setPhase("intro");
          setIsProcessing(false);
        }
      }, 2500);
    }
  }

  const displayPieces = phase === "observe" ? currentLevelImages : pieces;

  return (
    <View style={styles.container}>
      {phase === "selection" && (
        <View style={styles.center}>
          <Text style={styles.instructionTitle}>Escolha um desenho!</Text>
          <View style={styles.selectionGrid}>
            {THEMES.map((theme, index) => (
              <TouchableOpacity
                key={theme.id}
                onPress={() => handleThemeChoice(index)}
                style={styles.themeCard}
              >
                <Image source={theme.preview} style={styles.themeImage} />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => router.back()}
          >
            <Text style={styles.exitButtonText}>Sair do Jogo</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === "intro" && (
        <View style={styles.center}>
          <Text style={styles.title}>Fase {level + 1}</Text>
          <Text style={styles.subtitle}>Vamos montar?</Text>

          <TouchableOpacity style={styles.button} onPress={startPhase}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={resetToSelection}>
            <Text style={styles.buttonText}>Escolher outro tema</Text>
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
                <Text style={styles.instructionTitle}>Sua vez!</Text>
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
                padding: isSolved ? 0 : 8,
                borderWidth: isSolved ? 0 : 1,
              },
            ]}
          >
            {displayPieces.map((img, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelect(i)}
                disabled={phase === "observe" || isProcessing}
                style={[
                  styles.card,
                  {
                    width: cardWidth,
                    height: cardHeight,
                    margin: isSolved ? 0 : 2,
                    borderWidth: isSolved ? 0 : 1,
                    borderRadius: isSolved ? 0 : 8,
                    backgroundColor: isSolved ? "transparent" : "#F9F9F9",
                  },
                  selected === i && styles.selectedCard,
                ]}
              >
                <Image
                  source={img}
                  style={styles.image}
                  resizeMode={isSolved ? "stretch" : "cover"}
                  fadeDuration={0}
                />
              </TouchableOpacity>
            ))}
          </View>

          {!isSolved && (
            <TouchableOpacity style={styles.button} onPress={resetToSelection}>
              <Text style={styles.buttonText}>Desistir e voltar</Text>
            </TouchableOpacity>
          )}
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
  center: { alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 26, marginBottom: 10 },
  textContainer: {
    marginBottom: 20,
    minHeight: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: { fontSize: 20, fontWeight: "600", color: "#666", marginTop: 5 },
  instructionTitle: { fontSize: 28, fontWeight: "bold", color: "#333" },
  livesSmall: { fontSize: 18, marginTop: 8 },
  board: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    elevation: 10,
    borderColor: "#7EC8E3",
    overflow: "hidden",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#EEE",
    overflow: "hidden",
  },
  selectedCard: { borderWidth: 3, borderColor: "#7EC8E3" },
  image: { width: "100%", height: "100%" },
  button: {
    backgroundColor: "#AEE1F9",
    width: 250,
    height: 80,
    marginTop: 20,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 14,
    elevation: 3,
  },
  buttonText: {
    color: "#333",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  exitButton: {
    backgroundColor: "#FFBABA",
    width: 250,
    height: 80,
    marginTop: 1,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 14,
    elevation: 3,
  },
  exitButtonText: {
    color: "#D8000C",
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
  },
  selectionGrid: {
    flexDirection: "column",
    marginTop: 20,
    alignItems: "center",
  },
  themeCard: {
    padding: 20,
    marginBottom: 20,
    width: 250,
    alignItems: "center",
    backgroundColor: "#AEE1F9",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#7EC8E3",
  },
  themeImage: { width: 150, height: 150, borderRadius: 10 },
});
