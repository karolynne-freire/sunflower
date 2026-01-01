import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { HumorProvider } from "../app/context/HumorContext";

export default function RootLayout() {
  const router = useRouter();
  const userIsLoggedIn = false;

  useEffect(() => {
    setTimeout(() => {
      if (userIsLoggedIn) {
        router.replace("/home");
      } else {
        router.replace("/(onboarding)");
      }
    }, 50);
  }, []);

  return (
    <HumorProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />

        <Stack.Screen name="home" />
        <Stack.Screen name="jogos" />
        <Stack.Screen name="login" />
      </Stack>
    </HumorProvider>
  );
}
