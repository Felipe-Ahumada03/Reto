import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Inicio de Sesión' }} />
      <Stack.Screen name="register" options={{ title: 'Crear Cuenta' }} />
    </Stack>
  );
}