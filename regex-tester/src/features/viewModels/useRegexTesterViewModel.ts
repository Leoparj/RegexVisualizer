import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { parseRegexToAST } from '../services/regexParser';
import {
  exportRegexesToFile,
  importRegexesFromFile,
  shareSingleRegex,
} from '../services/regexStorage';

const STORAGE_KEY = 'savedExpressions';

export function useRegexTesterViewModel() {
  const [regex, setRegex] = useState('');
  const [input, setInput] = useState('');
  const [ast, setAST] = useState<any>(null);
  const [savedExpressions, setSavedExpressions] = useState<string[]>([]);

  useEffect(() => {
    const loadExpressions = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setSavedExpressions(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Error al cargar las expresiones guardadas:', e);
      }
    };
    loadExpressions();
  }, []);

  const saveExpressionsToStorage = async (expressions: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expressions));
    } catch (e) {
      console.error('Error al guardar las expresiones:', e);
    }
  };

  const handleTestRegex = (newRegex: string, newInput: string) => {
    try {
      const astResult = parseRegexToAST(newRegex);
      setAST(astResult);
    } catch {
      setAST(null);
    }
  };

  const handleSaveRegex = async () => {
    if (regex && !savedExpressions.includes(regex)) {
      const updated = [...savedExpressions, regex];
      setSavedExpressions(updated);
      await saveExpressionsToStorage(updated);
    }
  };

  const handleDeleteRegex = async (expressionToDelete: string) => {
    const updated = savedExpressions.filter(expr => expr !== expressionToDelete);
    setSavedExpressions(updated);
    await saveExpressionsToStorage(updated);
  };

  const handleEditRegex = async (oldExpr: string, newExpr: string) => {
    if (!newExpr || savedExpressions.includes(newExpr)) return;

    const updated = savedExpressions.map(expr =>
      expr === oldExpr ? newExpr : expr
    );
    setSavedExpressions(updated);
    await saveExpressionsToStorage(updated);
  };

  const handleExportRegexes = async () => {
    try {
      await exportRegexesToFile(savedExpressions);
    } catch (e) {
      console.error('Error al exportar:', e);
      if (Platform.OS === 'web') {
        alert('Exportación no soportada en web. Usa un dispositivo móvil.');
      } else {
        Alert.alert('Error', 'No se pudo exportar las expresiones.');
      }
    }
  };

  const handleImportRegexes = async () => {
    try {
      const imported = await importRegexesFromFile();
      if (imported) {
        const unique = Array.from(new Set([...savedExpressions, ...imported]));
        setSavedExpressions(unique);
        await saveExpressionsToStorage(unique);
      }
    } catch (e) {
      console.error('Error al importar:', e);
      if (Platform.OS === 'web') {
        alert('Importación no soportada en web. Usa un dispositivo móvil.');
      } else {
        Alert.alert('Error', 'No se pudo importar las expresiones.');
      }
    }
  };

  const handleShareRegex = async (expression: string) => {
    try {
      await shareSingleRegex(expression);
    } catch (e) {
      console.error('Error al compartir:', e);
      if (Platform.OS === 'web') {
        alert('Compartir no está disponible en web.');
      } else {
        Alert.alert('Error', 'No se pudo compartir la expresión.');
      }
    }
  };

  return {
    regex,
    input,
    ast,
    savedExpressions,
    setRegex,
    setInput,
    handleTestRegex,
    handleSaveRegex,
    handleDeleteRegex,
    handleEditRegex,
    handleExportRegexes,
    handleImportRegexes,
    handleShareRegex, // ✅ agregado aquí
  };
}
