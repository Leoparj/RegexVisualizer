//src/utils/safeStringify.ts
/**
 * Convierte un objeto a JSON de forma segura, manejando referencias circulares.
 * @param obj - El objeto a serializar.
 * @returns Una cadena JSON con sangría de 2 espacios, donde las referencias circulares
 *          se reemplazan por la cadena "[Circular]" en lugar de lanzar un error.
 */
export function safeStringify(obj: any): string {
  // WeakSet para llevar seguimiento de los objetos ya visitados
  const seen = new WeakSet();

  // Utilizamos JSON.stringify con una función replacer personalizada
  return JSON.stringify(
    obj,
    function (key, value) {
      // Si el valor es un objeto y no es null
      if (typeof value === "object" && value !== null) {
        // Si ya vimos este objeto, marcamos como circular
        if (seen.has(value)) {
          return "[Circular]";
        }
        // Si no lo habíamos visto, lo añadimos al conjunto
        seen.add(value);
      }
      // Para valores primitivos o nuevos objetos, retornamos el valor original
      return value;
    },
    2 // Sangría de 2 espacios para mejor legibilidad del JSON resultante
  );
}
