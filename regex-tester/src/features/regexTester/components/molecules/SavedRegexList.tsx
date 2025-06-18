import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
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
  onEdit,
}: {
  expressions: string[];
  onDelete: (expr: string) => void;
  onSelect: (expr: string) => void;
  onEdit: (oldExpr: string, newExpr: string) => void;
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

  const promptEdit = (expr: string) => {
    if (Platform.OS === 'web') {
      const edited = window.prompt('Editar expresión:', expr);
      if (edited && edited !== expr) {
        onEdit(expr, edited.trim());
      }
    } else {
      Alert.prompt?.(
        'Editar expresión',
        'Modifica la expresión guardada:',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Guardar',
            onPress: (edited) => {
              if (edited && edited !== expr) {
                onEdit(expr, edited.trim());
              }
            },
          },
        ],
        'plain-text',
        expr
      );
    }
  };

  const handleShare = async (expr: string) => {
    try {
      if (Platform.OS === 'web') {
        alert(`Expresión copiada:\n\n${expr}`);
        await navigator.clipboard.writeText(expr);
        return;
      }

      const fileUri = `${FileSystem.cacheDirectory}expression.txt`;
      await FileSystem.writeAsStringAsync(fileUri, expr);
      await Sharing.shareAsync(fileUri);
    } catch (e) {
      console.error('Error al compartir expresión:', e);
      Alert.alert('Error', 'No se pudo compartir la expresión.');
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
          <Button title="Editar" onPress={() => promptEdit(expr)} />
          <Button title="Eliminar" onPress={() => confirmDelete(expr)} />
          <Button title="Compartir" onPress={() => handleShare(expr)} />
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
    flexWrap: 'wrap',
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
