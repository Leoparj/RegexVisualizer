// src/features/regexTester/components/molecules/TreeDiagram.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, Line, Text as SvgText } from 'react-native-svg';

interface RNode {
  label: string;
  children: RNode[];
}
interface Positioned { node: RNode; x: number; y: number; }

const MIN_RY = 12;      // altura fija
const MAX_RX = 60;      // ancho máximo
const CHAR_W = 6;       // ancho aproximado por caracter
const H_SP = 100;       // espaciado horizontal base
const V_SP = 120;       // espaciado vertical

/** Mapea un nodo AST de regexpp a la etiqueta que queremos */
function mapLabel(ast: any): string {
  switch (ast.type) {
    case 'Pattern':
    case 'Alternative':
      return 'CONCAT';
    case 'Quantifier':
      // Solo manejamos '*' aquí:
      if (ast.raw === '*') return 'STAR';
      return `QUANT(${ast.raw})`;
    case 'CapturingGroup':
    case 'Group':
      return 'ALT';
    case 'CharacterClassRange':
      return `${ast.min.raw}-${ast.max.raw}`;
    case 'Character':
      return ast.raw;
    default:
      // assertion, charClass, etc.
      return ast.raw ?? ast.type;
  }
}

/** Construye un RNode a partir del AST */
function buildRNode(ast: any): RNode {
  const label = mapLabel(ast);
  const children: RNode[] = [];

  // recorremos propiedades que contienen nodos hijos
  for (const [key, val] of Object.entries(ast)) {
    if (key === 'parent') continue;
    if (Array.isArray(val)) {
      val.forEach((c: any) => {
        if (c && typeof c === 'object' && 'type' in c) {
          children.push(buildRNode(c));
        }
      });
    } else if (val && typeof val === 'object' && 'type' in val) {
      children.push(buildRNode(val));
    }
  }
  return { label, children };
}

/** Layout del árbol */
function layoutTree(
  node: RNode,
  depth = 0,
  xOffset = 0
): { positions: Positioned[]; width: number; maxDepth: number } {
  if (!node.children.length) {
    return {
      positions: [{ node, x: xOffset + 0.5, y: depth }],
      width: 1,
      maxDepth: depth,
    };
  }
  let positions: Positioned[] = [];
  let totalWidth = 0;
  let maxDepth = depth;
  let childX = xOffset;

  for (const child of node.children) {
    const { positions: cp, width: cw, maxDepth: cd } = layoutTree(
      child,
      depth + 1,
      childX
    );
    positions = positions.concat(cp);
    totalWidth += cw;
    childX += cw;
    maxDepth = Math.max(maxDepth, cd);
  }
  // centro del padre
  const px = xOffset + totalWidth / 2;
  positions.push({ node, x: px, y: depth });

  return { positions, width: totalWidth, maxDepth };
}

export default function TreeDiagram({
  ast,
  dark = false,
  zoom = 1,
}: {
  ast: any;
  dark?: boolean;
  zoom?: number;
}) {
  // validamos
  if (
    !ast ||
    typeof ast !== 'object' ||
    !Array.isArray(ast.alternatives) ||
    ast.alternatives.length === 0
  ) {
    return null;
  }

  // arrancamos con la primera alternativa
  const rootAst = ast.alternatives[0];
  const tree = buildRNode(rootAst);
  const { positions, width, maxDepth } = layoutTree(tree);

  // dimensiones svg
  const svgWidth = width * H_SP + MAX_RX * 2;
  const svgHeight = (maxDepth + 1) * V_SP + MIN_RY * 2;

  const lineColor = '#888';
  const fillColor = dark ? '#444' : '#ace';
  const strokeColor = dark ? '#6af' : '#48a';
  const textColor = dark ? '#fff' : '#000';

  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  return (
    <View style={styles.wrapper}>
      <Svg
        width={svgWidth}
        height={svgHeight}
        style={{ transform: [{ scale: zoom }] }}
      >
        {/* Líneas padre→hijo */}
        {positions.map((p) =>
          p.node.children.map((child, i) => {
            const from = positions.find((x) => x.node === p.node)!;
            const to = positions.find((x) => x.node === child)!;
            const rxFrom = Math.min(
              Math.max((p.node.label.length * CHAR_W) / 2 + 8, MIN_RY),
              MAX_RX
            );
            const rxTo = Math.min(
              Math.max((child.label.length * CHAR_W) / 2 + 8, MIN_RY),
              MAX_RX
            );
            const ry = MIN_RY;
            const x1 = from.x * H_SP + rxFrom;
            const y1 = from.y * V_SP + ry;
            const x2 = to.x * H_SP + rxTo;
            const y2 = to.y * V_SP + ry;
            return (
              <Line
                key={`${i}-${x1}-${y1}-${x2}-${y2}`}
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

        {/* Nodos */}
        {positions.map((p, i) => {
          const rx = Math.min(
            Math.max((p.node.label.length * CHAR_W) / 2 + 8, MIN_RY),
            MAX_RX
          );
          const ry = MIN_RY;
          const cx = p.x * H_SP + rx;
          const cy = p.y * V_SP + ry;
          return (
            <React.Fragment key={i}>
              <Ellipse
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={2}
                onPress={() =>
                  setTooltip({ x: cx * zoom, y: cy * zoom, text: p.node.label })
                }
              />
              <SvgText
                x={cx}
                y={cy + 4}
                fontSize="12"
                fontWeight="bold"
                fill={textColor}
                textAnchor="middle"
              >
                {p.node.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Tooltip */}
      {tooltip && (
        <View
          style={[
            styles.tooltip,
            {
              left: tooltip.x + 8,
              top: tooltip.y + 8,
              backgroundColor: dark ? '#222' : '#fff',
            },
          ]}
        >
          <Text style={[styles.tooltipText, { color: dark ? '#fff' : '#000' }]}>
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
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tooltipText: {
    fontSize: 12,
  },
});
