import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  multiline?: boolean;
  onChangeText: (text: string) => void;
};

export default function LabeledInput({ label, value, placeholder, multiline = false, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
});
