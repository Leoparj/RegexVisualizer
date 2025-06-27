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
  const styles = createStyles(dark);
  return (
    <TextInput
      style={styles.input}
      placeholder="Buscar expresión..."
      placeholderTextColor={dark ? '#ccc' : '#888'}
      value={value}
      onChangeText={onChange}
    />
  );
}

const createStyles = (dark: boolean) =>
  StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: dark ? '#666' : '#ccc',
      borderRadius: 6,
      padding: 8,
      marginTop: 10,
      marginBottom: 10,
      color: dark ? '#fff' : '#000',
      backgroundColor: dark ? '#1e1e1e' : '#fff',
    },
  });
