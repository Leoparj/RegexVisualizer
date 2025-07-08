import * as SQLite from 'expo-sqlite';

// Siempre obtiene la instancia de la base de datos
export async function getDb() {
  return await SQLite.openDatabaseAsync('regexApp.db');
}

// Crea la tabla si no existe
export async function initRegexHistoryTable() {
  const db = await getDb();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS history_regex (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pattern TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now'))
    );`
  );
}

// Agrega una expresión al historial (no elimina nada, solo agrega)
export async function addToHistory(pattern: string) {
  const db = await getDb();
  // OPCIONAL: Evitar insertar duplicados CONSECUTIVOS
  const last = await db.getFirstAsync('SELECT pattern FROM history_regex ORDER BY id DESC LIMIT 1;');
  if (last?.pattern === pattern) return;
  await db.runAsync(
    'INSERT INTO history_regex (pattern) VALUES (?);',
    [pattern]
  );
}

// Devuelve todo el historial (orden descendente)
export async function getHistory() {
  const db = await getDb();
  const result = await db.getAllAsync('SELECT pattern FROM history_regex ORDER BY createdAt DESC;');

  // Si result ya es un array (algunas versiones), regresa directo
  if (Array.isArray(result)) {
    return result.map(r => r.pattern);
  }

  // Si es objeto con rows
  if (Array.isArray(result?.rows)) {
    return result.rows.map(r => r.pattern);
  }

  // Si nada, array vacío
  return [];
}

// Borra todo el historial
export async function clearHistoryDb() {
  const db = await getDb();
  await db.runAsync('DELETE FROM history_regex;');
}
