import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    statusCode?: number;
    code?: number;
    errors?: Record<string, { message: string }>;
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);

    // Mongoose Validation Error
    if (err.name === 'ValidationError' && err.errors) {
        const message = Object.values(err.errors).map((e) => e.message);
        res.status(400).json({
            success: false,
            error: message.join(', ')
        });
        return;
    }

    // Mongoose Bad ObjectId
    if (err.name === 'CastError') {
        res.status(404).json({
            success: false,
            error: 'Resource Not Found'
        });
        return;
    }

    // Mongoose Duplicate Key
    if (err.code === 11000) {
        res.status(400).json({
            success: false,
            error: 'Duplicated Field Value Entered'
        });
        return;
    }

    // Default Error
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
};

export default errorHandler;