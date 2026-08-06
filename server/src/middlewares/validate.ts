import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ép kiểu (Type Assertion) kết quả trả về để TypeScript không báo lỗi 'unknown'
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as { body?: any; query?: any; params?: any };

      // CHỈ gán đè lại nếu Schema thực sự có validate và trả về phần đó
      // (Ngăn chặn việc Zod strip làm mất req.query và req.params khi không validate)
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query;
      if (parsed.params !== undefined) req.params = parsed.params;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          message: 'Dữ liệu đầu vào không hợp lệ',
          errors: error.issues.map((err) => ({
            field: err.path.join('.').replace(/^body\./, ''),
            message: err.message,
          })),
        });
      }
      return next(error);
    }
  };
};