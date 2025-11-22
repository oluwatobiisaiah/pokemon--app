import Database from 'better-sqlite3';
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

const db = new Database(getDatabasePath());

const migration = `
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pokemon_id INTEGER NOT NULL UNIQUE,
  pokemon_name TEXT NOT NULL,
  pokemon_sprite TEXT,
  added_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Add user_id column if it doesn't exist
ALTER TABLE favorites ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default';

-- Update existing rows
UPDATE favorites SET user_id = 'default' WHERE user_id IS NULL OR user_id = '';

-- Drop old index and create new one
DROP INDEX IF EXISTS idx_pokemon_id;
CREATE INDEX IF NOT EXISTS idx_user_pokemon ON favorites(user_id, pokemon_id);
CREATE INDEX IF NOT EXISTS idx_added_at ON favorites(added_at);

-- Remove unique constraint on pokemon_id since it's now per user
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