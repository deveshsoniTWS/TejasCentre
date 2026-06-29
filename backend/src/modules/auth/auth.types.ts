export interface AccessTokenPayload {
    sub: string;
    userName: string;
    roles: string[];
    permissions: string[];
}