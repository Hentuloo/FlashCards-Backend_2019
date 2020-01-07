import dotenv from "dotenv";

export interface ENV {
  MONGODB_URL: string;
  JWT_KEY: string;
  PORT?: number;
  [key: string]: any;
}

const envValues = dotenv.config().parsed;

let withDefaultValues: ENV = {
  MONGODB_URL: "",
  JWT_KEY: "",
  ...envValues
};

export default withDefaultValues;
