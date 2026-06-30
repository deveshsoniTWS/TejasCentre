import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { StringValue } from "ms";

import { config } from "../../config/config";
import { AuthRepository } from "./auth.repository";
import { AccessTokenPayload } from "./auth.types";
import { successResponse } from "../../utils/ErrorSuccessResponse";
import { ApiError } from "../../utils/ApiError";
import { SuccessResponseType } from "../../utils/types";

import { StatusCodes, StatusMessages, } from "../../constants/constants";

interface EntraLoginResponse {
    accessToken: string;
}

const jwks = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${config.ENTRA_TENANT_ID}/discovery/v2.0/keys`,
});


function getSigningKey(header: any, callback: any) {
    jwks.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);

        const signingKey =
            (key as any)?.getPublicKey?.() ||
            (key as any)?.publicKey;

        callback(null, signingKey);
    });
}

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    entraLogin(): string {
        const params = new URLSearchParams({
            client_id: config.ENTRA_CLIENT_ID!,
            response_type: "code",
            redirect_uri: config.ENTRA_REDIRECT_URI!,
            response_mode: "query",
            scope: "openid profile email",
        });

        return `https://login.microsoftonline.com/${config.ENTRA_TENANT_ID}/oauth2/v2.0/authorize?${params.toString()}`;
    }

    /**
     * Handle Entra callback:
     * 1. Exchange auth code for tokens
     * 2. Verify ID token via JWKS
     * 3. Map user + permissions
     * 4. Issue internal JWT (access token only)
     */
    async entraCallback( code: string ): Promise<string> {
        // Exchange code for tokens
        const params = new URLSearchParams({
            client_id: config.ENTRA_CLIENT_ID!,
            client_secret: config.ENTRA_CLIENT_SECRET!,
            code,
            redirect_uri: config.ENTRA_REDIRECT_URI!,
            grant_type: "authorization_code",
        });

        const response = await fetch(
            `https://login.microsoftonline.com/${config.ENTRA_TENANT_ID}/oauth2/v2.0/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                },
                body: params.toString(),
            }
        );

        const data = await response.json();

        if (data.error) {
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                data.error_description || "Entra login failed",
            );
        }

        /**
         * VERIFY ID TOKEN (IMPORTANT SECURITY STEP)
         */
        const decoded: any = await new Promise((resolve, reject) => {
            jwt.verify(
                data.id_token,
                getSigningKey,
                {
                    audience: config.ENTRA_CLIENT_ID,
                    issuer: `https://login.microsoftonline.com/${config.ENTRA_TENANT_ID}/v2.0`,
                },
                (err, decoded) => {
                    if (err) return reject(err);
                    resolve(decoded);
                }
            );
        });

        const username = decoded?.preferred_username;

        if (!username) {
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                "Invalid Entra token payload"
            );
        }

        /**
         * FIND USER IN DB
         */
        const user =
            await this.authRepository.findActiveUserByUsername(
                username
            );

        if (!user) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                StatusMessages.USER_NOT_FOUND
            );
        }

        /**
         * LOAD RBAC DATA
         */
        const userWithPermissions =
            await this.authRepository.findUserWithPermissions(
                user.id
            );

        /**
         * BUILD INTERNAL ACCESS TOKEN
         */
        const payload: AccessTokenPayload = {
            sub: user.id,
            userName: user.userName,
            roles: userWithPermissions?.roles ?? [],
            permissions:
                userWithPermissions?.permissions ?? [],
        };

        const accessToken = jwt.sign(
            payload,
            config.JWT_SECRET,
            {
                expiresIn:
                    config.JWT_ACCESS_EXPIRES_IN as StringValue,
            }
        );

        return `${config.FRONTEND_URL}/auth/entra/callback?accessToken=${accessToken}`;
    }
}