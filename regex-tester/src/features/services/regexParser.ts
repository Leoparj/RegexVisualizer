import { RegExpParser } from 'regexpp';

const parser = new RegExpParser();

export function parseRegexToAST(pattern: string) {
  try {
    // parsePattern recibe: (patrón, offsetInicial, offsetFinal, opciones)
    return parser.parsePattern(pattern, 0, pattern.length, {
      unicode: true,
      unicodeSets: true,
    });
  } catch {
    // si hay error de sintaxis devolvemos null para que nuestro Viewer no intente dibujar
    return null;
  }
}
