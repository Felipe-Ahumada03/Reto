import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform, Button } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Reemplaza esta IP con la de tu computadora
const API_URL = Platform.OS === 'web'
  ? 'http://localhost:3000'
  : 'http://10.183.14.193:3000'; // <<-- CAMBIA ESTA IP POR LA TUYA

const HomeScreen = () => {
    const { userId } = useLocalSearchParams(); 
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); 

    const handleLogout = () => {
        router.replace('/'); 
    };

    useEffect(() => {
        if (!userId) return;

        const fetchPaciente = async () => {
            try {
                const response = await axios.get(`${API_URL}/paciente/usuario/${userId}`);
                setPaciente(response.data);
            } catch (error) {
                console.error("Error al obtener datos del paciente:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaciente();
    }, [userId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.centered} />;
    }

    if (!paciente) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No hay información disponible</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido, {paciente.Nombre_paciente}</Text>
            <View style={styles.card}>
                <Text style={styles.cardRow}>ID Paciente: {paciente.id_paciente}</Text>
                <Text style={styles.cardRow}>Nombre Completo: {paciente.Nombre_paciente}</Text>
                <Text style={styles.cardRow}>Correo: {paciente.Correo}</Text>
                <Text style={styles.cardRow}>Edad: {paciente.Edad}</Text>
            </View>
            
            <View style={styles.logoutButton}>
                <Button title="Cerrar Sesión" onPress={handleLogout} color="#d9534f" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    card: { backgroundColor: 'white', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    cardRow: { fontSize: 18, marginBottom: 10 },
    logoutButton: {
        marginTop: 30,
        borderRadius: 10,
        overflow: 'hidden', 
    },
});

export default HomeScreen;

