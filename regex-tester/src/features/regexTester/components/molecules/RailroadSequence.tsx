// Muestra la secuencia lineal de los elementos de la expresión regular
// como cajas horizontales desplazables (no es un "diagrama de ferrocarril" formal).
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function RailroadSequence({
  ast,
  dark = false,
}: {
  ast: any;
  dark?: boolean;
}) {
  // Validación básica: debe haber AST con al menos una alternativa
  if (
    !ast ||
    typeof ast !== 'object' ||
    !Array.isArray(ast.alternatives) ||
    ast.alternatives.length === 0
  ) {
    return null;
  }

  // Tomamos la primera alternativa y extraemos sus elementos (characters, grupos, cuantificadores, etc.)
  const elems = ast.alternatives[0].elements ?? [];

  // Mapear cada elemento a una caja con su etiqueta
  const nodes = elems.map((el: any, i: number) => {
    // El label por defecto es raw o tipo
    let label = el.raw ?? el.type ?? '';
    // Para rangos de clase ([a-z]) mostramos "a-z"
    if (el.type === 'CharacterClassRange') {
      label = `${el.min.raw}-${el.max.raw}`;
    }
    return (
      <View
        key={i}
        style={[
          styles.box,
          { backgroundColor: dark ? '#333' : '#4caf50' },
        ]}
      >
        <Text style={[styles.text, { color: '#fff' }]}>
          {label}
        </Text>
      </View>
    );
  });

  return (
    <ScrollView
      // Desplazamiento horizontal de las cajas
      horizontal
      showsHorizontalScrollIndicator
      style={[
        styles.wrapper,
        { backgroundColor: dark ? '#1a1a1a' : '#f4f4f4' },
      ]}
    >
      {nodes}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  box: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  text: {
    fontWeight: '600',
  },
});
