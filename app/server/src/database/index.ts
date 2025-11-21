import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const getDatabasePath = (): string => {
  const dbPath = process.env.DATABASE_URL || './data/pokemon.db';
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  return dbPath;
};

const sqlite = new Database(getDatabasePath());

sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('synchronous = NORMAL');
sqlite.pragma('cache_size = -64000');

export const db = drizzle(sqlite, { schema });

export { schema };

export const closeDatabase = (): void => {
  sqlite.close();
};