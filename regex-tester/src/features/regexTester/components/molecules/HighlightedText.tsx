// Resalta en línea las coincidencias de la expresión regular dentro del texto
// y lista las coincidencias encontradas abajo.
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
  // Color base para texto normal
  const baseTextColor = dark ? '#fff' : '#000';

  // Si no hay patrón, mostrar texto completo sin resaltado
  if (!pattern) {
    return <Text style={[styles.text, { color: baseTextColor }]}>{text}</Text>;
  }

  try {
    const regex = new RegExp(pattern, 'g');
    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;
    let match;
    const matches: string[] = [];

    // Iterar todas las coincidencias
    while ((match = regex.exec(text)) !== null) {
      // Texto previo no resaltado
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index), highlight: false });
      }
      // Texto coincidencia
      parts.push({ text: match[0], highlight: true });
      matches.push(match[0]);
      lastIndex = regex.lastIndex;
    }
    // Resto después de última coincidencia
    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), highlight: false });
    }

    // Unificar coincidencias únicas
    const uniqueMatches = [...new Set(matches)];

    return (
      <View>
        {/* Texto con partes resaltadas */}
        <Text style={styles.text}>
          {parts.map((part, index) => (
            <Text
              key={index}
              style={
                part.highlight
                  ? {
                      backgroundColor: highlightColor,
                      color: '#000',
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

        {/* Listado de coincidencias encontradas */}
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
    // En caso de expresión inválida, mostrar texto completo
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
