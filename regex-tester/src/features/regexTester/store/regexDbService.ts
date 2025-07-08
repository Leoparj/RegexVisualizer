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
