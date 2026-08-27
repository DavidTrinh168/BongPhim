import type { Request, Response, NextFunction } from 'express';

// TODO: Chờ nhánh feature/auth hoàn thiện
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Tạm thời chưa có auth, ta giả vờ như user đã đăng nhập thành công
  console.log('🚧 [DUMMY AUTH] Đã bỏ qua bước check Token để test Movie');

  // Gắn tạm một thông tin user ảo vào request để các Controller sau này xài nếu cần
  // req.user = { id: 'fake_id', role: 'admin' };

  next(); // Cho phép đi tiếp vào Controller
};

// Middleware authorize theo role
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // if (!req.user || !roles.includes(req.user.role)) {
    //   res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    //   return;
    // }
    console.log('🚧 [DUMMY ROLE] Đã bỏ qua bước check role');
    next();
  };
};
