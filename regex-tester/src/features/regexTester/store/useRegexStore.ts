// src/features/regexTester/store/useRegexStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { parseRegexToAST } from '../../services/regexParser';
import {
  exportRegexesToFile,
  importRegexesFromFile,
  shareSingleRegex,
} from '../../services/regexStorage';

import {
  addToHistory,
  clearHistoryDb,
  getHistory,
  initRegexHistoryTable,
} from './regexHistoryDbService';

type State = {
  regex: string;
  input: string;
  ast: any;
  saved: string[];
  history: string[];
  favs: string[];

  _interval?: NodeJS.Timeout;
  _idle?: NodeJS.Timeout;

  setRegexInput: (regex: string, input: string) => void;
  saveRegex: () => void;
  deleteRegex: (expr: string) => void;
  editRegex: (oldExpr: string, newExpr: string) => void;
  clearHistory: () => void;
  toggleFav: (expr: string) => void;
  exportAll: () => Promise<void>;
  importAll: () => Promise<void>;
  shareExpr: (expr: string) => Promise<void>;
  loadHistory: () => Promise<void>;
};

export const useRegexStore = create<State>()(
  persist(
    (set, get) => ({
      // ───────── Estado inicial ─────────
      regex: '',
      input: '',
      ast: null,
      saved: [],
      history: [],
      favs: [],

      // ───────── setRegexInput ─────────
setRegexInput: (newRegex, newInput) => {
  set({ regex: newRegex, input: newInput, ast: parseRegexToAST(newRegex) });

  const { _interval, _idle } = get();

  // Guarda la expresión al historial (cada 5s)
  // Solo inicia un nuevo intervalo si no hay uno activo
  if (!_interval) {
    const id = setInterval(() => {
      const { regex } = get();
      if (regex?.trim()) {
        addToHistory(regex.trim()).then(() => {
          get().loadHistory();
        });
      }
    }, 5000); // cada 5 segundos
    set({ _interval: id });
  }

  // Reinicia el timeout de inactividad a 10 segundos
  if (_idle) clearTimeout(_idle);
  const idleId = setTimeout(() => {
    const { _interval: iv } = get();
    if (iv) clearInterval(iv);
    set({ _interval: undefined, _idle: undefined });
  }, 10000);
  set({ _idle: idleId });
},


      // ───────── loadHistory (nuevo) ─────────
      loadHistory: async () => {
        await initRegexHistoryTable();
        const patterns = await getHistory();
        set({ history: patterns });
      },

      // ───────── saveRegex ─────────
      saveRegex: () => {
        const { regex, saved } = get();
        if (regex && !saved.includes(regex)) {
          const updated = [...saved, regex];
          set({ saved: updated });
          AsyncStorage.setItem('savedExpressions', JSON.stringify(updated));
        }
      },

      // ───────── deleteRegex ─────────
      deleteRegex: expr => {
        const updated = get().saved.filter(e => e !== expr);
        set({ saved: updated });
        AsyncStorage.setItem('savedExpressions', JSON.stringify(updated));
      },

      // ───────── editRegex ─────────
      editRegex: (oldExpr, newExpr) => {
        if (!newExpr) return;
        set(({ saved }) => {
          if (saved.includes(newExpr)) return { saved };
          const updated = saved.map(e => (e === oldExpr ? newExpr : e));
          AsyncStorage.setItem('savedExpressions', JSON.stringify(updated));
          return { saved: updated };
        });
      },

      // ───────── clearHistory ─────────
      clearHistory: () => {
        clearHistoryDb().then(() => set({ history: [] }));
      },

      // ───────── toggleFav ─────────
      toggleFav: expr => {
        set(({ favs }) => {
          const updated = favs.includes(expr)
            ? favs.filter(e => e !== expr)
            : [...favs, expr];
          AsyncStorage.setItem('regexFavorites', JSON.stringify(updated));
          return { favs: updated };
        });
      },

      // ───────── exportAll ─────────
      exportAll: async () => {
        try {
          await exportRegexesToFile(get().saved);
        } catch {
          Platform.OS === 'web'
            ? alert('Exportación no soportada en web.')
            : Alert.alert('Error', 'No se pudo exportar.');
        }
      },

      // ───────── importAll ─────────
      importAll: async () => {
        try {
          const imported = await importRegexesFromFile();
          if (!imported) return;
          const unique = Array.from(new Set([...get().saved, ...imported]));
          set({ saved: unique });
          AsyncStorage.setItem('savedExpressions', JSON.stringify(unique));
        } catch {
          Platform.OS === 'web'
            ? alert('Importación no soportada en web.')
            : Alert.alert('Error', 'No se pudo importar.');
        }
      },

      // ───────── shareExpr ─────────
      shareExpr: async expr => {
        try {
          await shareSingleRegex(expr);
        } catch {
          Platform.OS === 'web'
            ? alert('Compartir no disponible en web.')
            : Alert.alert('Error', 'No se pudo compartir.');
        }
      },
    }),
    {
      name: 'regex-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        regex: state.regex,
        input: state.input,
        saved: state.saved,
        history: state.history,
        favs: state.favs,
      }),
    }
  )
);
