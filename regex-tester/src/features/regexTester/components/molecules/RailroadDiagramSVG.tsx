// src/features/regexTester/components/molecules/RailroadDiagramSVG.tsx
import Diagram, {
    Choice,
    DiagramElement,
    Sequence,
    Terminal,
    ZeroOrMore
} from 'railroad-diagrams';
import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

/**
 * Convierte el AST de regexpp a un elemento de railroad-diagrams.
 * De momento solo soporte concatenaciones, alternancias y repeticiones (*).
 */
function astToRail(ast: any): DiagramElement {
  const nodes: DiagramElement[] = [];

  // asumimos ast.alternatives[0].elements
  const elems = (ast.alternatives && ast.alternatives[0].elements) || [];

  elems.forEach((el: any) => {
    switch (el.type) {
      case 'Character':
        nodes.push(new Terminal(el.raw));
        break;
      case 'CharacterClass':
        nodes.push(new Terminal(el.raw));
        break;
      case 'Quantifier':
        if (el.greedy && el.min === 0 && el.max === Infinity) {
          // envolvemos el elemento anterior en ZeroOrMore
          const prev = nodes.pop()!;
          nodes.push(new ZeroOrMore(prev, { label: '' }));
        } else {
          nodes.push(new Terminal(el.raw));
        }
        break;
      case 'Alternative':
      case 'Assertion':
      default:
        nodes.push(new Terminal(el.raw ?? el.type));
    }
  });

  // si hay más de una rama (alternative), usamos Choice
  if (ast.alternatives.length > 1) {
    const branches = ast.alternatives.map((alt: any) =>
      new Sequence(...(alt.elements || []).map((e: any) => new Terminal(e.raw)))
    );
    return new Choice(0, ...branches);
  }

  // secuencia simple
  return new Sequence(...nodes);
}

export default function RailroadDiagramSVG({ ast }: { ast: any }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ast || !container.current) return;

    // Generamos el diagrama
    const railway = astToRail(ast);
    const svg = Diagram.format(railway, {
      // opciones de estilo
      'font-size': '12pt',
      'padding': '8',
      'stroke-width': '2',
    });

    // inyectamos el SVG en el DOM
    container.current.innerHTML = '';
    container.current.appendChild(svg);
  }, [ast]);

  // En web anulamos la View y dejamos un div
  if (Platform.OS === 'web') {
    return <div ref={container} style={{ overflowX: 'auto' }} />;
  }

  // En móvil lo metemos en un WebView
  return (
    <View style={styles.wrapper}>
      {/* 
        Aquí podrías usar react-native-webview y pasar el SVG como HTML.
        Para simplificar, lo omitimos; en RN puro es más complejo.
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
    width: '100%',
  },
});
