import { Router } from "express";
import { AuthController } from "./auth.controller";

const authRouter = Router();
const authController = new AuthController();

authRouter.get("/entra/login", authController.entraLogin);
authRouter.get("/entra/callback", authController.entraCallback);

export default authRouter;