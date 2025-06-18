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
    handleEditRegex,
    handleExportRegexes,
    handleImportRegexes,
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

      <View style={styles.buttonGroup}>
        <Button title="Guardar Expresión" onPress={handleSaveRegex} />
        <Button title="Exportar Expresiones" onPress={handleExportRegexes} />
        <Button title="Importar Expresiones" onPress={handleImportRegexes} />
      </View>

      <Text style={styles.label}>Texto con coincidencias resaltadas:</Text>
      <HighlightedText text={input} pattern={regex} />

      <ASTViewer ast={ast} />

      <RegexSearchBar value={searchTerm} onChange={setSearchTerm} />

      <SavedRegexList
        expressions={filteredExpressions}
        onDelete={handleDeleteRegex}
        onEdit={handleEditRegex}
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
  buttonGroup: {
    marginTop: 10,
    marginBottom: 10,
    gap: 8,
  },
});
