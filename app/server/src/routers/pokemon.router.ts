import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, procedure } from "../../trpc";
import { pokeApiService } from "../services/pokeapi.service";
import { favoritesService } from "../services/favorites.service";

export const pokemonRouter = router({
  getList: procedure
    .input(
      z.object({
        limit: z.number().min(1).max(151).default(150),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const pokemon = await pokeApiService.getPokemonList(
          input.limit,
          input.offset
        );

        return {
          data: pokemon,
          total: 150,
          page: Math.floor(input.offset / input.limit) + 1,
          pageSize: input.limit,
          hasMore: input.offset + input.limit < 150,
        };
      } catch (error) {
        console.error('getList error:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Pokemon list",
          cause: error,
        });
      }
    }),

  getDetail: procedure
    .input(z.object({ id: z.number().min(1).max(151) }))
    .query(async ({ input }) => {
      try {
        return await pokeApiService.getPokemonDetail(input.id);
      } catch (error) {
        console.error('getDetail error:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Pokemon details",
          cause: error,
        });
      }
    }),

  getFavorites: procedure.query(async ({ ctx }) => {
    try {
      console.log('getFavorites called with sessionId:', ctx.sessionId);
      return await favoritesService.getFavorites(ctx.sessionId);
    } catch (error) {
      console.error('getFavorites error:', error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch favorites",
        cause: error,
      });
    }
  }),

  addFavorite: procedure
    .input(
      z.object({
        pokemonId: z.number(),
        pokemonName: z.string(),
        pokemonSprite: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log('addFavorite called:', { input, sessionId: ctx.sessionId });
      
      try {
        return await favoritesService.addFavorite(
          ctx.sessionId,
          input.pokemonId,
          input.pokemonName,
          input.pokemonSprite
        );
      } catch (error) {
        console.error('addFavorite error:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add favorite",
          cause: error,
        });
      }
    }),

  removeFavorite: procedure
    .input(z.object({ pokemonId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      console.log('removeFavorite called:', { input, sessionId: ctx.sessionId });
      
      try {
        const success = await favoritesService.removeFavorite(
          ctx.sessionId,
          input.pokemonId
        );
        return { success };
      } catch (error) {
        console.error('removeFavorite error:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove favorite",
          cause: error,
        });
      }
    }),

  isFavorite: procedure
    .input(z.object({ pokemonId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        return await favoritesService.isFavorite(ctx.sessionId, input.pokemonId);
      } catch (error) {
        console.error('isFavorite error:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check favorite",
          cause: error,
        });
      }
    }),
});

export type PokemonRouter = typeof pokemonRouter;