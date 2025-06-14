import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function RegexTesterScreen() {
  const [regex, setRegex] = useState('');
  const [input, setInput] = useState('');
  const [matches, setMatches] = useState<string[]>([]);

  const handleTestRegex = (pattern: string, text: string) => {
    try {
      const exp = new RegExp(pattern, 'g');
      const found = text.match(exp) || [];
      setMatches(found);
    } catch (error) {
      setMatches([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Expresión Regular:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. \\d+"
        value={regex}
        onChangeText={(text) => {
          setRegex(text);
          handleTestRegex(text, input);
        }}
      />

      <Text style={styles.label}>Texto de prueba:</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe aquí..."
        value={input}
        onChangeText={(text) => {
          setInput(text);
          handleTestRegex(regex, text);
        }}
        multiline
      />

      <Text style={styles.label}>Coincidencias:</Text>
      <Text style={styles.result}>{matches.join(', ') || 'Ninguna'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  result: {
    marginTop: 10,
    fontStyle: 'italic',
    color: 'green',
  },
});
