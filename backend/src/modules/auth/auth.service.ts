import jwt from "jsonwebtoken";
import { config } from "../../config/config";
import { AuthRepository } from "./auth.repository";
import { AccessTokenPayload, RefreshTokenPayload } from "./auth.types";
import { StringValue } from "ms";
import { errorResponse, successResponse, } from "../../utils/ErrorSuccessResponse";
import { ErrorResponseType, SuccessResponseType, } from "../../utils/types";
import { StatusMessages, StatusCodes, } from "../../constants/constants";

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }


    // ENTRA LOGIN REDIRECT URL

    entraLogin(): string {
        const params = new URLSearchParams({
            client_id: config.ENTRA_CLIENT_ID!,
            response_type: "code",
            redirect_uri: config.ENTRA_REDIRECT_URI!,
            response_mode: "query",
            scope: "openid profile email",
        });

        return `https://login.microsoftonline.com/${config.ENTRA_TENANT_ID!}/oauth2/v2.0/authorize?${params.toString()}`;
    }

    // ENTRA CALLBACK
    async entraCallback(code: string): Promise<
        SuccessResponseType<any> | ErrorResponseType
    > {
        const params = new URLSearchParams({
            client_id: config.ENTRA_CLIENT_ID!,
            client_secret: config.ENTRA_CLIENT_SECRET!,
            code,
            redirect_uri: config.ENTRA_REDIRECT_URI!,
            grant_type: "authorization_code",
        });

        const response = await fetch(
            `https://login.microsoftonline.com/${config.ENTRA_TENANT_ID!}/oauth2/v2.0/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
            }
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error_description || "Entra login failed");
        }

        // Decode ID token safely
        const decoded: any = jwt.decode(data.id_token);

        const username = decoded?.preferred_username;

        if (!username) {
            return errorResponse(
                "Invalid Entra token",
                StatusCodes.UNAUTHORIZED
            );
        }

        const user =
            await this.authRepository.findActiveUserByUsername(username);

        if (!user) {
            return errorResponse(
                StatusMessages.USER_NOT_FOUND,
                StatusCodes.NOT_FOUND
            );
        }

        const userWithPermissions =
            await this.authRepository.findUserWithPermissions(user.id);

        const accessPayload: AccessTokenPayload = {
            sub: user.id,
            userName: user.userName,
            roles: userWithPermissions?.roles ?? [],
            permissions: userWithPermissions?.permissions ?? [],
        };

        const refreshPayload: RefreshTokenPayload = {
            sub: user.id,
            tokenType: "refresh",
        };

        const accessToken = jwt.sign(accessPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue,
        });

        const refreshToken = jwt.sign(refreshPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue,
        });

        return successResponse(StatusMessages.LOGIN_SUCCESSFUL, {
            accessToken,
            refreshToken,
        });
    }
}