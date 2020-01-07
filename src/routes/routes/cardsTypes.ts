import {
  controller,
  globalUse,
  get,
  post,
  put,
  del,
  valid
} from "routes/decorators";
import { Response, NextFunction } from "express";
import { jwtAuth, RequestWithUser } from "middleware/jwtAuth";

import User from "models/user";
import { typeUniqueByTitle, getTypeById } from "config/Utils";

export enum CardsTypesRoutes {
  prefix = "/types",
  getTypes = "/types",
  newType = "/new",
  deleteType = "/delete",
  updateType = "/update",
  getSingleType = "/type"
}

@controller(CardsTypesRoutes.prefix)
@globalUse(jwtAuth)
export class CardsTypes {
  @get(CardsTypesRoutes.getTypes)
  getTypes(req: RequestWithUser, res: Response, next: NextFunction) {
    const { types } = req.user;
    const Types = types.map(type => ({
      id: type.id,
      title: type.title,
      icon: type.icon
    }));
    res.send(Types);
  }

  @post(CardsTypesRoutes.newType)
  @valid("title", "icon")
  newType(req: RequestWithUser, res: Response, next: NextFunction) {
    const { title, icon } = req.body;
    const { numberOfTypes, types, id } = req.user;
    //check max-value of types
    if (numberOfTypes < types.length) {
      return res.status(400).send({
        message: "You have max number types",
        status: "Failure",
        errorType: "maxNumberTypes"
      });
    }

    const isUnique = typeUniqueByTitle(types, title);
    if (isUnique) {
      return res.status(400).send({
        status: "failure",
        error: "title of card must be unique",
        errorType: "typeTitleUnique"
      });
    }

    User.findOneAndUpdate(
      { _id: id },
      { $addToSet: { types: [{ title, icon }] } },
      { new: true },
      (err, model) => {
        if (err) return res.status(400).send(err);
        if (!model)
          return res.status(500).send({
            status: "failure",
            error: "Something gone wrong",
            errorType: "newTypeError"
          });

        const newType = model.types.find(type => type.title === title);
        if (newType) {
          return res.send({
            status: "success",
            id: newType.id,
            title: newType.title,
            icon: newType.icon
          });
        }
      }
    );
  }
  @del(CardsTypesRoutes.deleteType)
  @valid("id")
  deleteType(req: RequestWithUser, res: Response, next: NextFunction) {
    const { id: idUser } = req.user;
    const { id } = req.body;

    User.findOneAndUpdate(
      { _id: idUser, "types._id": id },
      { $pull: { types: { _id: id } } },
      (err, model) => {
        if (err) return res.send(err);
        if (model) {
          return res.send({
            status: "success"
          });
        } else {
          return res.status(400).send({
            status: "failure",
            message: `I don't find such type`,
            errorType: "typeNotExist"
          });
        }
      }
    );
  }
  @put(CardsTypesRoutes.updateType)
  @valid("id", "title", "icon")
  updateType(req: RequestWithUser, res: Response, next: NextFunction) {
    const { id: idUser, types } = req.user;
    const { id, title, icon } = req.body;

    const isUnique = typeUniqueByTitle(types, title);
    if (isUnique) {
      return res.status(400).send({
        status: "failure",
        error: "title of type must be unique",
        errorType: "typeTitleUnique"
      });
    }

    User.findOneAndUpdate(
      { _id: idUser, "types._id": id },
      { "types.$.title": title, "types.$.icon": icon },
      (err, doc) => {
        if (err) return res.status(400).send(err);
        if (!doc)
          return res.status(500).send({
            status: "failure",
            error: "Something gone wrong",
            errorType: "updateType"
          });
        return res.send({
          status: "success"
        });
      }
    );
  }

  @get(CardsTypesRoutes.getSingleType)
  @valid("id")
  getSingleType(req: RequestWithUser, res: Response, next: NextFunction) {
    const { types } = req.user;
    const { id } = req.body;

    const type = getTypeById(types, id);
    if (!type) {
      return res.status(400).send({
        status: "failure",
        message: `I don't find such type`,
        errorType: "typeNotExist"
      });
    }
    res.send(type);
  }
}
