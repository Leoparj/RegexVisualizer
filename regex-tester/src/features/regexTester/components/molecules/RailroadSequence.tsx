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
  if (
    !ast ||
    typeof ast !== 'object' ||
    !Array.isArray(ast.alternatives) ||
    ast.alternatives.length === 0
  ) {
    return null;
  }

  // tomamos la primera alternativa y sus elementos
  const elems = ast.alternatives[0].elements ?? [];

  // construimos una lista de labels
  const nodes = elems.map((el: any, i: number) => {
    let label = el.raw ?? el.type ?? '';
    // rango [a-z] → mostrar "a-z"
    if (el.type === 'CharacterClassRange') {
      label = `${el.min.raw}-${el.max.raw}`;
    }
    return (
      <View key={i} style={[
        styles.box,
        { backgroundColor: dark ? '#333':'#4caf50' }
      ]}>
        <Text style={[
          styles.text,
          { color: dark ? '#fff':'#fff' }
        ]}>
          {label}
        </Text>
      </View>
    );
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      style={[
        styles.wrapper,
        { backgroundColor: dark? '#1a1a1a':'#f4f4f4' }
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
