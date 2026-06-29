import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // Redirect to Entra login
    entraLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const url = this.authService.entraLogin();
            return res.redirect(url);
        } catch (error) {
            next(error);
        }
    };

    // Handle Entra callback
    entraCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const code = req.query.code;

            if (typeof code !== "string") {
                throw new Error("Missing or invalid authorization code");
            }

            const result = await this.authService.entraCallback(code);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}