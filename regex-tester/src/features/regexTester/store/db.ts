// src/features/regexTester/store/db.ts
import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('regexApp.db');

export default db;
