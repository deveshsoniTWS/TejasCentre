import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            success: false,
            status: err.status,
            message: err.message,
            body: err.body ?? null,
        });
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        status: 500,
        message: "Internal Server Error",
        body: null,
    });
}