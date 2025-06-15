import React from 'react';
import {
    Alert,
    Button,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function SavedRegexList({
  expressions,
  onDelete,
  onSelect,
}: {
  expressions: string[];
  onDelete: (expr: string) => void;
  onSelect: (expr: string) => void;
}) {
  const confirmDelete = (expr: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`¿Seguro que quieres eliminar "${expr}"?`);
      if (confirmed) onDelete(expr);
    } else {
      Alert.alert(
        '¿Eliminar expresión?',
        `¿Seguro que quieres eliminar "${expr}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(expr) },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expresiones Guardadas:</Text>
      {expressions.map((expr, idx) => (
        <View key={idx} style={styles.item}>
          <Pressable onPress={() => onSelect(expr)} style={styles.textPress}>
            <Text style={styles.expr}>{expr}</Text>
          </Pressable>
          <Button title="Eliminar" onPress={() => confirmDelete(expr)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 30 },
  title: { fontWeight: 'bold', marginBottom: 10 },
  item: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expr: {
    flex: 1,
    marginRight: 10,
    fontSize: 14,
  },
  textPress: {
    flex: 1,
  },
});
