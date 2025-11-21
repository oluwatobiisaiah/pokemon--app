import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm/sql';

export const favorites: any = sqliteTable('favorites', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pokemonId: integer('pokemon_id').notNull().unique(),
  pokemonName: text('pokemon_name').notNull(),
  pokemonSprite: text('pokemon_sprite'),
  addedAt: integer('added_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
}, (table) => ({
  pokemonIdIdx: index('idx_pokemon_id').on(table.pokemonId),
  addedAtIdx: index('idx_added_at').on(table.addedAt),
}));

export type FavoriteRow = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;