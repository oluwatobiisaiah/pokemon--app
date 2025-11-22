import type { Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
) => {
  console.error('Express Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};