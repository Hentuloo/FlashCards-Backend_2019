import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const ErrorHandling = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).send(err);
};
