import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createError = (
  message: string,
  statusCode: number
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message || 'Internal Server Error';

  // Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException & { code?: number }).code === 11000) {
    const mongoErr = err as Error & { keyValue?: Record<string, unknown> };
    const field = Object.keys(mongoErr.keyValue ?? {})[0];
    res.status(409).json({
      success: false,
      message: `An account with this ${field} already exists.`,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const mongooseErr = err as Error & {
      errors?: Record<string, { message: string }>;
    };
    const messages = Object.values(mongooseErr.errors ?? {}).map(
      (e) => e.message
    );
    res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired. Please login again.',
    });
    return;
  }

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production' && !err.isOperational
        ? 'Something went wrong. Please try again later.'
        : message,
  });
};

export const notFound = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
};
