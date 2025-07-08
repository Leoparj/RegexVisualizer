import * as SQLite from 'expo-sqlite';

// Siempre obtén la instancia de la base de datos de forma asíncrona
export async function getDb() {
  return await SQLite.openDatabaseAsync('regexApp.db');
}

// Crear tabla si no existe
export async function initRegexTable() {
  const db = await getDb();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS saved_regex (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pattern TEXT NOT NULL,
      description TEXT,
      isFavorite INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    );`
  );
}

// Guardar una expresión
export async function saveRegex(pattern: string, description = '', isFavorite = 0) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO saved_regex (pattern, description, isFavorite) VALUES (?, ?, ?);',
    [pattern, description, isFavorite]
  );
}

// Obtener todas las expresiones
export async function getAllRegexes() {
  const db = await getDb();
  const { rows } = await db.getAllAsync('SELECT * FROM saved_regex ORDER BY createdAt DESC;');
  return rows;
}

// Eliminar una expresión por id
export async function deleteRegex(id: number) {
  const db = await getDb();
  await db.runAsync('DELETE FROM saved_regex WHERE id = ?;', [id]);
}
