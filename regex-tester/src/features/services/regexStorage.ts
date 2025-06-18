import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const FILE_NAME = 'regex_export.json';

export async function exportRegexesToFile(expressions: string[]) {
  const fileUri = `${FileSystem.documentDirectory}${FILE_NAME}`;

  // Guardar el contenido en formato JSON
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(expressions, null, 2));

  // Compartir el archivo si es compatible
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  } else {
    throw new Error('La exportación no está disponible en esta plataforma.');
  }
}

export async function importRegexesFromFile(): Promise<string[] | null> {
  // Abrir el selector de documentos
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });

  // Validar que no se haya cancelado
  if (result.canceled || !result.assets?.[0]) return null;

  const fileUri = result.assets[0].uri;

  // Leer el contenido del archivo seleccionado
  const content = await FileSystem.readAsStringAsync(fileUri);
  return JSON.parse(content);
}
