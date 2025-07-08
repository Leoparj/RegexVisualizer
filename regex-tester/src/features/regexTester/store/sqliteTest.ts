import * as SQLite from 'expo-sqlite';

export async function testSQLite() {
  try {
    const db = await SQLite.openDatabaseAsync('test.db');
    await db.execAsync('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT);');
    await db.runAsync('INSERT INTO test (value) VALUES (?);', ['hello!']);
    const result = await db.getAllAsync('SELECT * FROM test;');
    console.log('SQLite test rows:', result);
    console.log('SQLite is working!');
  } catch (e) {
    console.log('SQLite test error:', e);
  }
}
