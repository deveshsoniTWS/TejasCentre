import express from "express";
import cors from "cors";
import { config } from "./config/config";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.router";
import plantRouter from "./modules/plant/plant.router";
import locationRouter from "./modules/location/location.router";
import userRouter from "./modules/user/user.router";
import { errorHandler } from "./middleware/error.middleware";

export const app = express();

app.set("port", config.PORT);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/plants", plantRouter);
apiRouter.use("/locations", locationRouter);
apiRouter.use("/users", userRouter);

app.use("/api/v1", apiRouter);

app.get("/", (req, res) => {
  res.send("API running");
});

app.use(errorHandler);