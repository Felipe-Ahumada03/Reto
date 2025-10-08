import React, {useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Platform, Button } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

// Reemplaza esta IP con la de tu computadora
const API_URL = Platform.OS === 'web'
  ? 'http://localhost:3000'
  : 'http://10.183.21.86:3000'; // <<-- CAMBIA ESTA IP POR LA TUYA

const DoctorDashboard = () => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); 

    const handleLogout = () => {
        router.replace('/');
    };

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await axios.get(`${API_URL}/pacientes`);
                setPacientes(response.data);
            } catch (error) {
                console.error("Error al obtener los pacientes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPacientes();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.centered} />;
    }

    const renderHeader = () => (
        <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { flex: 1 }]}>ID</Text>
            <Text style={[styles.headerCell, { flex: 3 }]}>Nombre</Text>
            <Text style={[styles.headerCell, { flex: 3 }]}>Correo</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.dataRow}>
            <Text style={[styles.dataCell, { flex: 1 }]}>{item.id_paciente}</Text>
            <Text style={[styles.dataCell, { flex: 3 }]}>{item.Nombre_paciente}</Text>
            <Text style={[styles.dataCell, { flex: 3 }]}>{item.Correo}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Panel de Doctor</Text>
            <Text style={styles.subtitle}>Lista de Todos los Pacientes</Text>
            <FlatList
                data={pacientes}
                keyExtractor={(item) => item.id_paciente.toString()}
                ListHeaderComponent={renderHeader}
                renderItem={renderItem}
            />
            
            <View style={styles.logoutButton}>
                <Button title="Cerrar Sesión" onPress={handleLogout} color="#d9534f" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
    subtitle: { fontSize: 16, textAlign: 'center', color: 'gray', marginBottom: 20 },
    headerRow: { flexDirection: 'row', backgroundColor: '#007bff', paddingVertical: 12 },
    headerCell: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
    dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 10, backgroundColor: '#fff' },
    dataCell: { textAlign: 'center' },
    logoutButton: {
        marginTop: 20,
        borderRadius: 10,
        overflow: 'hidden',
    },
});

export default DoctorDashboard;

