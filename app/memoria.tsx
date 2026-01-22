import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CardType = {
  id: number;
  img: any;
  flipped: boolean;
  matched: boolean;
};

export default function Memoria() {
  const [step, setStep] = useState<"intro" | "memorize" | "transition" | "game">("intro");
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<CardType[]>([]);
  const [memorizeTime, setMemorizeTime] = useState(5);
  const [selected, setSelected] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);

  const maxLevel = 4;

  const imageLevels = [
    [require("../assets/img/cobrinha.png"), require("../assets/img/cores.png")],
    [require("../assets/img/cobrinha.png"), require("../assets/img/cores.png"), require("../assets/img/memoria.png")],
    [require("../assets/img/cobrinha.png"), require("../assets/img/cores.png"), require("../assets/img/memoria.png"), require("../assets/img/quebra.png")],
    [require("../assets/img/cobrinha.png"), require("../assets/img/cores.png"), require("../assets/img/memoria.png"), require("../assets/img/quebra.png"), require("../assets/img/pergunta.png")]
  ];

  function getCardSize() {
    if (level === 1) return 150;
    if (level === 2) return 130;
    if (level === 3) return 115;
    return 100;
  }

  const cardSize = getCardSize();

  function createCards() {
    const imgs = imageLevels[level - 1];
    const duplicated = [...imgs, ...imgs]
      .map((img, index) => ({
        id: index,
        img,
        flipped: step === "memorize",
        matched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(duplicated);
    setErrors(0);
  }

  useEffect(() => {
    createCards();
  }, [level]);

  useEffect(() => {
    if (step === "memorize") {
      setMemorizeTime(5);
      const timer = setInterval(() => {
        setMemorizeTime(old => {
          if (old === 1) {
            clearInterval(timer);
            setStep("transition");
            setTimeout(() => {
              const hidden = cards.map(c => ({ ...c, flipped: false }));
              setCards(hidden);
              setStep("game");
            }, 900);
          }
          return old - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  function handleCardPress(id: number) {
    if (step !== "game") return;

    const updated = cards.map(c =>
      c.id === id && !c.flipped && !c.matched ? { ...c, flipped: true } : c
    );

    setCards(updated);
    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [a, b] = newSelected;
      const cardA = updated.find(c => c.id === a);
      const cardB = updated.find(c => c.id === b);

      if (cardA?.img === cardB?.img) {
        const matchedCards = updated.map(c =>
          c.img === cardA?.img ? { ...c, matched: true } : c
        );
        setCards(matchedCards);

        const finished = matchedCards.every(c => c.matched);
        if (finished) {
          setTimeout(() => {
            if (level === maxLevel) {
              // CONECTADO: Vitória total (100%)
              router.push({
                pathname: "/resultado",
                params: {
                  status: "vitoria",
                  jogoId: "memoria",
                  niveisConcluidos: 4,
                  totalDoJogo: 4
                }
              });
            } else {
              setLevel(level + 1);
              setStep("intro");
            }
          }, 800);
        }
      } else {
        setErrors(prev => {
          const updatedErrors = prev + 1;
          if (updatedErrors >= 3) {
            setTimeout(() => {
              // CONECTADO: Derrota (Envia o nível que a criança parou)
              router.push({
                pathname: "/resultado",
                params: {
                  status: "derrota",
                  jogoId: "memoria",
                  niveisConcluidos: level - 1,
                  totalDoJogo: 4
                }
              });
            }, 600);
          }
          return updatedErrors;
        });

        setTimeout(() => {
          const reverted = updated.map(c =>
            c.id === a || c.id === b ? { ...c, flipped: false } : c
          );
          setCards(reverted);
        }, 900);
      }
      setSelected([]);
    }
  }

  return (
    <View style={styles.container}>
      {step === "intro" && (
        <View style={styles.centerBox}>
          <Text style={styles.levelText}>Fase {level}</Text>
          <Text style={styles.simpleMessage}>Vamos jogar?</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              createCards();
              setStep("memorize");
            }}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "memorize" && (
        <View style={styles.centerBox}>
          <Text style={styles.simpleMessage}>Observe com calma 👀</Text>
          <Text style={styles.timerText}>{memorizeTime}s</Text>
          <View style={styles.grid}>
            {cards.map(card => (
              <View key={card.id} style={[styles.cardOpen,{ width: cardSize, height: cardSize }]}>
                <Image source={card.img} style={{ width: cardSize * 0.7, height: cardSize * 0.7 }} />
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
            {cards.map(card => (
              <TouchableOpacity
                key={card.id}
                onPress={() => handleCardPress(card.id)}
                activeOpacity={0.8}
                style={[
                  card.flipped || card.matched ? styles.cardOpen : styles.cardClosed,
                  { width: cardSize, height: cardSize }
                ]}>
                {card.flipped || card.matched ? (
                  <Image source={card.img} style={{ width: cardSize * 0.7, height: cardSize * 0.7 }} />
                ) : (
                  <Text style={styles.question}>?</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#FAF8F0", alignItems:"center", justifyContent:"center" },
  centerBox:{ width:"95%", alignItems:"center" },
  levelText:{ fontSize:34, fontWeight:"bold", marginBottom:6 },
  simpleMessage:{ fontSize:26, marginBottom:10 },
  timerText:{ fontSize:30, fontWeight:"bold", marginBottom:12 },
  errorText:{ fontSize:22, marginBottom:10 },
  button:{ backgroundColor:"#AEE1F9", marginTop:20, paddingVertical:28, paddingHorizontal:30, borderRadius:14 },
  buttonText:{ color:"#333", fontSize:22, fontWeight:"bold" },
  grid:{ width:"100%", flexDirection:"row", flexWrap:"wrap", justifyContent:"center" },
  cardOpen:{ margin:8, backgroundColor:"#AEE1F9", borderRadius:18, alignItems:"center", justifyContent:"center", borderWidth:2, borderColor:"#7EC8E3" },
  cardClosed:{ margin:8, backgroundColor:"#BDBDBD", borderRadius:18, alignItems:"center", justifyContent:"center" },
  question:{ fontSize:42, fontWeight:"bold" }
});
