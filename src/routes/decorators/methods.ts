import { Methods, Metadata } from "./types";
import "reflect-metadata";

const routerBuilder = (methodType: Methods) => {
  return function(path: string) {
    return function(type: any, method: string) {
      Reflect.defineMetadata(
        Metadata.route,
        { path, methodType },
        type,
        method
      );
    };
  };
};

export const get = routerBuilder(Methods.get);
export const post = routerBuilder(Methods.post);
export const put = routerBuilder(Methods.put);
export const del = routerBuilder(Methods.del);
