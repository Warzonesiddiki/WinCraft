import type { RequestHandler, Request, Response, NextFunction } from "express";
import { consumeGlobalBudget } from "./public-form-guard";

const MAX_ACTIVE = 4;
let active = 0;

/** Instance-wide work ceiling, independent of email or forwarding headers.
 * Deploy one replica until budgets are backed by a shared store. A disconnected
 * client cannot release its slot early while bcrypt is still executing. */
export function limitAuthWork(
  endpoint: string,
  handler: (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>,
): RequestHandler {
  return async (req, res, next) => {
    if (!consumeGlobalBudget(`auth-work:${endpoint}`, endpoint === "register" ? 100 : 2_000)) {
      res.status(429).json({ error: "Authentication is busy. Please try again later." });
      return;
    }
    if (active >= MAX_ACTIVE) {
      res.status(503).json({ error: "Authentication is busy. Please try again shortly." });
      return;
    }
    active++;
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    } finally {
      active--;
    }
  };
}
