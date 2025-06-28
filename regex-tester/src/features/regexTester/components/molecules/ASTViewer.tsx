// src/features/regexTester/components/molecules/ASTViewer.tsx
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { safeStringify } from '../../../../utils/safeStringify';
import RailroadDiagram from './RailroadDiagram';

export default function ASTViewer({ ast }: { ast: any }) {
  const [view, setView] = useState<'json' | 'rail'>('json');
  const isDark = useColorScheme() === 'dark';
  const styles = createStyles(isDark);

  if (!ast) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AST (Árbol de Sintaxis Abstracta):</Text>

      {/* Pestañas */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, view === 'json' && styles.tabActive]}
          onPress={() => setView('json')}
        >
          <Text style={view === 'json' ? styles.tabTextActive : styles.tabText}>
            JSON
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, view === 'rail' && styles.tabActive]}
          onPress={() => setView('rail')}
        >
          <Text style={view === 'rail' ? styles.tabTextActive : styles.tabText}>
            Ferrocarril
          </Text>
        </Pressable>
      </View>

      {/* Contenido de la pestaña */}
      {view === 'json' ? (
        <ScrollView style={styles.jsonContainer}>
          <Text style={styles.jsonText}>{safeStringify(ast, null, 2)}</Text>
        </ScrollView>
      ) : (
        <ScrollView horizontal contentContainerStyle={styles.railContainer}>
          <RailroadDiagram ast={ast} dark={isDark} />
        </ScrollView>
      )}
    </View>
  );
}

const createStyles = (dark: boolean) =>
  StyleSheet.create({
    container: {
      marginTop: 20,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 6,
      color: dark ? '#fff' : '#000',
    },
    tabBar: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: dark ? '#555' : '#ccc',
      marginBottom: 8,
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
    },
    tabActive: {
      borderBottomWidth: 2,
      borderColor: '#4caf50',
    },
    tabText: {
      color: dark ? '#aaa' : '#666',
      fontWeight: '600',
    },
    tabTextActive: {
      color: '#4caf50',
      fontWeight: '700',
    },
    jsonContainer: {
      maxHeight: 300,
      backgroundColor: dark ? '#1a1a1a' : '#f4f4f4',
      borderRadius: 6,
      padding: 10,
    },
    jsonText: {
      fontFamily: 'monospace',
      color: dark ? '#fff' : '#000',
    },
    railContainer: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
  });
