import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // Redirect user to Microsoft Entra login
    entraLogin = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const url = this.authService.entraLogin();
            res.redirect(url);
        } catch (error) {
            next(error);
        }
    };

    // Handle Microsoft Entra callback
    entraCallback = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const code = req.query.code;

            if (typeof code !== "string") {
                throw new Error("Missing or invalid authorization code");
            }

            const redirectUrl = await this.authService.entraCallback(code);

            res.redirect(redirectUrl);
        } catch (error) {
            next(error);
        }
    };
}