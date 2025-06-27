<<<<<<< Updated upstream
=======
import { MaterialIcons } from '@expo/vector-icons';
>>>>>>> Stashed changes
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React from 'react';
import {
  Alert,
<<<<<<< Updated upstream
  Button,
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  dark = false,
>>>>>>> Stashed changes
}: {
  expressions: string[];
  onDelete: (expr: string) => void;
  onSelect: (expr: string) => void;
  onEdit: (oldExpr: string, newExpr: string) => void;
<<<<<<< Updated upstream
=======
  dark?: boolean;
>>>>>>> Stashed changes
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
          { text: 'Cancelar', style: 'cancel' },
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

<<<<<<< Updated upstream
=======
  const styles = createStyles(dark);

>>>>>>> Stashed changes
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expresiones Guardadas:</Text>
      {expressions.map((expr, idx) => (
        <View key={idx} style={styles.item}>
          <Pressable onPress={() => onSelect(expr)} style={styles.textPress}>
            <Text style={styles.expr}>{expr}</Text>
          </Pressable>
<<<<<<< Updated upstream
          <Button title="Editar" onPress={() => promptEdit(expr)} />
          <Button title="Eliminar" onPress={() => confirmDelete(expr)} />
          <Button title="Compartir" onPress={() => handleShare(expr)} />
=======

          <View style={styles.actions}>
            <Pressable onPress={() => promptEdit(expr)} style={[styles.actionBtn, styles.edit]}>
              <MaterialIcons name="edit" size={18} color="#fff" />
            </Pressable>

            <Pressable onPress={() => confirmDelete(expr)} style={[styles.actionBtn, styles.delete]}>
              <MaterialIcons name="delete" size={18} color="#fff" />
            </Pressable>

            <Pressable onPress={() => handleShare(expr)} style={[styles.actionBtn, styles.share]}>
              <MaterialIcons name="share" size={18} color="#fff" />
            </Pressable>
          </View>
>>>>>>> Stashed changes
        </View>
      ))}
    </View>
  );
}

<<<<<<< Updated upstream
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
=======
const createStyles = (dark: boolean) =>
  StyleSheet.create({
    container: { marginTop: 30 },
    title: {
      fontWeight: 'bold',
      marginBottom: 10,
      fontSize: 16,
      color: dark ? '#fff' : '#000',
    },
    item: {
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: dark ? '#333' : '#f5f5f5',
      borderRadius: 8,
      padding: 10,
    },
    expr: {
      fontSize: 14,
      color: dark ? '#fff' : '#000',
    },
    textPress: {
      flex: 1,
    },
    actions: {
      flexDirection: 'row',
      gap: 6,
      marginLeft: 10,
    },
    actionBtn: {
      padding: 6,
      borderRadius: 6,
    },
    edit: {
      backgroundColor: '#2196F3',
    },
    delete: {
      backgroundColor: '#f44336',
    },
    share: {
      backgroundColor: '#9c27b0',
    },
  });
>>>>>>> Stashed changes
