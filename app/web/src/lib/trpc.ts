import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { PokemonRouter } from '@pokemon/server/routers/pokemon.router';

export const trpc = createTRPCReact<PokemonRouter>();

export const createTRPCClient = () => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/trpc`,
        headers: () => ({
          'Content-Type': 'application/json',
        }),
      }),
    ],
  });
};