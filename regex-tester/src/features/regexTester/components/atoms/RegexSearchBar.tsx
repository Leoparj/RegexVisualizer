// src/features/regexTester/components/atoms/RegexSearchBar.tsx

import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

export default function RegexSearchBar({
  value,
  onChange,
  dark = false,
}: {
  value: string;
  onChange: (text: string) => void;
  dark?: boolean;
}) {
  // Genera los estilos según el tema (claro u oscuro)
  const styles = createStyles(dark);

  return (
    <TextInput
      style={styles.input}
      // Texto de ayuda
      placeholder="Buscar expresión..."
      // Color del placeholder según tema
      placeholderTextColor={dark ? '#ccc' : '#888'}
      // Valor controlado del input
      value={value}
      // Llamado al cambiar el texto
      onChangeText={onChange}
    />
  );
}

const createStyles = (dark: boolean) =>
  StyleSheet.create({
    input: {
      // Borde del cajetín de búsqueda
      borderWidth: 1,
      borderColor: dark ? '#666' : '#ccc',
      borderRadius: 6,
      padding: 8,
      marginTop: 10,
      marginBottom: 10,
      // Color del texto según el tema
      color: dark ? '#fff' : '#000',
      // Fondo diferente en modo oscuro
      backgroundColor: dark ? '#1e1e1e' : '#fff',
    },
  });
