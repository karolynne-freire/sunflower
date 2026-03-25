import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ModalConfirmacao from "../components/ModalConfirmacao";

const GRID_SIZE = 10;
const LEVELS = [
  { speed: 520, apples: 0 },
  { speed: 460, apples: 3 },
  { speed: 420, apples: 7 },
  { speed: 380, apples: 12 },
  { speed: 350, apples: 18 },
  { speed: 320, apples: 25 },
  { speed: 300, apples: 33 },
  { speed: 280, apples: 42 },
];

const TOTAL_LEVELS = LEVELS.length;

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export default function SnakeGame() {
  const [step, setStep] = useState<"intro" | "game" | "levelUp">("intro");
  const [level, setLevel] = useState(0);
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Position>({ x: 2, y: 2 });
  const [lives, setLives] = useState(3);
  const [apples, setApples] = useState(0);

  const [modalVisivel, setModalVisivel] = useState(false);

  const directionRef = useRef<Direction>("RIGHT");
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const applesRef = useRef(0);
  const levelRef = useRef(0);
  const gameLoop = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);
  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  const abrirModalSair = () => {
    stopLoop();
    setModalVisivel(true);
  };

  const confirmarSaida = () => {
    setModalVisivel(false);
    stopLoop();
    router.back();
  };

  const cancelarSaida = () => {
    setModalVisivel(false);
    if (step === "game") {
      startLoop(LEVELS[levelRef.current].speed);
    }
  };

  function startGame() {
    setSnake([{ x: 5, y: 5 }]);
    setFood(randomFood([{ x: 5, y: 5 }]));
    directionRef.current = "RIGHT";
    setStep("game");
    startLoop(LEVELS[levelRef.current].speed);
  }

  function startLoop(speed: number) {
    stopLoop();
    gameLoop.current = setInterval(moveSnake, speed);
  }

  function stopLoop() {
    if (gameLoop.current) clearInterval(gameLoop.current);
  }

  function randomFood(currentSnake: Position[]) {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((p) => p.x === pos.x && p.y === pos.y));
    return pos;
  }

  function moveSnake() {
    const head = { ...snakeRef.current[0] };
    const dir = directionRef.current;

    if (dir === "UP") head.y--;
    if (dir === "DOWN") head.y++;
    if (dir === "LEFT") head.x--;
    if (dir === "RIGHT") head.x++;

    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      snakeRef.current.some((p) => p.x === head.x && p.y === head.y)
    ) {
      loseLife();
      return;
    }

    const newSnake = [head, ...snakeRef.current];

    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      const newApples = applesRef.current + 1;
      applesRef.current = newApples;
      setApples(newApples);

      const currentLevel = LEVELS[levelRef.current];
      const nextLevel = LEVELS[levelRef.current + 1];

      if (!nextLevel && newApples >= currentLevel.apples) {
        stopLoop();
        router.push({
          pathname: "/resultado",
          params: {
            status: "vitoria",
            niveisConcluidos: TOTAL_LEVELS,
            totalDoJogo: TOTAL_LEVELS,
          },
        });
        return;
      }

      if (nextLevel && newApples >= nextLevel.apples) {
        stopLoop();
        setLevel((prev) => prev + 1);
        setStep("levelUp");
        return;
      }
      setFood(randomFood(newSnake));
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }

  function loseLife() {
    stopLoop();
    setLives((l) => {
      if (l - 1 <= 0) {
        router.push({
          pathname: "/resultado",
          params: {
            status: "derrota",
            niveisConcluidos: levelRef.current,
            totalDoJogo: TOTAL_LEVELS,
          },
        });
        return 0;
      }
      return l - 1;
    });
    setSnake([{ x: 5, y: 5 }]);
    setFood(randomFood([{ x: 5, y: 5 }]));
    directionRef.current = "RIGHT";
    setStep("intro");
  }

  function changeDirection(dir: Direction) {
    const opp = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (opp[dir] !== directionRef.current) {
      directionRef.current = dir;
    }
  }

  return (
    <View style={styles.container}>
      {/* HEADER PADRONIZADO */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={abrirModalSair}
        >
          <Text style={{ fontSize: 24 }}>⬅️</Text>
        </TouchableOpacity>

        {step === "game" && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreItem}>🍎 {apples}</Text>
            <Text style={styles.scoreItem}>❤️ {lives}</Text>
          </View>
        )}
      </View>

      {(step === "intro" || step === "levelUp") && (
        <View style={styles.center}>
          <Text style={styles.title}>Fase {level + 1}</Text>
          <Text style={styles.subtitle}>Vamos jogar?</Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "game" && (
        <View style={styles.gameArea}>
          <Text style={styles.instruction}>Coma as maçãs!</Text>

          <View style={styles.board}>
            {Array.from({ length: GRID_SIZE }).map((_, y) => (
              <View key={y} style={{ flexDirection: "row" }}>
                {Array.from({ length: GRID_SIZE }).map((_, x) => {
                  const isSnake = snake.some((p) => p.x === x && p.y === y);
                  const isFood = food.x === x && food.y === y;
                  return (
                    <View
                      key={`${x}-${y}`}
                      style={[
                        styles.cell,
                        isSnake && styles.snake,
                        isFood && styles.food,
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              onPress={() => changeDirection("UP")}
              style={styles.btn}
            >
              <Text style={styles.arrow}>▲</Text>
            </TouchableOpacity>

            <View style={styles.rowControls}>
              <TouchableOpacity
                onPress={() => changeDirection("LEFT")}
                style={styles.btn}
              >
                <Text style={styles.arrow}>◀</Text>
              </TouchableOpacity>

              <View style={styles.centerDot} />

              <TouchableOpacity
                onPress={() => changeDirection("RIGHT")}
                style={styles.btn}
              >
                <Text style={styles.arrow}>▶</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => changeDirection("DOWN")}
              style={styles.btn}
            >
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ModalConfirmacao
        visivel={modalVisivel}
        onConfirmar={confirmarSaida}
        onCancelar={cancelarSaida}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF8F0" },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    height: 120,
  },
  backIconButton: {
    width: 55,
    height: 55,
    backgroundColor: "#FFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#AEE1F9",
  },
  scoreContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#AEE1F9",
    gap: 15,
  },
  scoreItem: { fontSize: 18, fontWeight: "bold", color: "#333" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  gameArea: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 40, fontWeight: "bold", color: "#333", marginBottom: 5 },
  subtitle: { fontSize: 24, color: "#666", marginBottom: 20 },
  instruction: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#555",
  },
  board: {
    width: 300,
    height: 300,
    backgroundColor: "#CDECF5",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#7EC8E3",
    elevation: 8,
  },
  cell: {
    width: 30,
    height: 30,
    borderWidth: 0.5,
    borderColor: "#B0E0E6",
  },
  snake: { backgroundColor: "#22c55e", borderRadius: 4 },
  food: { backgroundColor: "#ef4444", borderRadius: 15 },

  controlsContainer: { marginTop: 30, alignItems: "center" },
  rowControls: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: -5,
  },
  centerDot: {
    width: 40,
    height: 40,
    backgroundColor: "#7EC8E3",
    borderRadius: 20,
    marginHorizontal: 10,
    opacity: 0.2,
  },
  btn: {
    backgroundColor: "#AEE1F9",
    width: 85,
    height: 85,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#7EC8E3",
    borderBottomWidth: 3,
    elevation: 5,
  },
  arrow: { fontSize: 60, color: "#05526e" },
  button: {
    backgroundColor: "#AEE1F9",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 18,
    minWidth: 250,
    alignItems: "center",
    elevation: 4,
  },
  buttonText: { color: "#333", fontSize: 24, fontWeight: "bold" },
});
