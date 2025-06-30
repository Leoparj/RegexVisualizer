// src/services/regexStorage.ts

/**
 * Gestión de importación/exportación y compartición de expresiones
 * regulares en distintos formatos y plataformas.
 */

import * as DocumentPicker from 'expo-document-picker'; // Selector de archivos en móvil
import * as FileSystem from 'expo-file-system'; // Acceso al sistema de archivos
import * as Sharing from 'expo-sharing'; // Módulo de compartir nativo
import { Alert, Platform } from 'react-native'; // API de plataforma

// Nombre de archivo por defecto para exportaciones
const FILE_NAME = 'regex_export.json';

/**
 * Exporta el listado de expresiones a un archivo JSON
 * y abre el diálogo nativo para compartirlo.
 * @param expressions Array de cadenas con las expresiones a exportar
 */
export async function exportRegexesToFile(expressions: string[]) {
  // Construye la URI donde guardaremos el JSON
  const fileUri = `${FileSystem.documentDirectory}${FILE_NAME}`;
  // Escribe el JSON formateado en el archivo
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(expressions, null, 2));
  // Lanza el diálogo de compartir del sistema operativo
  await Sharing.shareAsync(fileUri);
}

/**
 * Importa expresiones desde un archivo JSON elegido por el usuario.
 * @returns Array de expresiones o null si se cancela la operación.
 */
export async function importRegexesFromFile(): Promise<string[] | null> {
  // Abre el selector de archivos filtrando solo JSON
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
  if (result.canceled || !result.assets?.[0]) return null;

  // Lee el contenido del archivo seleccionado
  const fileUri = result.assets[0].uri;
  const content = await FileSystem.readAsStringAsync(fileUri);
  // Parsea y devuelve el array de expresiones
  return JSON.parse(content);
}

/**
 * Comparte una sola expresión.
 * - En web: muestra un alert con la cadena para que el usuario la copie.
 * - En móvil: escribe la expresión en un archivo de texto y abre compartir.
 * @param expression Cadena de la expresión a compartir
 */
export async function shareSingleRegex(expression: string) {
  if (Platform.OS === 'web') {
    // En web no hay API nativa de compartir, pedimos copiar manualmente.
    alert(`Copia esta expresión:\n\n${expression}`);
    return;
  }

  try {
    // Escribimos un archivo de texto temporal con la expresión
    const fileUri = `${FileSystem.cacheDirectory}single_regex.txt`;
    await FileSystem.writeAsStringAsync(fileUri, expression);
    // Abrimos diálogo nativo de compartir
    await Sharing.shareAsync(fileUri);
  } catch (error) {
    // Si falla, mostramos alerta y dejamos rastro en consola
    Alert.alert('Error al compartir', 'No se pudo compartir la expresión.');
    console.error(error);
  }
}
