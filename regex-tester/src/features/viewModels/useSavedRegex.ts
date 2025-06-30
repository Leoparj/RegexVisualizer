// src/features/regexTester/viewModels/useSavedRegex.ts
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SavedRegex } from '../types/SavedRegex';

/**
 * Custom hook para gestionar una lista de expresiones regulares guardadas.
 * Proporciona funcionalidades para guardar y eliminar expresiones con descripción.
 */
export function useSavedRegex() {
  // Estado local: arreglo de objetos SavedRegex { id, pattern, description }
  const [savedRegexList, setSavedRegexList] = useState<SavedRegex[]>([]);

  /**
   * Guarda una nueva expresión en la lista.
   * @param pattern      Cadena con la expresión regular.
   * @param description  Descripción o nombre asociado a la expresión.
   */
  const saveRegex = (pattern: string, description: string) => {
    // Construye un objeto SavedRegex con un UUID único
    const newRegex: SavedRegex = {
      id: uuidv4(),
      pattern,
      description,
    };
    // Añade la nueva expresión al final del arreglo existente
    setSavedRegexList([...savedRegexList, newRegex]);
  };

  /**
   * Elimina una expresión de la lista por su ID.
   * @param id  Identificador único de la expresión a eliminar.
   */
  const deleteRegex = (id: string) => {
    // Filtra el arreglo para excluir el objeto con el id dado
    setSavedRegexList(
      savedRegexList.filter((regex) => regex.id !== id)
    );
  };

  // Exponemos el estado y las funciones para usar en componentes
  return {
    savedRegexList,
    saveRegex,
    deleteRegex,
  };
}
