import type { Request, Response } from 'express';

export const notFoundHandler = (
  req: Request,
  res: Response,
) => {
  console.warn(`404 Not Found: ${req.method} ${req.path}`);

  res.status(404).json({
    error: 'Not Found',
    message: `The requested resource ${req.path} was not found.`,
  });
};