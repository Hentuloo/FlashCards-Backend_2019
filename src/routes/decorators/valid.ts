import "reflect-metadata";
import { Metadata } from "./types";
import { ValidatedKeys } from "middleware/validator";

export const valid = (...fields: ValidatedKeys[]) => (
  target: any,
  method: string
) => {
  Reflect.defineMetadata(Metadata.valid, fields, target, method);
};
