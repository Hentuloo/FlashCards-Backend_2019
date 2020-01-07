import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { UserSchema } from "models/user";

export type RequestWithUser = { user: UserSchema } & Request;

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate("jwt", { session: false })(req, res, next);
};

export const jwtAuthLocal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return passport.authenticate("local", { session: false })(req, res, next);
};
