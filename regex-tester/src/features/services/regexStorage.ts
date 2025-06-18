import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

const FILE_NAME = 'regex_export.json';

export async function exportRegexesToFile(expressions: string[]) {
  const fileUri = `${FileSystem.documentDirectory}${FILE_NAME}`;
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(expressions, null, 2));
  await Sharing.shareAsync(fileUri);
}

export async function importRegexesFromFile(): Promise<string[] | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
  if (result.canceled || !result.assets?.[0]) return null;

  const fileUri = result.assets[0].uri;
  const content = await FileSystem.readAsStringAsync(fileUri);
  return JSON.parse(content);
}

// 🆕 Compartir una sola expresión
export async function shareSingleRegex(expression: string) {
  if (Platform.OS === 'web') {
    alert(`Copia esta expresión:\n\n${expression}`);
    return;
  }

  try {
    const fileUri = `${FileSystem.cacheDirectory}single_regex.txt`;
    await FileSystem.writeAsStringAsync(fileUri, expression);
    await Sharing.shareAsync(fileUri);
  } catch (error) {
    Alert.alert('Error al compartir', 'No se pudo compartir la expresión.');
    console.error(error);
  }
}
