// src/features/regexTester/viewModels/useRegexTesterViewModel.ts

// Dependencias para almacenamiento local y hooks de React
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';

// Servicio que convierte una expresión regular en su AST
import { parseRegexToAST } from '../services/regexParser';

// Funciones para exportar, importar y compartir expresiones
import {
  exportRegexesToFile,
  importRegexesFromFile,
  shareSingleRegex,
} from '../services/regexStorage';

// Claves para guardar cada tipo de dato en AsyncStorage
const STORAGE_KEY_SAVED     = 'savedExpressions';
const STORAGE_KEY_HISTORY   = 'regexHistory';
const STORAGE_KEY_FAVORITES = 'regexFavorites';

export function useRegexTesterViewModel() {
  /* ---------------- estados principales ---------------- */
  // regex: patrón actual
  const [regex, setRegex]       = useState('');
  // input: texto donde probamos el patrón
  const [input, setInput]       = useState('');
  // ast: resultado del parseo de la expresión regular
  const [ast, setAST]           = useState<any>(null);

  // savedExpressions: lista de patrones guardados manualmente
  const [savedExpressions, setSavedExpressions] = useState<string[]>([]);
  // history: historial automático según uso del patrón
  const [history, setHistory]   = useState<string[]>([]);
  // favorites: patrones marcados como favoritos
  const [favorites, setFavorites] = useState<string[]>([]);

  /* -------------- carga inicial desde AsyncStorage -------------- */
  useEffect(() => {
    (async () => {
      try {
        // Leemos simultáneamente las tres listas
        const [saved, hist, favs] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_SAVED),
          AsyncStorage.getItem(STORAGE_KEY_HISTORY),
          AsyncStorage.getItem(STORAGE_KEY_FAVORITES),
        ]);
        // Si existen, las parseamos y actualizamos el estado
        if (saved) setSavedExpressions(JSON.parse(saved));
        if (hist ) setHistory         (JSON.parse(hist ));
        if (favs ) setFavorites       (JSON.parse(favs ));
      } catch (e) {
        console.error('Error al cargar datos:', e);
      }
    })();
  }, []);  // Solo al montar el hook

  /* ---------------- helper de persistencia ---------------- */
  /**
   * Guarda una lista en AsyncStorage y actualiza el estado.
   * @param key     clave en AsyncStorage
   * @param data    arreglo de strings a guardar
   * @param setter  función de setState correspondiente
   */
  const saveToStorage = async (
    key: string,
    data: string[],
    setter: (v: string[]) => void
  ) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      setter(data);  // actualizamos estado local
    } catch (e) {
      console.error(`Error guardando ${key}:`, e);
    }
  };

  /* ------ refs para historial automático ------ */
  // latestRegexRef: guarda siempre el patrón más reciente
  const latestRegexRef = useRef<string>('');
  // intervalRef: referencia al setInterval que registra el historial
  const intervalRef    = useRef<NodeJS.Timeout | null>(null);
  // idleRef: referencia al setTimeout que detiene el historial tras inactividad
  const idleRef        = useRef<NodeJS.Timeout | null>(null);

  /**
   * Inicia o reinicia el intervalo que cada 5s añade
   * el patrón actual al historial, y detiene el intervalo
   * si pasan 10s sin cambios.
   */
  const startHistoryInterval = () => {
    // Si aún no existe el intervalo, lo creamos
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const current = latestRegexRef.current.trim();
        // Actualizamos el historial en el estado y en AsyncStorage
        setHistory(prev => {
          // Evitamos entradas vacías o duplicados
          if (
            !current ||
            prev[0] === current ||   // mismo que el último
            prev.includes(current)   // ya existe en la lista
          ) return prev;

          const updated = [current, ...prev];
          AsyncStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
          return updated;
        });
      }, 5000);
    }
    // Si antes había un timeout de inactividad, lo limpiamos
    if (idleRef.current) clearTimeout(idleRef.current);
    // Programamos detener el historial tras 10s sin cambios
    idleRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 10_000);
  };

  /* --------- actualización global (input / regex) ---------- */
  /**
   * Se llama al cambiar la expresión o el texto de prueba.
   * - Actualiza estados de regex e input
   * - Guarda el nuevo patrón en latestRegexRef
   * - Recalcula el AST
   * - Arranca o reinicia el timer de historial
   */
  const handleRegexInput = (newRegex: string, newInput: string) => {
    setRegex(newRegex);
    setInput(newInput);
    latestRegexRef.current = newRegex;  // actualizamos la ref

    // Intentamos parsear a AST; si falla, AST queda en null
    try {
      setAST(parseRegexToAST(newRegex));
    } catch {
      setAST(null);
    }

    // Controlamos el historial automático
    startHistoryInterval();
  };

  /* ---------------- favoritos y CRUD básicos ---------------- */
  /**
   * Marca o desmarca un patrón como favorito.
   * Se persiste en AsyncStorage.
   */
  const toggleFavorite = (expr: string) => {
    const updated = favorites.includes(expr)
      ? favorites.filter(e => e !== expr)
      : [...favorites, expr];
    saveToStorage(STORAGE_KEY_FAVORITES, updated, setFavorites);
  };

  /**
   * Guarda el patrón actual en la lista de guardados
   * (si no existe ya).
   */
  const handleSaveRegex = () => {
    if (regex && !savedExpressions.includes(regex)) {
      saveToStorage(
        STORAGE_KEY_SAVED,
        [...savedExpressions, regex],
        setSavedExpressions
      );
    }
  };

  /** Elimina un patrón de los guardados */
  const handleDeleteRegex = (expr: string) =>
    saveToStorage(
      STORAGE_KEY_SAVED,
      savedExpressions.filter(e => e !== expr),
      setSavedExpressions
    );

  /**
   * Reemplaza `oldExpr` por `newExpr` en la lista de guardados,
   * si `newExpr` no está vacío ni duplicado.
   */
  const handleEditRegex = (oldExpr: string, newExpr: string) => {
    if (!newExpr || savedExpressions.includes(newExpr)) return;
    const updated = savedExpressions.map(e =>
      e === oldExpr ? newExpr : e
    );
    saveToStorage(STORAGE_KEY_SAVED, updated, setSavedExpressions);
  };

  /* -------- limpiar historial (mantiene favoritos) -------- */
  /**
   * Vacía el historial descartando todos los patrones
   * que no estén marcados como favoritos.
   */
  const handleClearHistory = () => {
    const kept = history.filter(e => favorites.includes(e));
    saveToStorage(STORAGE_KEY_HISTORY, kept, setHistory);
  };

  /* ------------------- export / import / share ------------------- */
  /**
   * Exporta las expresiones guardadas a un archivo.
   * Muestra alerta en caso de fallo.
   */
  const handleExportRegexes = () =>
    exportRegexesToFile(savedExpressions).catch(() =>
      Platform.OS === 'web'
        ? alert('Exportación no soportada en web.')
        : Alert.alert('Error', 'No se pudo exportar.')
    );

  /**
   * Importa expresiones desde un archivo y las añade
   * a las guardadas (sin duplicados).
   */
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

  /**
   * Comparte una expresión individual (p. ej. mediante share sheet).
   */
  const handleShareRegex = (expr: string) =>
    shareSingleRegex(expr).catch(() =>
      Platform.OS === 'web'
        ? alert('Compartir no disponible en web.')
        : Alert.alert('Error', 'No se pudo compartir.')
    );

  /* --------------------------- retorno --------------------------- */
  return {
    // Estados
    regex,
    input,
    ast,
    savedExpressions,
    history,
    favorites,

    // Setters puros (por si se quieren usar directamente)
    setRegex,
    setInput,

    // Acciones principales
    handleRegexInput,
    handleSaveRegex,
    handleDeleteRegex,
    handleEditRegex,
    handleClearHistory,
    toggleFavorite,

    // Export / Import / Share
    handleExportRegexes,
    handleImportRegexes,
    handleShareRegex,
  };
}
