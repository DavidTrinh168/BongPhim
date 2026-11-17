import type { Response } from 'express';
import { ApiError } from './ApiError.js';

export const handleControllerError = (res: Response, error: unknown) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
