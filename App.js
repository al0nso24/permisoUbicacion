import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Ubicacion from './src/components/Ubicacion';

export default function App() {
  return (
    <View style={styles.container}>
      <Ubicacion></Ubicacion>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
