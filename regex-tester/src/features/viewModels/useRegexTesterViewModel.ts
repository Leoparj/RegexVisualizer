import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { parseRegexToAST } from '../services/regexParser';
import {
  exportRegexesToFile,
  importRegexesFromFile,
  shareSingleRegex,
} from '../services/regexStorage';

const STORAGE_KEY_SAVED     = 'savedExpressions';
const STORAGE_KEY_HISTORY   = 'regexHistory';
const STORAGE_KEY_FAVORITES = 'regexFavorites';

export function useRegexTesterViewModel() {
  /* ---------------- estados principales ---------------- */
  const [regex,  setRegex ] = useState('');
  const [input,  setInput ] = useState('');
  const [ast,    setAST   ] = useState<any>(null);

  const [savedExpressions, setSavedExpressions] = useState<string[]>([]);
  const [history,          setHistory         ] = useState<string[]>([]);
  const [favorites,        setFavorites       ] = useState<string[]>([]);

  /* -------------- carga inicial desde AsyncStorage -------------- */
  useEffect(() => {
    (async () => {
      try {
        const [saved, hist, favs] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_SAVED),
          AsyncStorage.getItem(STORAGE_KEY_HISTORY),
          AsyncStorage.getItem(STORAGE_KEY_FAVORITES),
        ]);
        if (saved) setSavedExpressions(JSON.parse(saved));
        if (hist)  setHistory(JSON.parse(hist));
        if (favs)  setFavorites(JSON.parse(favs));
      } catch (e) {
        console.error('Error al cargar datos:', e);
      }
    })();
  }, []);

  /* ---------------- helper de persistencia ---------------- */
  const saveToStorage = async (
    key: string,
    data: string[],
    setter: (v: string[]) => void
  ) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      setter(data);
    } catch (e) {
      console.error(`Error guardando ${key}:`, e);
    }
  };

  /* ------ refs para historial automático ------ */
  const latestRegexRef = useRef('');                 // <--- NUEVO
  const intervalRef    = useRef<NodeJS.Timeout | null>(null);
  const idleRef        = useRef<NodeJS.Timeout | null>(null);

  const startHistoryInterval = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const currentRegex = latestRegexRef.current.trim();
        setHistory(prev => {
          if (!currentRegex ||
              prev[0] === currentRegex ||   // evita duplicados consecutivos
              prev.includes(currentRegex))  // evita duplicados generales
            return prev;

          const updated = [currentRegex, ...prev];
          AsyncStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
          return updated;
        });
      }, 5000);
    }

    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 10_000);
  };

  /* --------- actualización global (input / regex) ---------- */
  const handleRegexInput = (newRegex: string, newInput: string) => {
    setRegex(newRegex);
    setInput(newInput);
    latestRegexRef.current = newRegex;       // <--- NUEVO

    try { setAST(parseRegexToAST(newRegex)); }
    catch { setAST(null); }

    startHistoryInterval();                  // ← ya no pasa parámetro
  };

  /* ---------------- favoritos y CRUD básicos ---------------- */
  const toggleFavorite = (expr: string) => {
    const updated = favorites.includes(expr)
      ? favorites.filter(e => e !== expr)
      : [...favorites, expr];
    saveToStorage(STORAGE_KEY_FAVORITES, updated, setFavorites);
  };

  const handleSaveRegex = () => {
    if (regex && !savedExpressions.includes(regex)) {
      saveToStorage(
        STORAGE_KEY_SAVED,
        [...savedExpressions, regex],
        setSavedExpressions
      );
    }
  };

  const handleDeleteRegex = (expr: string) =>
    saveToStorage(
      STORAGE_KEY_SAVED,
      savedExpressions.filter(e => e !== expr),
      setSavedExpressions
    );

  const handleEditRegex = (oldExpr: string, newExpr: string) => {
    if (!newExpr || savedExpressions.includes(newExpr)) return;
    const updated = savedExpressions.map(e => (e === oldExpr ? newExpr : e));
    saveToStorage(STORAGE_KEY_SAVED, updated, setSavedExpressions);
  };

  /* -------- limpiar historial (mantiene favoritos) -------- */
  const handleClearHistory = () => {
    const kept = history.filter(e => favorites.includes(e));
    saveToStorage(STORAGE_KEY_HISTORY, kept, setHistory);
  };

  /* ------------------- export / import / share ------------------- */
  const handleExportRegexes = () =>
    exportRegexesToFile(savedExpressions).catch(() =>
      Platform.OS === 'web'
        ? alert('Exportación no soportada en web.')
        : Alert.alert('Error', 'No se pudo exportar.')
    );

  const handleImportRegexes = () =>
    importRegexesFromFile()
      .then(imported => {
        if (!imported) return;
        const unique = Array.from(new Set([...savedExpressions, ...imported]));
        saveToStorage(STORAGE_KEY_SAVED, unique, setSavedExpressions);
      })
      .catch(() =>
        Platform.OS === 'web'
          ? alert('Importación no soportada en web.')
          : Alert.alert('Error', 'No se pudo importar.')
      );

  const handleShareRegex = (expr: string) =>
    shareSingleRegex(expr).catch(() =>
      Platform.OS === 'web'
        ? alert('Compartir no disponible en web.')
        : Alert.alert('Error', 'No se pudo compartir.')
    );

  /* --------------------------- retorno --------------------------- */
  return {
    regex, input, ast,
    savedExpressions, history, favorites,

    /* setters utilitarios */
    setRegex, setInput,

    /* funciones expuestas */
    handleRegexInput,
    handleSaveRegex,
    handleDeleteRegex,
    handleEditRegex,
    handleExportRegexes,
    handleImportRegexes,
    handleShareRegex,
    toggleFavorite,
    handleClearHistory,
  };
}
