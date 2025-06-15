import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SavedRegex } from '../types/SavedRegex';

export function useSavedRegex() {
  const [savedRegexList, setSavedRegexList] = useState<SavedRegex[]>([]);

  const saveRegex = (pattern: string, description: string) => {
    const newRegex: SavedRegex = {
      id: uuidv4(),
      pattern,
      description,
    };
    setSavedRegexList([...savedRegexList, newRegex]);
  };

  const deleteRegex = (id: string) => {
    setSavedRegexList(savedRegexList.filter((regex) => regex.id !== id));
  };

  return {
    savedRegexList,
    saveRegex,
    deleteRegex,
  };
}
