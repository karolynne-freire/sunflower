import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GRID_SIZE = 10;

// ⚠️ metas acumulativas
const LEVELS = [
  { speed: 520, apples: 0 },   // Fase 1
  { speed: 400, apples: 4 },   // Fase 2
  { speed: 300, apples: 9 },   // Fase 3
  { speed: 350, apples: 14 },  // Fase 4 (base)
];

// ➕ maçãs extras só na fase final
const FINAL_EXTRA_APPLES = 6;

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export default function SnakeGame() {
  const [step, setStep] = useState<"intro" | "game" | "levelUp">("intro");
  const [level, setLevel] = useState(0);
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Position>({ x: 2, y: 2 });
  const [lives, setLives] = useState(3);
  const [apples, setApples] = useState(0);

  const directionRef = useRef<Direction>("RIGHT");
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const applesRef = useRef(0);
  const levelRef = useRef(0);

  const gameLoop = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { levelRef.current = level; }, [level]);

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
    } while (currentSnake.some(p => p.x === pos.x && p.y === pos.y));
    return pos;
  }

  function moveSnake() {
    const head = { ...snakeRef.current[0] };
    const dir = directionRef.current;

    if (dir === "UP") head.y--;
    if (dir === "DOWN") head.y++;
    if (dir === "LEFT") head.x--;
    if (dir === "RIGHT") head.x++;

    // colisão
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      snakeRef.current.some(p => p.x === head.x && p.y === head.y)
    ) {
      loseLife();
      return;
    }

    const newSnake = [head, ...snakeRef.current];

    // 🍎 comeu maçã
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      const newApples = applesRef.current + 1;
      applesRef.current = newApples;
      setApples(newApples);

      const currentLevel = LEVELS[levelRef.current];
      const nextLevel = LEVELS[levelRef.current + 1];

      // 🏆 ÚLTIMA FASE → precisa comer MAIS maçãs
      if (!nextLevel) {
        const finalTarget = currentLevel.apples + FINAL_EXTRA_APPLES;

        if (newApples >= finalTarget) {
          stopLoop();
          router.push("/resultado?status=vitoria");
          return;
        }
      }

      // ⬆️ passa de fase
      if (nextLevel && newApples >= nextLevel.apples) {
        stopLoop();
        setLevel(prev => prev + 1);
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

    setLives(l => {
      if (l - 1 <= 0) {
        router.push("/resultado?status=derrota");
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

      {step === "intro" && (
        <View style={styles.center}>
          <Text style={styles.title}>Fase {level + 1}</Text>
          <Text style={styles.text}>Vamos jogar?</Text>

          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "levelUp" && (
        <View style={styles.center}>
          <Text style={styles.title}>Fase {level + 1} 🎉</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setStep("game");
              startLoop(LEVELS[levelRef.current].speed);
            }}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "game" && (
        <>
          <Text style={styles.simpleMessage}>
            Coma todas as maças 🍎
          </Text>

          <Text style={styles.info}>
            🍎 {apples} | ❤️ {lives} | Fase {level + 1}
          </Text>

          <View style={styles.board}>
            {Array.from({ length: GRID_SIZE }).map((_, y) => (
              <View key={y} style={{ flexDirection: "row" }}>
                {Array.from({ length: GRID_SIZE }).map((_, x) => {
                  const isSnake = snake.some(p => p.x === x && p.y === y);
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

          <View style={styles.controls}>
            <TouchableOpacity onPress={() => changeDirection("UP")} style={styles.btn}>
              <Text style={styles.arrow}>⬆️</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", gap: 20 }}>
              <TouchableOpacity onPress={() => changeDirection("LEFT")} style={styles.btn}>
                <Text style={styles.arrow}>⬅️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeDirection("RIGHT")} style={styles.btn}>
                <Text style={styles.arrow}>➡️</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => changeDirection("DOWN")} style={styles.btn}>
              <Text style={styles.arrow}>⬇️</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#FAF8F0" 
  },
  center: { alignItems: "center" },
  title: { fontSize: 34, fontWeight: "bold", marginBottom: 6 },
  text: { fontSize: 26 },
  simpleMessage: { fontSize: 26, marginBottom: 10 },
  info: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  board: {
    width: 300,
    height: 300,
    backgroundColor: "#CDECF5",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#7EC8E3"
  },
  cell: {
    width: 30,
    height: 30,
    borderWidth: 0.5,
    borderColor: "#B0E0E6"
  },
  snake: { backgroundColor: "#22c55e" },
  food: { backgroundColor: "#ef4444" },
  controls: { marginTop: 20, alignItems: "center", gap: 10 },
  btn: {
    backgroundColor: "#AEE1F9",
    width: 80,
    height: 80,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#7EC8E3"
  },
  arrow: { fontSize: 32 },
  button: {
    backgroundColor: "#AEE1F9",
    marginTop: 20,
    paddingVertical: 28,
    paddingHorizontal: 30,
    borderRadius: 14
  },
  buttonText: { color: "#333", fontSize: 22, fontWeight: "bold" }
})