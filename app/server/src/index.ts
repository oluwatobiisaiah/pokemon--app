import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { pokemonRouter } from './routers/pokemon.router';
import { createContext } from '../trpc';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import { cacheService } from './services/cache.service';
import { closeDatabase } from './database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(express.json());
app.use(requestLogger);

app.use(
  '/trpc',
  createExpressMiddleware({
    router: pokemonRouter,
    createContext,
  })
);

app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cache: cacheService.getStats(),
  });
});

app.get('/cache/stats', (_, res) => {
  res.json(cacheService.getStats());
});

app.post('/cache/clear', (_, res) => {
  cacheService.flush();
  res.json({ message: 'Cache cleared successfully' });
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`
 Server is running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base URL:    http://localhost:${PORT}
tRPC:        http://localhost:${PORT}/trpc
Health:      http://localhost:${PORT}/health
Cache Stats: http://localhost:${PORT}/cache/stats
━━━━━━━━━━━━━━━━━
  `);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    closeDatabase();
    process.exit(0);
  });
});

