import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GameHeader from "../components/game-header";
import GameLayout from "../components/game-layout";

const GRID_SIZE = 10;
const INITIAL_SPEED = 300;
const TARGET_APPLES = 4;

type Position = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Position>({ x: 2, y: 2 });
  const [lives, setLives] = useState(3);
  const [apples, setApples] = useState(0);

  const directionRef = useRef<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const snakeRef = useRef<Position[]>([{ x: 5, y: 5 }]);
  const foodRef = useRef<Position>({ x: 2, y: 2 });
  const applesRef = useRef(0); // Ref para contar as maçãs sem atraso de estado
  const gameLoop = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startGame();
    return stopGame;
  }, []);

  function startGame() {
    stopGame();
    gameLoop.current = setInterval(moveSnake, INITIAL_SPEED);
  }

  function stopGame() {
    if (gameLoop.current) clearInterval(gameLoop.current);
  }

  function randomFood(currentSnake: Position[]) {
    let newFood: Position;
    let isCollision;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isCollision = currentSnake.some(p => p.x === newFood.x && p.y === newFood.y);
    } while (isCollision);
    return newFood;
  }

  function moveSnake() {
    const head = { ...snakeRef.current[0] };
    const dir = directionRef.current;

    if (dir === "UP") head.y -= 1;
    if (dir === "DOWN") head.y += 1;
    if (dir === "LEFT") head.x -= 1;
    if (dir === "RIGHT") head.x += 1;

    // Colisão parede ou corpo
    if (
      head.x < 0 || head.x >= GRID_SIZE || 
      head.y < 0 || head.y >= GRID_SIZE ||
      snakeRef.current.some(p => p.x === head.x && p.y === head.y)
    ) {
      handleLoseLife();
      return;
    }

    const newSnake = [head, ...snakeRef.current];

    // Checar se comeu a fruta
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      // 1. Atualiza a contagem IMEDIATAMENTE no Ref e no State
      applesRef.current += 1;
      const currentCount = applesRef.current;
      setApples(currentCount);

      // 2. Checa vitória usando o valor atualizado
      if (currentCount >= TARGET_APPLES) {
        stopGame();
        // Pequeno timeout para o usuário ver a cobra encostando na fruta antes de mudar de tela
        setTimeout(() => {
            router.push({ 
                pathname: "/resultado", 
                params: { status: "vitoria", mensagem: "Você venceu a cobrinha! 🎉" } 
            });
        }, 100);
        return;
      }

      // Se não ganhou, gera nova comida
      const nextFood = randomFood(newSnake);
      foodRef.current = nextFood;
      setFood(nextFood);
      // Cobra cresce (não faz pop)
    } else {
      newSnake.pop(); // Movimento normal
    }

    snakeRef.current = newSnake;
    setSnake(newSnake);
  }

  function handleLoseLife() {
    setLives(prev => {
      const remaining = prev - 1;
      if (remaining <= 0) {
        stopGame();
        router.push({ 
            pathname: "/resultado", 
            params: { status: "derrota", mensagem: "Suas chances acabaram 😔" } 
        });
      }
      return remaining;
    });

    // Reset da lógica interna
    const resetPos = [{ x: 5, y: 5 }];
    const resetFood = randomFood(resetPos);
    
    snakeRef.current = resetPos;
    foodRef.current = resetFood;
    directionRef.current = "RIGHT";

    setSnake(resetPos);
    setFood(resetFood);
  }

  function changeDirection(dir: "UP" | "DOWN" | "LEFT" | "RIGHT") {
    const opposites = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (opposites[dir] === directionRef.current) return;
    directionRef.current = dir;
  }

  return (
    <GameLayout>
      <GameHeader title="Jogo da Cobrinha" subtitle="Nível 1" />
      <Text style={styles.info}>🍎 Frutas: {apples} / {TARGET_APPLES} | ❤️ Vidas: {lives}</Text>

      <View style={styles.board}>
        {Array.from({ length: GRID_SIZE }).map((_, y) => (
          <View key={y} style={styles.rowLayout}>
            {Array.from({ length: GRID_SIZE }).map((_, x) => {
              const isSnake = snake.some(p => p.x === x && p.y === y);
              const isFood = food.x === x && food.y === y;
              return (
                <View 
                  key={`${x}-${y}`} 
                  style={[styles.cell, isSnake && styles.snake, isFood && styles.food]} 
                />
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => changeDirection("UP")} style={styles.btn}><Text style={styles.btnText}>⬆️</Text></TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => changeDirection("LEFT")} style={styles.btn}><Text style={styles.btnText}>⬅️</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => changeDirection("RIGHT")} style={styles.btn}><Text style={styles.btnText}>➡️</Text></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => changeDirection("DOWN")} style={styles.btn}><Text style={styles.btnText}>⬇️</Text></TouchableOpacity>
      </View>
    </GameLayout>
  );
}

const styles = StyleSheet.create({
  info: { fontSize: 18, fontWeight: "bold", marginBottom: 5, textAlign: 'center' },
  board: { width: 300, height: 300, backgroundColor: "#CDECF5", borderRadius: 15, overflow: "hidden", marginVertical: 20, borderWidth: 2, borderColor: "#9ADAE6" },
  rowLayout: { flexDirection: 'row' },
  cell: { width: 30, height: 30, borderWidth: 0.5, borderColor: "#B0E0E6" },
  snake: { backgroundColor: "#22c55e" },
  food: { backgroundColor: "#ef4444" },
  controls: { alignItems: "center", gap: 10 },
  row: { flexDirection: "row", gap: 20 },
  btn: { backgroundColor: "#FFD84C", width: 60, height: 60, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  btnText: { fontSize: 30 },
});