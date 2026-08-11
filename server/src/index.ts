import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';

// Import cấu hình & routes (ví dụ sau này)
// import movieRoutes from './routes/movie.route.js';
// import authRoutes from './routes/authRoutes';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables');
}

// 1. Middlewares cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Khởi tạo ứng dụng (Bootstrap)
// const startServer = async () => {
(async () => {
  try {
    // Kết nối MongoDB bằng await
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // System Check Routes
    app.get('/', (req: Request, res: Response) => {
      res.send('BongPhim Server API is running!');
    });

    app.get('/trang-chu', (req: Request, res: Response) => {
      res.status(204).end();
    });

    // 3. Đăng ký các Module Routes
    // app.use('/api/v1/auth', authRoutes);
    // app.use('/api/v1/movies', movieRoutes);

    // 4. Global Error Handler Middleware (Xử lý lỗi tập trung)
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('❌ Error caught:', err.message);
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    });

    // 5. Lắng nghe cổng
    server.listen(PORT, () => {
      console.log(`⚡️ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
// };
})()

// startServer();