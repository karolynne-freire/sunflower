import { Text, View } from "react-native";
import PerguntaEmocional from "../../components/pergunta";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🌻 Bem-vindo ao Sunflower! 🌻</Text>
      <PerguntaEmocional />
    </View>
  );
}
