import "reflect-metadata";
import { Metadata } from "./types";
import { ValidatedKeys } from "middleware/validator";

export const valid = function(...fields: ValidatedKeys[]) {
  return function(target: any, method: string) {
    Reflect.defineMetadata(Metadata.valid, fields, target, method);
  };
};

// export const validFields=
