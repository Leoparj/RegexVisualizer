// src/features/regexTester/components/molecules/RailroadDiagram.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RailroadDiagram({ ast }: { ast: any }) {
  if (
    !ast ||
    typeof ast !== 'object' ||
    !ast.body ||
    !Array.isArray(ast.body) ||
    ast.body.length === 0
  ) {
    return null;
  }

  const renderSequence = (node: any) => {
    if (!node || typeof node !== 'object') return null;

    if (node.type !== 'Alternative' || !Array.isArray(node.elements)) {
      return (
        <Text style={{ fontStyle: 'italic', color: '#999' }}>
          Diagrama no disponible para este tipo de nodo.
        </Text>
      );
    }

    return <View style={styles.sequence}>
      {node.elements.map((el: any, index: number) => renderToken(el, index))}
    </View>;
  };

  const renderToken = (node: any, index: number) => {
    if (!node || typeof node !== 'object') return null;

    const label = node.raw || node.type || '¿?';
    return (
      <View key={index} style={styles.token}>
        <Text style={styles.tokenText}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vista de Ferrocarril:</Text>
      {renderSequence(ast.body[0])}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000',
  },
  sequence: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  token: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#d0ebff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4dabf7',
  },
  tokenText: {
    color: '#000',
    fontWeight: '600',
  },
});
