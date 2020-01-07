import { Request, Response, NextFunction } from "express";
import validator from "validator";

export type ValidatedKeys =
  | "id"
  | "idType"
  | "idWord"
  | "title"
  | "icon"
  | "cards"
  | "email"
  | "password";

export const valid = (keys: ValidatedKeys[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  for (const key of keys) {
    const item = req.body[key];

    // if value doesn't exist
    if (!item) {
      return res.status(400).send({
        error: "Data is wrong",
        status: "failure",
        errorType: "dataWrong"
      });
    }

    // if value is not validate
    const isValid = validSimpleValue({ [key]: item });
    if (isValid !== true) {
      return res.status(400).send(isValid);
    }
  }

  next();
};

export const validSimpleValue = (item: { [key: string]: any }) => {
  const key = Object.keys(item)[0];
  const value = item[key];

  switch (key) {
    case "id":
    case "idType":
    case "idWord": {
      if (value) {
        return {
          error: "Data is incomplete",
          status: "id is empty",
          errorType: "idEmpty",
          value
        };
      } else if (!validator.isAlphanumeric(value)) {
        return {
          error: "id is wrong (only alpha-numeric)",
          status: "failure",
          errorType: "idAlpaNum",
          value
        };
      } else {
        return true;
      }
    }
    case "title": {
      if (validator.isEmpty(value)) {
        return {
          error: "Data is incomplete",
          status: "title is empty",
          errorType: "titleEmpty",
          value
        };
      } else if (value.length > 15 || value.length < 3) {
        return {
          error: "Data is too short or too long",
          status: "failure",
          errorType: "titleCharactersNumber",
          value
        };
      } else if (/[^\p{L}A-Za-z\d\s]/.test(value)) {
        return {
          error: "title is wrong (only alpha-numeric)",
          status: "failure",
          errorType: "titleAlpaNum",
          value
        };
      } else {
        return true;
      }
    }
    case "icon": {
      if (validator.isEmpty(value)) {
        return {
          error: "Data is incomplete",
          status: "icon is empty",
          errorType: "iconEmpty",
          value
        };
      } else if (!/^[a-z0-9_-]+$/i.test(value)) {
        return {
          error: "icon is wrong (only alpha-numeric",
          status: "failure",
          errorType: "iconAlpaNum",
          value
        };
      } else {
        return true;
      }
    }
    case "cards": {
      for (let i = 0; i < value.length; i++) {
        const { word, description } = value[i];
        if (
          word.length > 60 ||
          description.length > 60 ||
          word.length < 3 ||
          description.length < 3
        )
          return {
            error: "Data is too short or too long",
            status: "failure",
            errorType: "cardCharactersNumber",
            value
          };
        if (validator.isEmpty(word) || validator.isEmpty(description)) {
          return {
            error: "Data is incomplete",
            status: "failure",
            errorType: "cardEmpty",
            value
          };
        } else if (
          /^[\s\d\p{L}()[\] ,.!?/|:"']+$/i.test(word) ||
          /^[\s\d\p{L}()[\] ,.!?/|:"']+$/i.test(description)
        ) {
          return {
            error: "Data is wrong (only alpha-numeric)",
            status: "failure",
            errorType: "cardAlpaNum",
            value
          };
        } else {
          return true;
        }
      }
    }
    case "email": {
      if (!validator.isEmail(value)) {
        return {
          error: "Email field is wrong",
          status: "failure",
          errorType: "emailWrong",
          value
        };
      } else {
        return true;
      }
    }
    case "password": {
      if (validator.isEmpty(value)) {
        return {
          error: "password field is wrong",
          status: "failure",
          errorType: "passwordEmpty"
        };
      } else {
        return true;
      }
    }
    default:
      return {
        error: "Data is wrong",
        status: "failure",
        errorType: "dataWrong"
      };
  }
};
