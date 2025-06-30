/**
 * SavedRegex.ts
 *
 * Define el tipo que representa una expresión regular guardada,
 * incluyendo un identificador único, el patrón y una descripción
 * para mostrar en la UI.
 */

/**
 * SavedRegex
 *
 * Tipo que describe una expresión regular almacenada por el usuario.
 */
export type SavedRegex = {
  /** Identificador único (UUID) de esta entrada */
  id: string;
  /** El patrón de la expresión regular (string) */
  pattern: string;
  /** Descripción o nombre amigable para mostrar en la lista de ejemplos o guardadas */
  description: string;
};
