// apps/server/src/trpc/index.ts
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export interface Context {
  sessionId: string;
}

export const createContext = ({ req }: CreateExpressContextOptions): Context => {
  const sessionId = (req.headers['x-session-id'] as string) || 'default-session';
  return {
    sessionId,
  };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson, // IMPORTANT: Add this
  errorFormatter({ shape, error }) {
    console.error('🔴 tRPC Error:', {
      code: shape.data.code,
      message: error.message,
    });
    return shape;
  },
});

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;