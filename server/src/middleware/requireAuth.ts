import type { NextFunction, Request, Response } from 'express';

/**
 * Authentication stub. Every request is currently allowed through.
 * TODO: implement real authentication (see docs/issues.md — "Add authentication").
 */
export function requireAuth(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
