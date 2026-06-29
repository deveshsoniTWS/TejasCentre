import { StatusCodes } from "../constants/constants";

export type SuccessResponseType<T = unknown> = {
    success: boolean;
    status: StatusCodes;
    message: string;
    body: T | null;
};