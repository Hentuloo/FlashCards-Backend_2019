import { RequestHandler } from "express";
import { Metadata } from "./types";
import "reflect-metadata";

export const use = (newMiddleware: RequestHandler) => (
  target: any,
  method: string
) => {
  const middlewares =
    Reflect.getMetadata(Metadata.middleware, target, method) || [];
  Reflect.defineMetadata(
    Metadata.middleware,
    [...middlewares, newMiddleware],
    target,
    method
  );
};
