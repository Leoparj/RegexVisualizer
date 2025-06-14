import { RegExpParser } from 'regexpp';

export function parseRegexToAST(pattern: string) {
  try {
    const parser = new RegExpParser();
    const ast = parser.parsePattern(pattern);
    return ast;
  } catch (error) {
    return { error: 'Expresión inválida' };
  }
}
