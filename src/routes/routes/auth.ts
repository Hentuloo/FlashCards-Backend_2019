import { Request, Response, NextFunction } from "express";

import { controller, post, del, valid, use } from "../decorators";
import env from "env";
import { defaultTypes } from "models/defaultTypes";
import User from "models/user";
import { jwtAuth, jwtAuthLocal } from "middleware/jwtAuth";
import jwt from "jsonwebtoken";

export type RequestWithUser = Request & { user: { id: any } };

@controller("/auth")
export class Auth {
  @post("/new")
  @valid("email", "password")
  postNewUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const user = new User({ email, defaultTypes });
    User.register(user, password, err => {
      if (err) next(err);
      res.send({ status: "success" });
    });
  }

  @del("/delete")
  @valid("email")
  @use(jwtAuth)
  deleteUser(req: RequestWithUser, res: Response, next: NextFunction) {
    const { email } = req.body;
    User.findOneAndRemove({ _id: req.user.id, email }, (err, deletedUser) => {
      if (err) return next(err);

      if (!deletedUser)
        return next({
          status: "failure",
          message: `I don't find such email`,
          errorType: "deleteUserFailure"
        });

      return res.send({
        status: "success"
      });
    });
  }

  @post("/login")
  @valid("email", "password")
  @use(jwtAuthLocal)
  err(req: RequestWithUser, res: Response, next: NextFunction): void {
    const { id } = req.user;
    const token = jwt.sign({ id }, env.JWT_KEY, {
      expiresIn: 60000
    });
    res.send(token);
    return;
  }
}
