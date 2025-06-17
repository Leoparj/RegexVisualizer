// src/features/regexTester/components/organisms/RegexTester.tsx
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useRegexTesterViewModel } from '../../../viewModels/useRegexTesterViewModel';
import LabeledInput from '../atoms/LabeledInput';
import RegexSearchBar from '../atoms/RegexSearchBar';
import ASTViewer from '../molecules/ASTViewer';
import HighlightedText from '../molecules/HighlightedText';
import SavedRegexList from '../molecules/SavedRegexList';

export default function RegexTester() {
  const {
    regex,
    input,
    ast,
    savedExpressions,
    setRegex,
    setInput,
    handleTestRegex,
    handleSaveRegex,
    handleDeleteRegex,
    handleEditRegex, // ✅ asegúrate de que esté aquí
  } = useRegexTesterViewModel();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredExpressions = savedExpressions.filter((expr) =>
    expr.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <Button title="Guardar Expresión" onPress={handleSaveRegex} />

      <Text style={styles.label}>Texto con coincidencias resaltadas:</Text>
      <HighlightedText text={input} pattern={regex} />

      <ASTViewer ast={ast} />

      <RegexSearchBar value={searchTerm} onChange={setSearchTerm} />

      <SavedRegexList
        expressions={filteredExpressions}
        onDelete={handleDeleteRegex}
        onEdit={handleEditRegex} // ✅ asegúrate de pasarla también aquí
        onSelect={(expr) => {
          setRegex(expr);
          handleTestRegex(expr, input);
        }}
      />
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
