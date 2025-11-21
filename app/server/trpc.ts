import { initTRPC } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

// Context type definition
export interface Context {
  sessionId: string;
}

// Create context from Express request
export const createContext = ({ req }: CreateExpressContextOptions): Context => {
  const sessionId = (req.headers['x-session-id'] as string) || 'default-session';
  
  console.log('Creating context with sessionId:', sessionId);
  
  return {
    sessionId,
  };
};

// Initialize tRPC with context
const t = initTRPC.context<Context>().create();

// Export router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;

// Export middleware if needed
export const middleware = t.middleware;