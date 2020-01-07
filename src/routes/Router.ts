import { Router } from "express";

export class RootRouter {
  private static instance: Router | null = null;

  static getRouter() {
    if (!this.instance) {
      this.instance = Router();
    }
    return this.instance;
  }
}
