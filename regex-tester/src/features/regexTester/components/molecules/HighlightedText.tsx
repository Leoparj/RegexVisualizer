import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  text: string;
  pattern: string;
}

export default function HighlightedText({ text, pattern }: Props) {
  if (!pattern) return <Text style={styles.text}>{text}</Text>;

  try {
    const regex = new RegExp(pattern, 'g');
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index), highlight: false });
      }
      parts.push({ text: match[0], highlight: true });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), highlight: false });
    }

    return (
      <Text style={styles.text}>
        {parts.map((part, index) =>
          part.highlight ? (
            <Text key={index} style={styles.highlight}>
              {part.text}
            </Text>
          ) : (
            <Text key={index}>{part.text}</Text>
          )
        )}
      </Text>
    );
  } catch (e) {
    return <Text style={styles.text}>{text}</Text>;
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  highlight: {
    backgroundColor: 'yellow',
    color: 'black',
    fontWeight: 'bold',
  },
});
