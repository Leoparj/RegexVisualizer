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
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  dark?: boolean;
}) {
  const styles = createStyles(dark);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
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
    container: {
      marginBottom: 10,
    },
    label: {
      fontWeight: 'bold',
      marginBottom: 4,
      color: dark ? '#fff' : '#000',
    },
    input: {
      borderWidth: 1,
      borderColor: dark ? '#666' : '#ccc',
      borderRadius: 6,
      padding: 8,
      color: dark ? '#fff' : '#000',
      backgroundColor: dark ? '#1e1e1e' : '#fff',
    },
    multiline: {
      minHeight: 60,
      textAlignVertical: 'top',
    },
  });
