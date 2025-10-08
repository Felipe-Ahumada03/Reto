import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

// ... (tu constante API_URL)
const API_URL = Platform.OS === 'web'
  ? 'http://localhost:3000'
  : 'http://10.183.21.86:3000'; // CAMBIA ESTA IP

export default function CreateProfileScreen() {
    const router = useRouter();
    const { userId } = useLocalSearchParams(); 

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [edad, setEdad] = useState('');
    
    // 1. Estado para guardar los mensajes de error
    const [errors, setErrors] = useState({});

    // 2. Función para validar todos los campos
    const validateForm = () => {
        let newErrors = {};

        if (!nombre) newErrors.nombre = 'El nombre es obligatorio.';
        
        // Validación de correo electrónico
        if (!correo) {
            newErrors.correo = 'El correo es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(correo)) {
            newErrors.correo = 'El formato del correo no es válido.';
        }

        // Validación de contraseña
        if (!contrasena) {
            newErrors.contrasena = 'La contraseña es obligatoria.';
        } else if (contrasena.length < 6) {
            newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
        }

        // Validación de edad
        if (!edad) {
            newErrors.edad = 'La edad es obligatoria.';
        } else if (isNaN(edad) || Number(edad) <= 0) {
            newErrors.edad = 'Por favor, ingresa un número válido para la edad.';
        }

        setErrors(newErrors);
        // Devuelve 'true' si el objeto de errores está vacío (formulario válido)
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateProfile = async () => {
        // 3. Primero validamos, si no es válido, no continuamos.
        if (!validateForm()) {
            return; 
        }

        try {
            await axios.post(`${API_URL}/pacientes`, {
                Nombre_paciente: nombre,
                Correo: correo,
                Contrasena: contrasena,
                Edad: edad,
                id_usuario: userId
            });

            alert('Éxito', 'Tu perfil ha sido creado. Ahora inicia sesión.'); // Usamos alert en lugar de Alert.alert para simplificar
            router.replace('/');

        } catch (error) {
            console.error("Error al crear perfil:", error);
            alert('Error', 'No se pudo crear tu perfil.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Completa tu Perfil</Text>
            
            <TextInput style={styles.input} placeholder="Nombre Completo" value={nombre} onChangeText={setNombre} />
            {/* Mensaje de error para el nombre */}
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

            <TextInput 
                style={styles.input} 
                placeholder="Correo Electrónico (ej. tu@correo.com)" 
                value={correo} 
                onChangeText={setCorreo} 
                keyboardType="email-address" 
                autoCapitalize="none" 
            />
            {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}

            <TextInput 
                style={styles.input} 
                placeholder="Contraseña (mínimo 6 caracteres)" 
                value={contrasena} 
                onChangeText={setContrasena} 
                secureTextEntry 
            />
            {errors.contrasena && <Text style={styles.errorText}>{errors.contrasena}</Text>}

            <TextInput 
                style={styles.input} 
                placeholder="Edad (solo números)" 
                value={edad} 
                onChangeText={setEdad} 
                keyboardType="numeric" 
            />
            {errors.edad && <Text style={styles.errorText}>{errors.edad}</Text>}
            
            <Button title="Guardar Perfil" onPress={handleCreateProfile} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 5, fontSize: 16 },
    // Estilo para los mensajes de error
    errorText: {
        color: 'red',
        marginBottom: 10,
        marginLeft: 5,
    },
});
