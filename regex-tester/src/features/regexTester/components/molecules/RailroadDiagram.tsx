// src/features/regexTester/components/molecules/RailroadDiagram.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, G, Line, Text as SvgText } from 'react-native-svg';

interface RNode {
  label: string;
  children: RNode[];
}

interface Positioned {
  node: RNode;
  x: number;
  y: number;
}

const MIN_RADIUS = 12;      // semieje vertical fijo
const CHAR_WIDTH = 6;       // ancho aproximado por caracter
const PADDING = 16;         // espacio extra en semieje horizontal
const H_SPACING = 80;       // espaciado horizontal base
const V_SPACING = 100;      // espaciado vertical fijo

function buildRNode(ast: any): RNode {
  const label = ast.raw ?? ast.type ?? 'Node';
  const children: RNode[] = [];
  Object.entries(ast).forEach(([key, val]) => {
    if (key === 'parent') return;
    if (Array.isArray(val)) {
      val.forEach((c: any) => {
        if (c && typeof c === 'object') children.push(buildRNode(c));
      });
    } else if (val && typeof val === 'object' && 'type' in val) {
      children.push(buildRNode(val));
    }
  });
  return { label, children };
}

function layoutTree(
  node: RNode,
  depth = 0,
  xOffset = 0
): { positions: Positioned[]; width: number; maxDepth: number } {
  if (node.children.length === 0) {
    return { positions: [{ node, x: xOffset + 0.5, y: depth }], width: 1, maxDepth: depth };
  }
  let positions: Positioned[] = [];
  let totalWidth = 0;
  let maxDepth = depth;
  let childX = xOffset;

  node.children.forEach(child => {
    const { positions: cp, width: cw, maxDepth: cd } = layoutTree(child, depth + 1, childX);
    positions = positions.concat(cp);
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
  zoom = 1,
  dark = false,
}: {
  ast: any;
  zoom?: number;
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

  const root = ast.alternatives[0];
  const tree = buildRNode(root);
  const { positions, width, maxDepth } = layoutTree(tree);

  // dimensiones "originales"
  const baseWidth  = width  * H_SPACING   + (MIN_RADIUS + PADDING) * 2;
  const baseHeight = (maxDepth + 1) * V_SPACING + (MIN_RADIUS + PADDING) * 2;

  const lineColor   = dark ? '#888' : '#888';
  const fillColor   = dark ? '#444' : '#ace';
  const strokeColor = dark ? '#6af' : '#48a';
  const textColor   = dark ? '#fff' : '#000';

  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  return (
    <View style={styles.wrapper}>
      <Svg width={baseWidth * zoom} height={baseHeight * zoom}>
        {/* escalamos todo */}
        <G scale={zoom}>
          {/* 1) Líneas padre→hijo */}
          {positions.map(({ node }) =>
            node.children.map(child => {
              const from = positions.find(p => p.node === node)!;
              const to   = positions.find(p => p.node === child)!;

              // semieje horizontal dinámico
              const rxFrom = Math.max((node.label.length * CHAR_WIDTH) / 2 + PADDING, MIN_RADIUS);
              const rxTo   = Math.max((child.label.length * CHAR_WIDTH) / 2 + PADDING, MIN_RADIUS);

              const x1 = from.x * H_SPACING + rxFrom + PADDING;
              const y1 = from.y * V_SPACING + MIN_RADIUS + PADDING;
              const x2 = to.x   * H_SPACING + rxTo   + PADDING;
              const y2 = to.y   * V_SPACING + MIN_RADIUS + PADDING;

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

          {/* 2) Nodos como óvalos interactivos */}
          {positions.map(({ node, x, y }, i) => {
            const rx = Math.max((node.label.length * CHAR_WIDTH) / 2 + PADDING, MIN_RADIUS);
            const cx = x * H_SPACING + rx + PADDING;
            const cy = y * V_SPACING + MIN_RADIUS + PADDING;

            return (
              <G key={i} onPress={() => setTooltip({ x: cx, y: cy, text: node.label })}>
                <Ellipse
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={MIN_RADIUS}
                  fill={fillColor}
                  stroke={strokeColor}
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
        </G>
      </Svg>

      {/* Tooltip */}
      {tooltip && (
        <View
          style={[
            styles.tooltip,
            {
              top: tooltip.y * zoom + 8,
              left: tooltip.x * zoom + 8,
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
    position: 'relative', // para tooltip
  },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 6,
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
