// src/features/regexTester/components/organisms/RegexTester.tsx

import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';

// 1) Ahora importamos el store de Zustand, no el viewModel
import { useRegexStore } from '../../store/useRegexStore';

// Componentes atómicos
import LabeledInput from '../atoms/LabeledInput';
import RegexSearchBar from '../atoms/RegexSearchBar';
import ASTViewer from '../molecules/ASTViewer';
import HighlightedText from '../molecules/HighlightedText';

type Example = { name: string; pattern: string };

export default function RegexTester() {
  const isDark = useColorScheme() === 'dark';
  const styles = createStyles(isDark);

  // 2) Desestructuramos TODO desde el store
  const {
    regex,
    input,
    ast,
    saved,
    history,
    favs,

    setRegexInput,
    saveRegex,
    deleteRegex,
    editRegex,
    clearHistory,
    toggleFav,
    exportAll,
    importAll,
  } = useRegexStore();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const examples: Example[] = [
    { name: 'Correo electrónico', pattern: '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}' },
    { name: 'URL (http/https)',   pattern: 'https?:\\/\\/(?:www\\.)?[^\\s\\/$.?#].[^\\s]*' },
    { name: 'Teléfono intl.',      pattern: '\\+[1-9]\\d{1,14}' },
    { name: 'Fecha DD/MM/AAAA',    pattern: '(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}' },
    { name: 'IPv4',                pattern: '((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)' },
    { name: 'Hex Color',           pattern: '#(?:[0-9A-Fa-f]{3}){1,2}' },
    { name: 'Pwd fuerte',          pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}' },
    { name: 'Solo dígitos',        pattern: '\\d+' },
    { name: 'Palabra completa',    pattern: '\\bpalabra\\b' },
    { name: 'HTML simple',         pattern: '<([A-Za-z][A-Za-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>' },
  ];

  const renderList = (
    title: string,
    items: string[],
    allowDelete = false
  ) => {
    const filtered = items.filter(i =>
      i.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (!filtered.length) return null;

    return (
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{title}</Text>
          {title === '🕘 Historial' && filtered.length > 0 && (
            <Pressable onPress={clearHistory}>
              <MaterialIcons
                name="delete-sweep"
                size={20}
                color={isDark ? '#ff8a65' : '#d32f2f'}
              />
            </Pressable>
          )}
        </View>
        {filtered.map((expr, idx) => (
          <View key={idx} style={styles.listItem}>
            <Pressable
              style={styles.expressionWrapper}
              onPress={() => setRegexInput(expr, input)}
            >
              <Text style={styles.expressionText}>{expr}</Text>
            </Pressable>
            <Pressable onPress={() => toggleFav(expr)}>
              <MaterialIcons
                name={favs.includes(expr) ? 'star' : 'star-border'}
                size={20}
                color="#FFD700"
              />
            </Pressable>
            {allowDelete && (
              <Pressable onPress={() => deleteRegex(expr)}>
                <MaterialIcons name="delete" size={20} color="#f44336" />
              </Pressable>
            )}
          </View>
        ))}
      </View>
    );
  };

  const onSelectExample = (pattern: string) => {
    setRegexInput(pattern, input);
  };

  const content = (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <LabeledInput
        label="Expresión Regular:"
        placeholder="Ej. \\d+"
        value={regex}
        onChangeText={txt => setRegexInput(txt, input)}
        dark={isDark}
      />
      <LabeledInput
        label="Texto de prueba:"
        placeholder="Escribe aquí..."
        value={input}
        multiline
        onChangeText={txt => setRegexInput(regex, txt)}
        dark={isDark}
      />

      <View style={styles.buttonGroup}>
        <Pressable style={styles.iconButton} onPress={saveRegex}>
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.iconButtonText}>Guardar</Text>
        </Pressable>
        <Pressable style={styles.iconButton} onPress={exportAll}>
          <MaterialIcons name="file-upload" size={20} color="#fff" />
          <Text style={styles.iconButtonText}>Exportar</Text>
        </Pressable>
        <Pressable style={styles.iconButton} onPress={importAll}>
          <MaterialIcons name="file-download" size={20} color="#fff" />
          <Text style={styles.iconButtonText}>Importar</Text>
        </Pressable>
      </View>

      <View style={styles.matchCard}>
        <Text style={styles.matchCardTitle}>Texto con coincidencias resaltadas:</Text>
        <HighlightedText text={input} pattern={regex} highlightColor="#ff0" dark={isDark} />
      </View>

      <ASTViewer ast={ast} />

      <RegexSearchBar value={searchTerm} onChange={setSearchTerm} dark={isDark} />

      {renderList('⭐ Favoritas', favs)}
      {renderList('🕘 Historial', history)}

      <View style={styles.examplesContainer}>
        <Text style={styles.examplesTitle}>Ejemplos rápidos:</Text>
        {examples.map(ex => (
          <Pressable
            key={ex.pattern}
            style={styles.exampleItem}
            onPress={() => onSelectExample(ex.pattern)}
          >
            <Text style={styles.exampleName}>{ex.name}</Text>
            <Text style={styles.examplePattern}>{ex.pattern}</Text>
          </Pressable>
        ))}
      </View>

      {renderList('💾 Guardadas', saved, true)}
    </ScrollView>
  );

  if (Platform.OS === 'web') {
    return <View style={styles.container}>{content}</View>;
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {content}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const createStyles = (dark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: dark ? '#121212' : '#fff' },
    scrollContent: { padding: 20, paddingTop: 50, paddingBottom: 100 },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      marginVertical: 12,
    },
    iconButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#4CAF50',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    iconButtonText: { color: '#fff', fontSize: 14, marginLeft: 6 },
    matchCard: {
      backgroundColor: dark ? '#333' : '#fff',
      padding: 12,
      borderRadius: 8,
      marginTop: 12,
    },
    matchCardTitle: {
      fontWeight: 'bold',
      marginBottom: 6,
      color: dark ? '#fff' : '#000',
    },
    listContainer: { marginTop: 24 },
    listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    listTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      color: dark ? '#fff' : '#000',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderColor: dark ? '#555' : '#ccc',
    },
    expressionWrapper: { flex: 1, marginRight: 8 },
    expressionText: { fontSize: 15, color: dark ? '#fff' : '#000' },
    examplesContainer: {
      marginTop: 24,
      padding: 12,
      backgroundColor: dark ? '#222' : '#fafafa',
      borderRadius: 6,
    },
    examplesTitle: {
      fontWeight: '700',
      fontSize: 16,
      marginBottom: 12,
      color: dark ? '#fff' : '#000',
    },
    exampleItem: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: dark ? '#444' : '#ddd',
    },
    exampleName: {
      fontWeight: '600',
      color: dark ? '#fff' : '#000',
    },
    examplePattern: {
      fontFamily: 'monospace',
      color: dark ? '#ccc' : '#555',
      marginTop: 2,
    },
  });
