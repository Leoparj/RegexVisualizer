import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LabeledInput from '../atoms/LabeledInput';
import HighlightedText from '../molecules/HighlightedText';
import { useRegexTesterViewModel } from '../../../viewModels/useRegexTesterViewModel';
import ASTViewer from '../molecules/ASTViewer';

export default function RegexTester() {
  const {
    regex,
    input,
    ast,
    setRegex,
    setInput,
    handleTestRegex,
  } = useRegexTesterViewModel();

  return (
    <View style={styles.container}>
      <LabeledInput
        label="Expresión Regular:"
        placeholder="Ej. \\d+"
        value={regex}
        onChangeText={(text) => {
          setRegex(text);
          handleTestRegex(text, input);
        }}
      />

      <LabeledInput
        label="Texto de prueba:"
        placeholder="Escribe aquí..."
        value={input}
        multiline
        onChangeText={(text) => {
          setInput(text);
          handleTestRegex(regex, text);
        }}
      />

      <Text style={styles.label}>Texto con coincidencias resaltadas:</Text>
      <HighlightedText text={input} pattern={regex} />

      <Text style={styles.label}>Árbol de Sintaxis Abstracta (AST):</Text>
      <ASTViewer ast={ast} />
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
});
