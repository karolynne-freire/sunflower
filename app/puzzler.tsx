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

const level1 = [
  require("../assets/img/puzzle/primeiro/cobrinha1.png"),
  require("../assets/img/puzzle/primeiro/cobrinha2.png"),
];

const level2 = [
  require("../assets/img/puzzle/segundo/cobrinha1.png"),
  require("../assets/img/puzzle/segundo/cobrinha2.png"),
  require("../assets/img/puzzle/segundo/cobrinha3.png"),
  require("../assets/img/puzzle/segundo/cobrinha4.png"),
];

// 🔹 NÍVEL 3 – 6 peças (3x2)
const level3 = [
  require("../assets/img/puzzle/terceiro/cobrinha1.png"),
  require("../assets/img/puzzle/terceiro/cobrinha2.png"),
  require("../assets/img/puzzle/terceiro/cobrinha3.png"),
  require("../assets/img/puzzle/terceiro/cobrinha4.png"),
  require("../assets/img/puzzle/terceiro/cobrinha5.png"),
  require("../assets/img/puzzle/terceiro/cobrinha6.png"),
];

const LEVELS = [level1, level2, level3];

export default function Puzzler() {
  const [phase, setPhase] = useState<"intro" | "observe" | "play">("intro");
  const [level, setLevel] = useState(0);
  const [correctOrder, setCorrectOrder] = useState<ImageSourcePropType[]>([]);
  const [pieces, setPieces] = useState<ImageSourcePropType[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(4);

  const screenWidth = Dimensions.get("window").width;
  const boardSize = screenWidth * 0.9;

  useEffect(() => {
    setCorrectOrder(LEVELS[level]);
  }, [level]);

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
  }, [phase]);

  function startGame() {
    setLives(3);
    setPhase("observe");
  }

  function shuffle() {
    const shuffled = [...LEVELS[level]].sort(() => Math.random() - 0.5);
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

    if (win) {
      if (level === LEVELS.length - 1) {
        router.push({
          pathname: "/resultado",
          params: {
            status: "vitoria",
            mensagem: "Você concluiu todos os níveis! 🎉",
          },
        });
        return;
      }

      setLevel((prev) => prev + 1);
      setPhase("intro");
      return;
    }

    const newLives = lives - 1;
    setLives(newLives);

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

  function getGridStyle() {
    const size = LEVELS[level].length;

    if (size === 2) return { columns: 2, rows: 1 };
    if (size === 4) return { columns: 2, rows: 2 };
    return { columns: 3, rows: 2 };
  }

  const grid = getGridStyle();

  return (
    <View style={styles.container}>
      {phase !== "intro" && (
        <Text style={styles.phaseTitle}>Fase {level + 1}</Text>
      )}

      {phase === "intro" && (
        <View style={styles.center}>
          <Text style={styles.title}>Quebra-Cabeça</Text>
          <Text style={styles.subtitle}>
            Observe, memorize e depois monte 😊
          </Text>

          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* OBSERVE */}
      {phase === "observe" && (
        <View style={styles.center}>
          <Text style={styles.info}>Observe a figura correta 👀</Text>
          <Text style={styles.timer}>{timer}s</Text>

          <View style={[styles.board, { width: boardSize, height: boardSize }]}>
            {correctOrder.map((img, index) => (
              <Image
                key={index}
                source={img}
                style={{
                  width: boardSize / grid.columns - 20,
                  height: boardSize / grid.rows - 20,
                  borderRadius: 12,
                  margin: 5,
                }}
              />
            ))}
          </View>
        </View>
      )}

      {/* PLAY */}
      {phase === "play" && (
        <View style={styles.center}>
          <Text style={styles.lives}>
            Tentativas: {Array(lives).fill("❤️").join(" ")}
          </Text>

          <View style={[styles.board, { width: boardSize, height: boardSize }]}>
            {pieces.map((img, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.piece,
                  selected === index && styles.selected,
                  {
                    width: boardSize / grid.columns - 20,
                    height: boardSize / grid.rows - 20,
                  },
                ]}
                onPress={() => handleSelect(index)}
              >
                <Image source={img} style={styles.image} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#FAF8F0",
    alignItems:"center",
    justifyContent:"center"
  },

  center:{
    alignItems:"center",
    width:"95%"
  },

  phaseTitle:{
    fontSize:26,
    fontWeight:"bold",
    color:"#333",
    marginBottom:10
  },

  title:{
    fontSize:30,
    fontWeight:"bold",
    marginBottom:8
  },

  subtitle:{
    fontSize:20,
    marginBottom:14
  },

  info:{
    fontSize:22,
    fontWeight:"bold",
    marginBottom:10
  },

  timer:{
    fontSize:26,
    fontWeight:"bold",
    marginBottom:14
  },

  lives:{
    fontSize:20,
    fontWeight:"bold",
    marginBottom:14,
    color:"#FF4C4C"
  },

  board:{
    backgroundColor:"#fff",
    padding:10,
    borderRadius:20,
    elevation:5,
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"center"
  },

  piece:{
    margin:5
  },

  selected:{
    borderWidth:3,
    borderColor:"#FFD84C",
    borderRadius:12
  },

  image:{
    width:"100%",
    height:"100%",
    borderRadius:12
  },

  button:{
     backgroundColor:"#AEE1F9",
    marginTop:20,
    paddingVertical:28,
    paddingHorizontal:30,
    borderRadius:14
  },

  buttonText:{
    color:"#333",
    fontWeight:"bold",
    fontSize:20
  }
});