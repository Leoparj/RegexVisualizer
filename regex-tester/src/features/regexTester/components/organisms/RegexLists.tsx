import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  title: string;
  expressions: string[];
  onPressItem?: (expression: string) => void;
}

export default function RegexListSection({ title, expressions, onPressItem }: Props) {
  if (expressions.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {expressions.map((expr, idx) => (
        <Pressable key={idx} onPress={() => onPressItem?.(expr)} style={styles.item}>
          <Text style={styles.itemText}>{expr}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
});
