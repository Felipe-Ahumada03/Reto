import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router'; // Link ya estaba importado
import axios from 'axios';

// --- CONFIGURACIÓN DE LA API ---
// Ajusta la URL según dónde ejecutes la app:
// - Web (navegador en la misma máquina): http://localhost:3000
// - Emulador Android (Android Studio): http://10.0.2.2:3000
// - Expo Go en dispositivo físico: usa la IP local de tu máquina, p.ej. http://192.168.x.y:3000
// Reemplaza la IP por la que corresponde a tu red local si usas un dispositivo real.
const API_URL = Platform.OS === 'web'
  ? 'http://localhost:3000'
  : 'http://10.186.26.83:3000'; // <-- Cambia esta IP si no es accesible desde tu móvil

export default function RegisterScreen() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!nombreUsuario || !contraseña || !rol) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      // Si tu backend espera claves en español, usa el objeto tal cual.
      // Si espera 'username'/'password', cambia las claves abajo.
      const payload = {
        Nombre_usuario: nombreUsuario,
        Contraseña: contraseña,
        Rol: rol,
      };

      // Ejemplo alternativo (descomenta si tu backend usa estos nombres):
      // const payload = { username: nombreUsuario, password: contraseña, role: rol };

      const response = await axios.post(`${API_URL}/usuarios`, payload, { timeout: 10000 });

      const successMsg = typeof response.data === 'string' ? response.data : 'Usuario registrado con éxito.';
      Alert.alert('Éxito', successMsg);
      router.back(); // vuelve a la pantalla anterior (por ejemplo, login)

    } catch (error: any) {
      console.error('Register error:', error);

      // Extraer mensaje cuando venga del servidor
      const serverMessage = error?.response?.data || error?.message || 'No se pudo registrar el usuario.';
      Alert.alert('Error', String(serverMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear una Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={nombreUsuario}
        onChangeText={setNombreUsuario}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Rol (ej. Paciente, Doctor)"
        value={rol}
        onChangeText={setRol}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 12 }} />
      ) : (
        <Button title="Registrarme" onPress={handleRegister} />
      )}

      {/* Enlace a la pantalla de login (ajusta href si tu login no está en /) */}
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  // ESTILO AÑADIDO PARA EL ENLACE
  link: {
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
  },
});