import { Router } from "express";

export class RootRouter {
  private static instance: Router | null = null;

  static getRouter() {
    if (!this.instance) {
      this.instance = Router();
      this.instance.use(function(req, res, next) {
        if (req.params && req.params.id && typeof req.params.id === "string") {
          let num = Number(req.params.id);
        }
        next();
      });
    }
    return this.instance;
  }
}
