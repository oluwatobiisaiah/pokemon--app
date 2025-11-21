import { db, schema } from '../database';
import { eq, and } from 'drizzle-orm/sql';
import { desc } from 'drizzle-orm/sql';
import type { Favorite } from '@pokemon/types';
class FavoritesService {
  async getFavorites(userId: string): Promise<Favorite[]> {
    const rows = await db
      .select()
      .from(schema.favorites)
      .where(eq(schema.favorites.userId, userId))
      .orderBy(desc(schema.favorites.addedAt));

    return rows.map(this.mapToFavorite);
  }

  async addFavorite(
    userId: string,
    pokemonId: number,
    pokemonName: string,
    pokemonSprite?: string
  ): Promise<Favorite> {
    const existing = await this.findByUserAndPokemonId(userId, pokemonId);

    if (existing) {
      return existing;
    }

    const result = await db
      .insert(schema.favorites)
      .values({
        userId,
        pokemonId,
        pokemonName,
        pokemonSprite,
      })
      .returning();

    if (!Array.isArray(result) || result.length === 0) {
      throw new Error('Insert did not return any rows.');
    }

    return this.mapToFavorite(result[0]);
  }

  async removeFavorite(userId: string, pokemonId: number): Promise<boolean> {
    const result = await db
      .delete(schema.favorites)
      .where(and(eq(schema.favorites.userId, userId), eq(schema.favorites.pokemonId, pokemonId)));

    return result.changes > 0;
  }

  async isFavorite(userId: string, pokemonId: number): Promise<boolean> {
    const result = await this.findByUserAndPokemonId(userId, pokemonId);
    return result !== null;
  }
  private async findByUserAndPokemonId(userId: string, pokemonId: number): Promise<Favorite | null> {
    const result = await db
      .select()
      .from(schema.favorites)
      .where(and(eq(schema.favorites.userId, userId), eq(schema.favorites.pokemonId, pokemonId)))
      .limit(1);

    return result.length > 0 ? this.mapToFavorite(result[0]) : null;
  }

  private mapToFavorite(row: typeof schema.favorites.$inferSelect): Favorite {
    return {
      id: row.id,
      pokemonId: row.pokemonId,
      pokemonName: row.pokemonName,
      addedAt: new Date(row.addedAt.getTime()),
    };
  }
}

export const favoritesService = new FavoritesService();