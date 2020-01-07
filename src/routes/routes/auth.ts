import { Request, Response, NextFunction } from "express";
import env from "env";
import { jwtAuthLocal, RequestWithUser } from "middleware/jwtAuth";
import { controller, post, del, valid, use } from "../decorators";
import { defaultTypes } from "models/defaultTypes";
import User from "models/user";
import jwt from "jsonwebtoken";

export enum CardsRoutes {
  prefix = "/auth",
  postNewUser = "/new",
  deleteUser = "/delete",
  getloginToken = "/login"
}

@controller(CardsRoutes.prefix)
export class Auth {
  @post(CardsRoutes.postNewUser)
  @valid("email", "password")
  postNewUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const user = new User({ email, types: defaultTypes });
    User.register(user, password, err => {
      if (err) next(err);
      res.send({ status: "success" });
    });
  }

  @del(CardsRoutes.deleteUser)
  @valid("email")
  @use(jwtAuthLocal)
  deleteUser(req: RequestWithUser, res: Response, next: NextFunction) {
    const { email, id } = req.user;
    User.findOneAndRemove({ _id: id, email }, (err, deletedUser) => {
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

  @post(CardsRoutes.getloginToken)
  @valid("email", "password")
  @use(jwtAuthLocal)
  getloginToken(req: RequestWithUser, res: Response, next: NextFunction): void {
    const { id } = req.user;
    const token = jwt.sign({ id }, env.JWT_KEY, {
      expiresIn: 60000
    });
    res.send(token);
  }
}
