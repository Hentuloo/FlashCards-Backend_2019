import { RequestHandler } from "express";
import { ValidatedKeys, valid } from "middleware/validator";

import "reflect-metadata";
import { Methods, Metadata } from "./index";
import { RootRouter } from "routes/Router";

export const controller = function(pathPrefix: string) {
  return function(target: Function) {
    for (const method in target.prototype) {
      const getMetadata = (name: Metadata) => {
        return Reflect.getMetadata(name, target.prototype, method);
      };
      let middlewares: RequestHandler[] = [];

      // validate body values ("valid" Decorator)
      const fields: ValidatedKeys[] = getMetadata(Metadata.valid);
      if (fields) {
        middlewares.push(valid(fields));
      }

      // get middlewares ("use" Decorator)
      middlewares.push(getMetadata(Metadata.middleware) || []);

      // add method to router router
      const {
        path,
        methodType
      }: {
        path: string;
        methodType: Methods;
      } = getMetadata(Metadata.route);

      if (path && methodType) {
        RootRouter.getRouter()[methodType](
          `${pathPrefix}${path}`,
          middlewares,
          target.prototype[method]
        );
      }
    }
  };
};
