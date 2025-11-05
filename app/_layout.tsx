import { Stack } from "expo-router";

const userIsLoggedIn = false; // alterar para true quando implementar login

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* O expo-router automaticamente detecta o grupo (onboarding) */}
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />

      {/* As outras rotas ficam fora do grupo */}
      <Stack.Screen name="home" />
      <Stack.Screen name="pag-carregamento" />
      <Stack.Screen name="jogos" />
      <Stack.Screen name="[game_id]" />
    </Stack>
  );
}
