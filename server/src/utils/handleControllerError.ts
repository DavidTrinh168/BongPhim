import type { Response } from 'express';
import { ApiError } from './ApiError.js';
import mongoose from 'mongoose';

export const handleControllerError = (res: Response, error: unknown) => {
  // 1. Custom API Error
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  // 2. MongoDB Duplicate Key Error
  if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
    return res.status(409).json({
      status: 'fail',
      message: 'Episode already exists.',
    });
  }

  // 3. Mongoose Validation Error
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      status: 'fail',
      message: 'Dữ liệu không hợp lệ',
      errors: Object.values(error.errors).map((err) => err.message),
    });
  }

  // 4. Mongoose Cast Error
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      status: 'fail',
      message: 'Dữ liệu không đúng định dạng',
    });
  }

  // 5. Unknown Server Error
  console.error(error);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
