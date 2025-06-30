// src/services/regexParser.ts

/**
 * Utilidad para parsear una cadena de expresión regular
 * a su AST (Abstract Syntax Tree) usando regexpp.
 */

import { RegExpParser } from 'regexpp'; // Parser robusto de expresiones regulares

/**
 * Intenta parsear el patrón y devolver su AST.
 * En caso de error, devuelve un objeto con clave `error`.
 *
 * @param pattern Cadena de la expresión regular (sin delimitadores `/…/`)
 * @returns AST del patrón o { error: 'Expresión inválida' }
 */
export function parseRegexToAST(pattern: string) {
  try {
    // Creamos un nuevo parser y parseamos solo el cuerpo del patrón
    const parser = new RegExpParser();
    const ast = parser.parsePattern(pattern);
    return ast;
  } catch (error) {
    // Si la expresión es sintácticamente inválida, devolvemos un error sencillo
    return { error: 'Expresión inválida' };
  }
}
