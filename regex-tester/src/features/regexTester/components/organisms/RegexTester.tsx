import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, TouchableWithoutFeedback, View, useColorScheme,
} from 'react-native';

import { useRegexTesterViewModel } from '../../../viewModels/useRegexTesterViewModel';
import LabeledInput from '../atoms/LabeledInput';
import RegexSearchBar from '../atoms/RegexSearchBar';
import ASTViewer from '../molecules/ASTViewer';
import HighlightedText from '../molecules/HighlightedText';

export default function RegexTester() {
  /* ── theming ───────────────────────────────────────────────────────────── */
  const isDark = useColorScheme() === 'dark';
  const styles = createStyles(isDark);

  /* ── view-model ─────────────────────────────────────────────────────────── */
  const {
    /* estado */
    regex, input, ast,
    savedExpressions, history, favorites,

    /* acciones */
    handleRegexInput,
    handleSaveRegex, handleDeleteRegex, handleEditRegex,
    handleExportRegexes, handleImportRegexes,
    handleClearHistory,
    toggleFavorite,
  } = useRegexTesterViewModel();

  /* ── estado local de UI ────────────────────────────────────────────────── */
  const [searchTerm, setSearchTerm] = useState('');

  /* ── helpers ───────────────────────────────────────────────────────────── */
  const renderList = (
    title: string,
    expressions: string[],
    allowDelete = false,
  ) => {
    const filtered = expressions.filter(e =>
      e.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    if (!filtered.length) return null;

    return (
      <View style={styles.listContainer}>
        {/* título + botón borrar historial */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{title}</Text>
          {title.includes('Historial') && filtered.length > 0 && (
            <Pressable onPress={handleClearHistory}>
              <MaterialIcons name="delete-sweep" size={22} color={isDark ? '#ff8a65' : '#d32f2f'} />
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

            {/* toggle favorito */}
            <Pressable onPress={() => toggleFavorite(expr)}>
              <MaterialIcons
                name={favorites.includes(expr) ? 'star' : 'star-border'}
                size={22}
                color="#FFD700"
              />
            </Pressable>

            {/* eliminar (sólo lista guardadas) */}
            {allowDelete && (
              <Pressable onPress={() => handleDeleteRegex(expr)}>
                <MaterialIcons name="delete" size={22} color="#f44336" />
              </Pressable>
            )}
          </View>
        ))}
      </View>
    );
  };

  /* ── main scroll content ───────────────────────────────────────────────── */
  const content = (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* entrada expresión */}
      <LabeledInput
        label="Expresión Regular:"
        placeholder="Ej. \\d+"
        value={regex}
        onChangeText={text => handleRegexInput(text, input)}
        dark={isDark}
      />

      {/* texto de prueba */}
      <LabeledInput
        label="Texto de prueba:"
        placeholder="Escribe aquí..."
        value={input}
        multiline
        onChangeText={txt => handleRegexInput(regex, txt)}
        dark={isDark}
      />

      {/* botones principales */}
      <View style={styles.buttonGroup}>
        {[
          { icon: 'save', text: 'Guardar', onPress: handleSaveRegex },
          { icon: 'file-upload', text: 'Exportar', onPress: handleExportRegexes },
          { icon: 'file-download', text: 'Importar', onPress: handleImportRegexes },
        ].map(btn => (
          <Pressable key={btn.text} style={styles.iconButton} onPress={btn.onPress}>
            <MaterialIcons name={btn.icon as any} size={20} color="#fff" />
            <Text style={styles.iconButtonText}>{btn.text}</Text>
          </Pressable>
        ))}
      </View>

      {/* coincidencias */}
      <View style={styles.matchCard}>
        <Text style={styles.matchCardTitle}>Texto con coincidencias resaltadas:</Text>
        <HighlightedText
          text={input}
          pattern={regex}
          highlightColor="#ff0"
          dark={isDark}
        />
      </View>

      {/* AST */}
      <ASTViewer ast={ast} dark={isDark} />

      {/* buscador */}
      <RegexSearchBar value={searchTerm} onChange={setSearchTerm} dark={isDark} />

      {/* listas */}
      {renderList('⭐ Favoritas', favorites)}
      {renderList('🕘 Historial', history)}
      {renderList('💾 Guardadas', savedExpressions, true)}
    </ScrollView>
  );

  /* ── envoltorio móvil/web (cierre teclado) ─────────────────────────────── */
  return Platform.OS === 'web' ? (
    <View style={styles.container}>{content}</View>
  ) : (
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

/* ── estilos ─────────────────────────────────────────────────────────────── */
const createStyles = (dark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? '#121212' : '#fff',
    },
    scrollContent: {
      padding: 20,
      paddingTop: 50,
      paddingBottom: 100,
    },

    /* botones */
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

    /* coincidencias */
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

    /* listas */
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
  });
