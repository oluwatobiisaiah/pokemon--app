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
-- Step 1: Create new table with correct schema
CREATE TABLE IF NOT EXISTS favorites_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL DEFAULT 'default',
  pokemon_id INTEGER NOT NULL,
  pokemon_name TEXT NOT NULL,
  pokemon_sprite TEXT,
  added_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(session_id, pokemon_id)  -- Unique per session, not globally
);

-- Step 2: Copy existing data (if table exists)
INSERT INTO favorites_new (id, session_id, pokemon_id, pokemon_name, pokemon_sprite, added_at)
SELECT 
  id, 
  'default' as session_id,  -- Assign existing favorites to default session
  pokemon_id, 
  pokemon_name, 
  pokemon_sprite, 
  added_at
FROM favorites
WHERE EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='favorites');

-- Step 3: Drop old table
DROP TABLE IF EXISTS favorites;

-- Step 4: Rename new table
ALTER TABLE favorites_new RENAME TO favorites;

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_session_pokemon ON favorites(session_id, pokemon_id);
CREATE INDEX IF NOT EXISTS idx_session_id ON favorites(session_id);
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