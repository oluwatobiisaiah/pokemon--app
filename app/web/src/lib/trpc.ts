import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { PokemonRouter } from '@pokemon/server/src/routers/pokemon.router';

export const trpc = createTRPCReact<PokemonRouter>();

const getSessionId = () => {
  if (typeof window === 'undefined') return 'server';
  let sessionId = localStorage.getItem('pokemon-session-id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('pokemon-session-id', sessionId);
  }
  return sessionId;
};

export const createTRPCClient = () => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/trpc`,
        transformer: superjson,
        headers: () => {
          const sessionId = getSessionId();
          return {
            'x-session-id': sessionId,
          };
        },
      }),
    ],
  });
};