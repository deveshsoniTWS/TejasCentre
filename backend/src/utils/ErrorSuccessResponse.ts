import { StatusCodes } from "../constants/constants";

export const successResponse = <T>(
    message: string,
    body?: T ,
    status = StatusCodes.SUCCESS
) => ({
    success: true,
    status,
    message,
    body: body ?? null,
});

