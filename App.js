import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [text, setText] = useState('Selecciona un archivo de texto para comenzar...');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/plain' });
      if (!result.canceled && result.assets[0]) {
        const response = await fetch(result.assets[0].uri);
        const fileContent = await response.text();
        setText(fileContent);
      }
    } catch (err) {
      console.log('Error al cargar archivo', err);
    }
  };

  const speak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(text, {
        language: 'es-ES',
        pitch: 1.0,
        rate: 1.0,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="📁 Cargar Documento" onPress={pickDocument} />
      <ScrollView style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </ScrollView>
      <Button 
        title={isSpeaking ? "⏸ Detener Lectura" : "▶ Reproducir"} 
        onPress={speak} 
        color="#7c4dff" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#121212' },
  textContainer: { flex: 1, marginVertical: 20, padding: 10, backgroundColor: '#1e1e1e', borderRadius: 8 },
  text: { color: '#ffffff', fontSize: 16 }
});
