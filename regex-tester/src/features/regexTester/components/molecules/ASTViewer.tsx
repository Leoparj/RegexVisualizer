import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { safeStringify } from '../../../../utils/safeStringify';
import RailroadDiagram from './RailroadDiagram';

export default function ASTViewer({ ast, dark = false }: { ast: any; dark?: boolean }) {
  if (!ast) return null;

  const styles = createStyles(dark);

  let astString = '';
  try {
    astString = safeStringify(ast);
  } catch (e) {
    astString = 'Error al mostrar el AST.';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AST (Árbol de Sintaxis Abstracta):</Text>
      <ScrollView style={styles.scroll} horizontal>
        <Text style={styles.astText}>{astString}</Text>
      </ScrollView>

      {/* Vista de Ferrocarril */}
      <RailroadDiagram ast={ast} />
    </View>
  );
}

const createStyles = (dark: boolean) =>
  StyleSheet.create({
    container: {
      marginTop: 20,
      paddingHorizontal: 10,
    },
    title: {
      fontWeight: 'bold',
      marginBottom: 6,
      color: dark ? '#fff' : '#000',
    },
    scroll: {
      maxHeight: 200,
      marginBottom: 10,
      backgroundColor: dark ? '#1e1e1e' : '#f5f5f5',
      borderRadius: 8,
      padding: 8,
    },
    astText: {
      color: dark ? '#ddd' : '#222',
      fontSize: 12,
    },
  });
