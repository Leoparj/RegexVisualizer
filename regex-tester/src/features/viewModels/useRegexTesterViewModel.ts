// src/features/viewModels/useRegexTesterViewModel.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { parseRegexToAST } from '../services/regexParser';

const STORAGE_KEY = 'savedExpressions';

export function useRegexTesterViewModel() {
  const [regex, setRegex] = useState('');
  const [input, setInput] = useState('');
  const [ast, setAST] = useState<any>(null);
  const [savedExpressions, setSavedExpressions] = useState<string[]>([]);

  // Cargar expresiones al inicio
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
    await AsyncStorage.setItem('savedRegexes', JSON.stringify(updated));
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
  };
}