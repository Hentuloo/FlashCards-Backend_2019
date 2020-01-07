import { RequestHandler } from "express";
import { Metadata } from "./types";
import "reflect-metadata";

export const globalUse = (newMiddleware: RequestHandler) => (
  target: Function
) => {
  const middlewares =
    Reflect.getMetadata(Metadata.globalMiddleware, target) || [];

  Reflect.defineMetadata(
    Metadata.globalMiddleware,
    [...middlewares, newMiddleware],
    target
  );
};
