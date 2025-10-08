import { Stack } from "expo-router";

const userIsLoggedIn = false; //alterar para true quando implementar login

export default function RootLayout() {
  return (
    <Stack>
      {userIsLoggedIn ? (
        // Rotas que só aparecem DEPOIS do login
        <Stack.Screen name="home" options={{ title: "Bem-vindo!" }} />
      ) : (
        // Rotas que aparecem ANTES do login (o grupo onboarding)
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="pag-carregamento" options={{ headerShown: false }} />
      <Stack.Screen name="jogos" options={{ title: "Jogos do Sunny" }} />
      <Stack.Screen name="[game_id]" options={{ title: "Jogando..." }} />
    </Stack>
  );
}
