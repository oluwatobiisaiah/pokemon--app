import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getDatabasePath = (): string => {
  const dbPath = process.env.DATABASE_URL || './data/pokemon.db';
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  return dbPath;
};

const db = new Database(getDatabasePath());

const migration = `
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pokemon_id INTEGER NOT NULL UNIQUE,
  pokemon_name TEXT NOT NULL,
  pokemon_sprite TEXT,
  added_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_pokemon_id ON favorites(pokemon_id);
CREATE INDEX IF NOT EXISTS idx_added_at ON favorites(added_at);
`;

try {
  db.exec(migration);
  console.log('✅ Database migrations completed successfully');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}