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

import { useRegexTesterViewModel } from '../../../viewModels/useRegexTesterViewModel';
import LabeledInput from '../atoms/LabeledInput';
import RegexSearchBar from '../atoms/RegexSearchBar';
import ASTViewer from '../molecules/ASTViewer';
import HighlightedText from '../molecules/HighlightedText';

type Example = { name: string; pattern: string };

export default function RegexTester() {
  const isDark = useColorScheme() === 'dark';
  const styles = createStyles(isDark);

  const {
    regex,
    input,
    ast,
    savedExpressions,
    history,
    favorites,

    handleRegexInput,
    handleSaveRegex,
    handleDeleteRegex,
    handleEditRegex,
    handleExportRegexes,
    handleImportRegexes,
    toggleFavorite,
    handleClearHistory,
  } = useRegexTesterViewModel();

  const [searchTerm, setSearchTerm] = useState<string>('');

  // Lista de ejemplos
  const examples: Example[] = [
    { name: 'Correo electrónico básico', pattern: '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' },
    { name: 'URL (http/https)',             pattern: 'https?:\\/\\/(?:www\\.)?[^\\s\\/$.?#].[^\\s]*$' },
    { name: 'Teléfono internacional',        pattern: '\\+[1-9]\\d{1,14}$' },
    { name: 'Fecha DD/MM/AAAA',             pattern: '(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$' },
    { name: 'Dirección IPv4',               pattern: '((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$' },
    { name: 'Color hexadecimal',             pattern: '#(?:[0-9A-Fa-f]{3}){1,2}$' },
    { name: 'Contraseña fuerte',             pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$' },
    { name: 'Solo dígitos',                  pattern: '\\d+$' },
    { name: 'Palabra completa',              pattern: '\\bpalabra\\b' },
    { name: 'Etiqueta HTML simple',         pattern: '<([A-Za-z][A-Za-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>$' },
  ];

  const renderList = (
    title: string,
    expressions: string[],
    allowDelete = false
  ) => {
    const filtered = expressions.filter(expr =>
      expr.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (!filtered.length) return null;

    return (
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{title}</Text>
          {title === '🕘 Historial' && filtered.length > 0 && (
            <Pressable onPress={handleClearHistory}>
              <MaterialIcons
                name="delete-sweep"
                size={20}
                color={isDark ? '#ff8a65' : '#d32f2f'}
              />
            </Pressable>
          )}
        </View>
        {filtered.map((expr, idx) => (
          <View key={`${title}-${idx}`} style={styles.listItem}>
            <Pressable
              style={styles.expressionWrapper}
              onPress={() => handleRegexInput(expr, input)}
            >
              <Text style={styles.expressionText}>{expr}</Text>
            </Pressable>
            <Pressable onPress={() => toggleFavorite(expr)}>
              <MaterialIcons
                name={favorites.includes(expr) ? 'star' : 'star-border'}
                size={20}
                color="#FFD700"
              />
            </Pressable>
            {allowDelete && (
              <Pressable onPress={() => handleDeleteRegex(expr)}>
                <MaterialIcons name="delete" size={20} color="#f44336" />
              </Pressable>
            )}
          </View>
        ))}
      </View>
    );
  };

  const onSelectExample = (pattern: string) => {
    handleRegexInput(pattern, input);
  };

  const content = (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Entradas */}
      <LabeledInput
        label="Expresión Regular:"
        placeholder="Ej. \\d+"
        value={regex}
        onChangeText={txt => handleRegexInput(txt, input)}
        dark={isDark}
      />
      <LabeledInput
        label="Texto de prueba:"
        placeholder="Escribe aquí..."
        value={input}
        multiline
        onChangeText={txt => handleRegexInput(regex, txt)}
        dark={isDark}
      />

      {/* Botones */}
      <View style={styles.buttonGroup}>
        <Pressable style={styles.iconButton} onPress={handleSaveRegex}>
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.iconButtonText}>Guardar</Text>
        </Pressable>
        <Pressable style={styles.iconButton} onPress={handleExportRegexes}>
          <MaterialIcons name="file-upload" size={20} color="#fff" />
          <Text style={styles.iconButtonText}>Exportar</Text>
        </Pressable>
        <Pressable style={styles.iconButton} onPress={handleImportRegexes}>
          <MaterialIcons name="file-download" size={20} color="#fff" />
          <Text style={styles.iconButtonText}>Importar</Text>
        </Pressable>
      </View>

      {/* Resaltado */}
      <View style={styles.matchCard}>
        <Text style={styles.matchCardTitle}>
          Texto con coincidencias resaltadas:
        </Text>
        <HighlightedText
          text={input}
          pattern={regex}
          highlightColor="#ff0"
          dark={isDark}
        />
      </View>

      {/* AST */}
      <ASTViewer ast={ast} />

      {/* Buscador */}
      <RegexSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        dark={isDark}
      />

      {/* Favoritas */}
      {renderList('⭐ Favoritas', favorites)}
      {/* Historial */}
      {renderList('🕘 Historial', history)}
      {/* Ejemplos */}
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
      {/* Guardadas */}
      {renderList('💾 Guardadas', savedExpressions, true)}
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
