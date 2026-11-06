//Ejemplo 2: Pedir la ubicación y mostrar las coordenadas
import { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
//Importa todas las funciones de expo-location dentro del objeto Location
import * as Location from 'expo-location';

export default function Ubicacion() {
    const [estado, setEstado] = useState('pendiente'); //empieza en pendiente
    const [coordenadas, setCoordenadas] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const obtenerUbicacion = async () => {
        setCargando(true); //empieza a cargar
        setError('');
        try {
            //Pedimos permiso. "Foreground" = solo con la app abierta
            const { status } = await Location.requestForegroundPermissionsAsync();
            setEstado(status);

            if (status !== 'granted') {
                setCoordenadas(null); //sin permiso no se debe mostrar las coordenadas
                return; //sin permiso no se debe leer la ubicación
            }

            //Con permiso, leemos la posición actual usando el GPS
            //Si falla, usamos la última posición que recuerda el teléfono
            //getCurrentPositionAsync(...) pide al teléfono su posición actual
            const posicion = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High, //precisión alta

                //Pedir la última posición que el teléfono recuerde
                }).catch(() => Location.getLastKnownPositionAsync());

            //Si no hay posición disponible
            if (posicion === null) {
                setError('Aún no hay señal de ubicación. Inténtalo de nuevo.');
                return;
            }
            setCoordenadas(posicion.coords); //guarda las coordenadas
        } catch (e) {
            //Pasa, por ejemplo, si el GPS del teléfono está apagado
            setError('No se pudo leer la ubicación. Revisa que el GPS esté activo.');
        } finally {
            //Apaga el estado de carga
            setCargando(false); //se ejecuta siempre, con o sin error
        }
    };

    return (
        <View style={styles.contenedor}>
            <StatusBar style="dark" />
            <Text style={styles.titulo}>Mi ubicación</Text>
            <Text style={styles.texto}>Estado del permiso:
                {estado}</Text>
            <Button
                title="Obtener mi ubicación"
                onPress={obtenerUbicacion}
                disabled={cargando}
            />
            {/*Si cargando es true, aparece el indicador*/}
            {cargando && <ActivityIndicator style={styles.espacio} size="large" />}
            {/*Si existen coordenadas*/}
            {coordenadas && (
                <View style={styles.tarjeta}>
                    <Text style={styles.dato}>Latitud:
                        {coordenadas.latitude.toFixed(4)}</Text>
                    <Text style={styles.dato}>Longitud:
                        {coordenadas.longitude.toFixed(4)}</Text>
                </View>
            )}
            {/*Si no se concede permiso*/}
            {estado === 'denied' && (
                <Text style={styles.aviso}>
                    Sin el permiso de ubicación no podemos mostrar tu posición.
                </Text>
            )}
            {/*Comprueba si error no está vacío. Si contiene un mensaje, lo muestra*/}
            {error !== '' && <Text
                style={styles.aviso}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F6F6F6',
    },

    titulo: {
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 12
    },

    texto: { 
        fontSize: 16, 
        marginBottom: 20 
    },

    espacio: { 
        marginTop: 20 
    },

    tarjeta: {
        marginTop: 24,
        padding: 16,
        width: '100%',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },

    dato: { 
        fontSize: 18, 
        marginVertical: 4 
    },

    aviso: {
        marginTop: 20, 
        fontSize: 15, 
        color: '#B91C1C',
        textAlign: 'center'
    },
});