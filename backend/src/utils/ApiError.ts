import { StatusCodes } from "../constants/constants";

export class ApiError extends Error {
    constructor(
        public status: StatusCodes,
        message: string,
        public body: unknown = null
    ) {
        super(message);
    }
}