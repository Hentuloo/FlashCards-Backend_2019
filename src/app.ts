import env from "env";
import cors from "cors";
import bodyParser from "body-parser";

//connect with mongodb and passport strategies
import "./config";
//Add router
import "./routes/signRoutes";
import { RootRouter } from "./routes/Router";
import { ErrorHandling } from "./middleware/ErrorHandling";

import express from "express";
const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    // origin: ["http://localhost:3000"]
    origin: ["https://www.megafiszka.eu"]
  })
);
app.use(RootRouter.getRouter());
app.use(ErrorHandling);

app.listen(process.env.PORT || 3000, function() {
  console.log(`app running on port ${env.PORT}`);
});
