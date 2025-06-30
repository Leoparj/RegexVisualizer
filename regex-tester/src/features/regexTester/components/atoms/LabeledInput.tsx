// src/features/regexTester/components/atoms/LabeledInput.tsx

import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  dark = false,
}: {
  label: string;                     // Etiqueta descriptiva
  value: string;                     // Valor del TextInput
  onChangeText: (text: string) => void; // Callback al cambiar texto
  placeholder?: string;              // Texto placeholder opcional
  multiline?: boolean;               // Soporte para varias líneas
  dark?: boolean;                    // Modo oscuro activo
}) {
  // Genera los estilos de acuerdo a si está en modo oscuro o claro
  const styles = createStyles(dark);

  return (
    <View style={styles.container}>
      {/* Etiqueta encima del input */}
      <Text style={styles.label}>{label}</Text>

      {/* Input controlado */}
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={dark ? '#ccc' : '#888'}
        multiline={multiline}
      />
    </View>
  );
}

const createStyles = (dark: boolean) =>
  StyleSheet.create({
    // Contenedor que envuelve etiqueta + input
    container: {
      marginBottom: 10,
    },
    // Estilo de la etiqueta
    label: {
      fontWeight: 'bold',
      marginBottom: 4,
      color: dark ? '#fff' : '#000',
    },
    // Estilo base del input
    input: {
      borderWidth: 1,
      borderColor: dark ? '#666' : '#ccc',
      borderRadius: 6,
      padding: 8,
      color: dark ? '#fff' : '#000',
      backgroundColor: dark ? '#1e1e1e' : '#fff',
    },
    // Ajustes especiales cuando es multiline
    multiline: {
      minHeight: 60,
      textAlignVertical: 'top', // Alinea texto al tope en Android
    },
  });
