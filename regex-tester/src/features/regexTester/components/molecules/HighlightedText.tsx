import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  text: string;
  pattern: string;
  highlightColor?: string;
  dark?: boolean;
}

export default function HighlightedText({
  text,
  pattern,
  highlightColor = 'yellow',
  dark = false,
}: Props) {
  const baseTextColor = dark ? '#fff' : '#000';

  if (!pattern) {
    return <Text style={[styles.text, { color: baseTextColor }]}>{text}</Text>;
  }

  try {
    const regex = new RegExp(pattern, 'g');
    const parts = [];
    let lastIndex = 0;
    let match;
    const matches: string[] = [];

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index), highlight: false });
      }
      parts.push({ text: match[0], highlight: true });
      matches.push(match[0]);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), highlight: false });
    }

    const uniqueMatches = [...new Set(matches)];

    return (
      <View>
        <Text style={styles.text}>
          {parts.map((part, index) => (
            <Text
              key={index}
              style={
                part.highlight
                  ? {
                      backgroundColor: highlightColor,
                      color: dark ? '#000' : '#000',
                      fontWeight: 'bold',
                    }
                  : {
                      color: baseTextColor,
                    }
              }
            >
              {part.text}
            </Text>
          ))}
        </Text>

        {uniqueMatches.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={[styles.heading, { color: baseTextColor }]}>
              Coincidencias encontradas:
            </Text>
            {uniqueMatches.map((word, index) => (
              <Text key={index} style={[styles.matchItem, { color: baseTextColor }]}>
                • {word}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  } catch {
    return <Text style={[styles.text, { color: baseTextColor }]}>{text}</Text>;
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  matchItem: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 2,
  },
});
