import { z } from 'zod';
import { initTRPC, TRPCError } from '@trpc/server';
import { pokeApiService } from '../services/pokeapi.service';
import { favoritesService } from '../services/favorites.service';

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

export const pokemonRouter = router({
  getList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(151).default(150),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const pokemon = await pokeApiService.getPokemonList(input.limit, input.offset);
        
        return {
          data: pokemon,
          total: 150,
          page: Math.floor(input.offset / input.limit) + 1,
          pageSize: input.limit,
          hasMore: input.offset + input.limit < 150,
        };
      } catch (error) {
        console.error('Error fetching pokemon list:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch Pokemon list',
          cause: error,
        });
      }
    }),

  getDetail: publicProcedure
    .input(z.object({ id: z.number().min(1).max(151) }))
    .query(async ({ input }) => {
      try {
        return await pokeApiService.getPokemonDetail(input.id);
      } catch (error) {
        console.error(`Error fetching pokemon detail for id ${input.id}:`, error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch Pokemon details',
          cause: error,
        });
      }
    }),

  getFavorites: publicProcedure.query(async () => {
    try {
      return await favoritesService.getFavorites();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch favorites',
        cause: error,
      });
    }
  }),

  addFavorite: publicProcedure
    .input(
      z.object({
        pokemonId: z.number().min(1),
        pokemonName: z.string().min(1),
        pokemonSprite: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await favoritesService.addFavorite(
          input.pokemonId,
          input.pokemonName,
          input.pokemonSprite
        );
      } catch (error) {
        console.error('Error adding favorite:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add favorite',
          cause: error,
        });
      }
    }),

  removeFavorite: publicProcedure
    .input(z.object({ pokemonId: z.number().min(1) }))
    .mutation(async ({ input }) => {
      try {
        const success = await favoritesService.removeFavorite(input.pokemonId);
        return { success };
      } catch (error) {
        console.error('Error removing favorite:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove favorite',
          cause: error,
        });
      }
    }),

  isFavorite: publicProcedure
    .input(z.object({ pokemonId: z.number().min(1) }))
    .query(async ({ input }) => {
      try {
        return await favoritesService.isFavorite(input.pokemonId);
      } catch (error) {
        console.error('Error checking favorite status:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check favorite status',
          cause: error,
        });
      }
    }),
});

export type PokemonRouter = typeof pokemonRouter;
