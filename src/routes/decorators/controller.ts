import { RequestHandler } from "express";
import { ValidatedKeys, valid } from "middleware/validator";

import "reflect-metadata";
import { Methods, Metadata } from "./index";
import { RootRouter } from "routes/Router";

export const controller = (pathPrefix: string) => (target: Function) => {
  for (const method in target.prototype) {
    const getMethodMetadata = (name: Metadata) => {
      return Reflect.getMetadata(name, target.prototype, method);
    };
    const getConstructorMetadata = (name: Metadata) => {
      return Reflect.getMetadata(name, target);
    };
    let middlewares: RequestHandler[] = [];

    // validate body values ("valid" Decorator)
    const fields: ValidatedKeys[] = getMethodMetadata(Metadata.valid);
    if (fields) {
      middlewares.push(valid(fields));
    }

    // get global middlewares ("globalUse" Decorator)
    middlewares.push(getConstructorMetadata(Metadata.globalMiddleware) || []);
    // get middlewares ("use" Decorator)
    middlewares.push(getMethodMetadata(Metadata.middleware) || []);

    // add method to router router
    const {
      path,
      methodType
    }: {
      path: string;
      methodType: Methods;
    } = getMethodMetadata(Metadata.route);

    if (path && methodType) {
      RootRouter.getRouter()[methodType](
        `${pathPrefix}${path}`,
        middlewares,
        target.prototype[method]
      );
    }
  }
};
