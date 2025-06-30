// src/features/regexTester/components/molecules/ASTViewer.tsx
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { safeStringify } from '../../../../utils/safeStringify';
import TreeDiagram from './TreeDiagram';

type ViewMode = 'json' | 'tree' | 'rail';

export default function ASTViewer({ ast }: { ast: any }) {
  const [view, setView] = useState<ViewMode>('json');
  const [zoom, setZoom] = useState<number>(1);
  const isDark = useColorScheme() === 'dark';
  const styles = createStyles(isDark);

  if (!ast) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AST (Árbol de Sintaxis Abstracta):</Text>

      {/* ── PESTAÑAS ────────────────────────────── */}
      <View style={styles.tabBar}>
        {(['json','tree','rail'] as const).map(v => (
          <Pressable
            key={v}
            style={[styles.tab, view === v && styles.tabActive]}
            onPress={() => setView(v)}
          >
            <Text style={view === v ? styles.tabTextActive : styles.tabText}>
              {v === 'json'
                ? 'JSON'
                : v === 'tree'
                ? 'Árbol'
                : 'Ferrocarril'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── JSON VIEW ──────────────────────────── */}
      {view === 'json' && (
        <ScrollView style={styles.jsonContainer}>
          <Text style={styles.jsonText}>{safeStringify(ast, null, 2)}</Text>
        </ScrollView>
      )}

      {/* ── TREE VIEW ─────────────────────────── */}
      {view === 'tree' && (
        <>
          {/* Controles de zoom */}
          <View style={styles.zoomControls}>
            <Pressable
              style={styles.zoomBtn}
              onPress={() => setZoom(z => Math.min(z + 0.2, 3))}
            >
              <Text style={styles.zoomTxt}>＋</Text>
            </Pressable>
            <Pressable
              style={styles.zoomBtn}
              onPress={() => setZoom(z => Math.max(z - 0.2, 0.4))}
            >
              <Text style={styles.zoomTxt}>－</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ flexGrow: 1 }}
            style={styles.treeScrollH}
          >
            <ScrollView style={styles.treeScrollV}>
              <TreeDiagram ast={ast} dark={isDark} zoom={zoom} />
            </ScrollView>
          </ScrollView>
        </>
      )}

      {/* ── RAIL VIEW (antes ASCII) ───────────── */}
      {view === 'rail' && (
        <ScrollView style={styles.asciiContainer}>
          <Text style={styles.asciiText}>{asciiRail(ast)}</Text>
        </ScrollView>
      )}
    </View>
  );
}

/**
 * Genera una línea ASCII (convertida ahora en la vista "Ferrocarril")
 * Ejemplo: INICIO ──► (a|b)* ──► c ──► FIN
 */
function asciiRail(ast: any): string {
  const pat = ast.alternatives?.[0];
  if (!pat?.elements) return '— AST no soportado para Ferrocarril —';

  const parts = pat.elements.map((e: any) => {
    if (e.type === 'Quantifier' && e.element) {
      const inner = e.element.raw ?? e.element.type;
      return `${inner}${e.raw}`;
    }
    if (typeof e.raw === 'string') return e.raw;
    if (e.type === 'Group') {
      const inside = e.alternatives?.[0].elements
        .map((c:any) => c.raw||c.type)
        .join('');
      return `(${inside})`;
    }
    return e.type;
  });

  return `INICIO ──► ${parts.join(' ──► ')} ──► FIN`;
}

const createStyles = (dark: boolean) =>
  StyleSheet.create({
    container: { marginTop: 20 },
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 6,
      color: dark ? '#fff' : '#000',
    },
    tabBar: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: dark ? '#555' : '#ccc',
      marginBottom: 8,
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
    },
    tabActive: {
      borderBottomWidth: 2,
      borderColor: '#4caf50',
    },
    tabText: {
      color: dark ? '#aaa' : '#666',
      fontWeight: '600',
    },
    tabTextActive: {
      color: '#4caf50',
      fontWeight: '700',
    },
    jsonContainer: {
      maxHeight: 300,
      backgroundColor: dark ? '#1a1a1a' : '#f4f4f4',
      borderRadius: 6,
      padding: 10,
    },
    jsonText: {
      fontFamily: 'monospace',
      color: dark ? '#fff' : '#000',
    },
    zoomControls: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
      marginBottom: 8,
    },
    zoomBtn: {
      padding: 6,
      borderRadius: 4,
      backgroundColor: dark ? '#333' : '#e0e0e0',
    },
    zoomTxt: {
      fontSize: 18,
      color: dark ? '#fff' : '#000',
    },
    treeScrollH: { maxHeight: 400 },
    treeScrollV: { flex: 1 },
    asciiContainer: {
      backgroundColor: dark ? '#1a1a1a' : '#fafafa',
      padding: 12,
      borderRadius: 6,
    },
    asciiText: {
      fontFamily: 'monospace',
      color: dark ? '#fff' : '#000',
      lineHeight: 20,
    },
  });
