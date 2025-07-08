import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, Line, Text as SvgText } from 'react-native-svg';

// -----------------------------------------
// Interfaces para representar nodos y posiciones
// -----------------------------------------
interface RNode {
  /** Etiqueta del nodo en el diagrama */
  label: string;
  /** Hijos del nodo, representados también como RNode */
  children: RNode[];
}

interface Positioned {
  /** Nodo a posicionar */
  node: RNode;
  /** Coordenada X en unidades de layout */
  x: number;
  /** Coordenada Y (profundidad) en unidades de layout */
  y: number;
}

// -----------------------------------------
// Constantes para cálculo de dimensiones
// -----------------------------------------
const MIN_RY = 12;      // Semieje vertical mínimo (altura del óvalo)
const MAX_RX = 60;      // Semieje horizontal máximo (ancho del óvalo)
const CHAR_W = 6;       // Ancho aproximado por carácter (para calcular rx)
const H_SP = 100;       // Espaciado horizontal base entre nodos
const V_SP = 120;       // Espaciado vertical entre niveles del árbol

// -----------------------------------------
// Función mapLabel
// Traduce nodos AST genéricos a etiquetas legibles
// -----------------------------------------
function mapLabel(ast: any): string {
  switch (ast.type) {
    case 'Pattern':
    case 'Alternative':
      return 'CONCAT';                // Secuencia de elementos → CONCAT
    case 'Quantifier':
      return ast.raw === '*' ? 'STAR' : `QUANT(${ast.raw})`;
    case 'CapturingGroup':
    case 'Group':
      return 'ALT';                   // Grupo → ALT (alternativa)
    case 'CharacterClassRange':
      return `${ast.min.raw}-${ast.max.raw}`;
    case 'Character':
      return ast.raw;                 // Carácter literal
    default:
      return ast.raw ?? ast.type;     // Fallback a tipo o raw
  }
}

// -----------------------------------------
// Función buildRNode
// Construye recursivamente un RNode desde el AST,
// evitando ciclos mediante el set `visited`.
// -----------------------------------------
function buildRNode(
  ast: any,
  visited = new Set<any>()         // Conjunto de nodos ya procesados
): RNode {
  // Si ya visitamos este nodo, retornamos vacío para cortar ciclo
  if (visited.has(ast)) {
    return { label: '', children: [] };
  }
  visited.add(ast);

  // Etiqueta del nodo actual
  const label = mapLabel(ast);
  const children: RNode[] = [];

  // Recorremos todas las propiedades para hallar hijos
  for (const [key, val] of Object.entries(ast)) {
    if (key === 'parent') continue; // Evitamos enlace al padre (ciclo)

    // Si es arreglo, procesamos cada elemento
    if (Array.isArray(val)) {
      val.forEach((c: any) => {
        if (c && typeof c === 'object' && 'type' in c) {
          const childNode = buildRNode(c, visited);
          if (childNode.label) children.push(childNode);
        }
      });

    // Si es objeto con campo `type`, lo procesamos recursivamente
    } else if (val && typeof val === 'object' && 'type' in val) {
      const childNode = buildRNode(val, visited);
      if (childNode.label) children.push(childNode);
    }
  }
  return { label, children };
}

// -----------------------------------------
// Función layoutTree
// Calcula posiciones x/y para cada RNode
// usando un layout de árbol simple.
// Retorna las posiciones, ancho total y profundidad máxima.
// -----------------------------------------
function layoutTree(
  node: RNode,
  depth = 0,
  xOffset = 0
): { positions: Positioned[]; width: number; maxDepth: number } {
  // Caso base: nodo hoja
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

  // Recorremos hijos y acumulamos posiciones
  node.children.forEach((child) => {
    const { positions: cp, width: cw, maxDepth: cd } = layoutTree(
      child,
      depth + 1,
      childX
    );
    positions = positions.concat(cp);
    totalWidth += cw;
    childX += cw;
    maxDepth = Math.max(maxDepth, cd);
  });

  // Posición del nodo padre (centro de hijos)
  const px = xOffset + totalWidth / 2;
  positions.push({ node, x: px, y: depth });

  return { positions, width: totalWidth, maxDepth };
}

// -----------------------------------------
// Componente TreeDiagram
// Renderiza un diagrama de árbol SVG con zoom y tema claro/oscuro
// -----------------------------------------
export default function TreeDiagram({
  ast,
  dark = false,
  zoom = 1,
}: {
  /** AST generado por regexpp */
  ast: any;
  /** Activa tema oscuro */
  dark?: boolean;
  /** Factor de zoom */
  zoom?: number;
}) {
  // Validación: AST debe tener alternativas
  if (
    !ast ||
    typeof ast !== 'object' ||
    !Array.isArray(ast.alternatives) ||
    ast.alternatives.length === 0
  ) {
    return null;
  }

  // Construcción de RNode y cálculo de layout
  const rootAst = ast.alternatives[0];
  const tree = buildRNode(rootAst, new Set());
  const { positions, width, maxDepth } = layoutTree(tree);

  // Dimensiones del SVG en píxeles
  const svgWidth = width * H_SP + MAX_RX * 2;
  const svgHeight = (maxDepth + 1) * V_SP + MIN_RY * 2;

  // Colores según tema
  const lineColor = '#888';
  const fillColor = dark ? '#444' : '#ace';
  const strokeColor = dark ? '#6af' : '#48a';
  const textColor = dark ? '#fff' : '#000';

  // Estado para mostrar tooltip al presionar nodo
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  return (
    <View style={styles.wrapper}>
      <Svg
        width={svgWidth}
        height={svgHeight}
        style={{ transform: [{ scale: zoom }] }}
      >
        {/* Líneas de conexión entre nodos */}
        {positions.map((p, i) =>
          p.node.children.map((child, j) => {
            const from = positions.find(x => x.node === p.node)!;
            const to = positions.find(x => x.node === child)!;
            // Radios de óvalo basados en longitud de etiqueta
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
                key={`${i}-${j}-${x1}-${y1}-${x2}-${y2}`}
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

        {/* Óvalos y etiquetas de cada nodo */}
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
                onPress={() => setTooltip({ x: cx * zoom, y: cy * zoom, text: p.node.label })}
              />
              <SvgText
                x={cx}
                y={cy + 4} // Ajuste vertical del texto
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

      {/* Tooltip: muestra etiqueta al presionar */}
      {tooltip && (
        <View style={[styles.tooltip, { left: tooltip.x + 8, top: tooltip.y + 8, backgroundColor: dark ? '#222' : '#fff' }]}>  
          <Text style={[styles.tooltipText, { color: dark ? '#fff' : '#000' }]}>  
            {tooltip.text}  
          </Text>
        </View>
      )}
    </View>
  );
}

// -----------------------------------------
// Estilos para el componente
// -----------------------------------------
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
