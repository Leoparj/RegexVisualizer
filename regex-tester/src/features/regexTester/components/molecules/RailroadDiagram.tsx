// src/features/regexTester/components/molecules/RailroadDiagram.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';

interface RNode {
  label: string;
  children: RNode[];
}

interface Positioned {
  node: RNode;
  x: number;
  y: number;
}

// Parámetros para cálculo dinámico de radio
const BASE_RADIUS = 12;    // radio mínimo en px
const CHAR_FACTOR = 4;     // px extra por carácter de la etiqueta
const H_SPACING = 80;      // separación horizontal base
const V_SPACING = 100;     // separación vertical base

/** Construye un árbol de RNode a partir del AST */
function buildRNode(ast: any): RNode {
  const label = ast.raw ?? ast.type ?? 'Node';
  const children: RNode[] = [];

  for (const [key, val] of Object.entries(ast)) {
    if (key === 'parent') continue;
    if (Array.isArray(val)) {
      val.forEach((child: any) => {
        if (child && typeof child === 'object') {
          children.push(buildRNode(child));
        }
      });
    } else if (val && typeof val === 'object' && 'type' in val) {
      children.push(buildRNode(val));
    }
  }

  return { label, children };
}

/** Asigna coordenadas a cada nodo; devuelve posiciones, ancho total y profundidad máxima */
function layoutTree(
  node: RNode,
  depth = 0,
  xOffset = 0
): { positions: Positioned[]; width: number; maxDepth: number } {
  if (node.children.length === 0) {
    const width = 1;
    const x = xOffset + 0.5;
    return { positions: [{ node, x, y: depth }], width, maxDepth: depth };
  }

  let positions: Positioned[] = [];
  let totalWidth = 0;
  let maxDepth = depth;
  let childX = xOffset;

  node.children.forEach(child => {
    const { positions: childPos, width: cw, maxDepth: cd } = layoutTree(
      child,
      depth + 1,
      childX
    );
    positions = positions.concat(childPos);
    totalWidth += cw;
    childX += cw;
    maxDepth = Math.max(maxDepth, cd);
  });

  const px = xOffset + totalWidth / 2;
  positions.push({ node, x: px, y: depth });

  return { positions, width: totalWidth, maxDepth };
}

export default function RailroadDiagram({
  ast,
  dark = false,
}: {
  ast: any;
  dark?: boolean;
}) {
  if (
    !ast ||
    typeof ast !== 'object' ||
    !Array.isArray(ast.alternatives) ||
    ast.alternatives.length === 0
  ) {
    return null;
  }

  // raíz: primera alternativa
  const rootAst = ast.alternatives[0];
  const tree = buildRNode(rootAst);
  const { positions, width, maxDepth } = layoutTree(tree);

  // calcular radio máximo para ajustar dimensiones SVG
  const allRadii = positions.map(p =>
    Math.max(BASE_RADIUS, p.node.label.length * CHAR_FACTOR)
  );
  const maxRadius = Math.max(...allRadii, BASE_RADIUS);

  const svgWidth = width * H_SPACING + maxRadius * 2;
  const svgHeight = (maxDepth + 1) * V_SPACING + maxRadius * 2;

  // colores según tema
  const lineColor = '#888';
  const nodeFill = dark ? '#444' : '#ace';
  const nodeStroke = dark ? '#6af' : '#48a';
  const textColor = dark ? '#fff' : '#000';
  const tooltipBg = dark ? '#222' : '#fff';
  const tooltipText = dark ? '#fff' : '#000';

  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  return (
    <View style={styles.wrapper}>
      <Svg width={svgWidth} height={svgHeight}>
        {positions.map(({ node }) =>
          node.children.map(child => {
            const from = positions.find(p => p.node === node)!;
            const to = positions.find(p => p.node === child)!;
            // radio dinámico para cada nodo
            const rFrom = Math.max(BASE_RADIUS, node.label.length * CHAR_FACTOR);
            const rTo = Math.max(BASE_RADIUS, child.label.length * CHAR_FACTOR);
            const x1 = from.x * H_SPACING + rFrom;
            const y1 = from.y * V_SPACING + rFrom;
            const x2 = to.x * H_SPACING + rTo;
            const y2 = to.y * V_SPACING + rTo;
            return (
              <Line
                key={`${x1}-${y1}-${x2}-${y2}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={lineColor}
                strokeWidth={2}
              />
            );
          })
        )}

        {positions.map(({ node, x, y }, i) => {
          const r = Math.max(BASE_RADIUS, node.label.length * CHAR_FACTOR);
          const cx = x * H_SPACING + r;
          const cy = y * V_SPACING + r;
          return (
            <G key={i} onPress={() => setTooltip({ x: cx, y: cy, text: node.label })}>
              <Circle
                cx={cx}
                cy={cy}
                r={r}
                fill={nodeFill}
                stroke={nodeStroke}
                strokeWidth={2}
              />
              <SvgText
                x={cx}
                y={cy + 4}
                fontSize="12"
                fontWeight="bold"
                fill={textColor}
                textAnchor="middle"
              >
                {node.label}
              </SvgText>
            </G>
          );
        })}
      </Svg>

      {tooltip && (
        <View
          style={[
            styles.tooltip,
            { backgroundColor: tooltipBg, top: tooltip.y + 8, left: tooltip.x + 8 },
          ]}
        >
          <Text style={[styles.tooltipText, { color: tooltipText }]}>
            {tooltip.text}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
    alignItems: 'center',
    position: 'relative', // para tooltip
  },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    elevation: 2,
  },
  tooltipText: {
    fontSize: 12,
  },
});
