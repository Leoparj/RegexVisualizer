import { useState } from 'react';
import { parseRegexToAST } from '../services/regexParser';

export function useRegexTesterViewModel() {
  const [regex, setRegex] = useState('');
  const [input, setInput] = useState('');
  const [matches, setMatches] = useState<string[]>([]);

  const ast = parseRegexToAST(regex);

  const handleTestRegex = (pattern: string, text: string) => {
    try {
      const exp = new RegExp(pattern, 'g');
      const found = text.match(exp) || [];
      setMatches(found);
    } catch (error) {
      setMatches([]);
    }
  };

  return {
    regex,
    input,
    matches,
    ast,
    setRegex,
    setInput,
    handleTestRegex,
  };
}
