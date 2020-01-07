import { controller, globalUse, post, del, valid } from "routes/decorators";
import { Response, NextFunction } from "express";
import User, { UserSchema } from "models/user";
import { jwtAuth, RequestWithUser } from "middleware/jwtAuth";
import { getTypeById } from "config/Utils";

export enum CardsRoutes {
  prefix = "/cards",
  addCard = "/new",
  deleteOneCard = "/one"
}

@controller(CardsRoutes.prefix)
@globalUse(jwtAuth)
export class Cards {
  @post(CardsRoutes.addCard)
  @valid("idType", "cards")
  addCard(req: RequestWithUser, res: Response, next: NextFunction) {
    const { types, numberOfCards, id } = req.user;
    const { idType, cards } = req.body;

    //check max-value of cards
    const typeToCheck = getTypeById(types, idType);
    if (!typeToCheck)
      return res.status(400).send({
        status: "failure",
        error: "There is not ",
        errorType: "typeTitleUnique"
      });

    if (numberOfCards < cards.length + typeToCheck.cards.length - 1)
      return res.status(400).send({
        message: "You have max number of cards in this type",
        status: "Failure",
        errorType: "maxNumberCards"
      });

    User.findOneAndUpdate(
      { _id: id, "types._id": idType },
      { $push: { "types.$.cards": [...cards] } },
      { new: true },
      (err, model: UserSchema | null) => {
        if (err) return res.send(err);
        if (!model)
          return next({
            status: "failure",
            error: "Something gone wrong",
            errorType: "newTypeError"
          });
        const { types } = model;

        // find a type with our words
        const activeType = getTypeById(types, idType);
        if (!activeType)
          return next({
            status: "failure",
            error: "Something gone wrong",
            errorType: "newTypeError"
          });

        // send new cards
        res.send(
          activeType.cards.slice(activeType.cards.length - cards.length)
        );
      }
    );
  }
  @del(CardsRoutes.deleteOneCard)
  @valid("idType", "idWord")
  deleteOneCard(req: RequestWithUser, res: Response, next: NextFunction) {
    const { id } = req.user;
    const { idType, idWord } = req.body;

    User.findOneAndUpdate(
      {
        _id: id,
        "types._id": idType,
        "types.cards._id": idWord
      },
      { $pull: { "types.$.cards": { _id: idWord } } },
      (err, model) => {
        if (err) return res.send(err);
        if (!model)
          return res.status(400).send({
            status: "failure",
            message: `I don't find such type and card`,
            errorType: "cardNotExist"
          });
        res.send({
          status: "success"
        });
      }
    );
  }
}
