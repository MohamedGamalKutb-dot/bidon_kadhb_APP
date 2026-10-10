import { NODE_ENV } from "../config.js"

// Wraps async route handlers to catch errors and forward them to globalErrorHandling
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export const globalErrorHandling = (error, req, res, next) => {
    const statusCode = error.cause?.status ?? 500;
    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        issues:error.cause?.issues,
        message: error.message || "Internal Server Error",
        error: NODE_ENV == 'development' ? error : undefined,
        stack: NODE_ENV == 'development' ? error.stack : undefined
    })
}
