import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticateJWT } from "../../middleware/jwt.middleware";

const authRouter = Router();
const authController = new AuthController();

authRouter.get("/entra/login", authController.entraLogin);
authRouter.get("/entra/callback", authController.entraCallback);

export default authRouter;