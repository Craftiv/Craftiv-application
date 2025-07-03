import { Stack } from 'expo-router';

export default function AuthStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" />
      <Stack.Screen name="(drawer)/(auth)/LogIn" />
      <Stack.Screen name="(drawer)/(auth)/SignUpfill" />
      <Stack.Screen name="(drawer)/(auth)/LogIn2" />
    </Stack>
  );
} 