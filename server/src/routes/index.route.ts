import { Router } from 'express';
import publicMovieRouter from './public.movie.route.js';
import internalMovieRouter from './internal.movie.route.js'
// import authRouter from './auth.route.js';
// import userRouter from './user.route.js';

const rootRouter: Router = Router();

// ==========================================
// 1. PUBLIC ROUTES (Dành cho User/Khách/Mobile App)
// ==========================================
// Đường dẫn thực tế sẽ là: /api/v1/public/movies/
rootRouter.use('/public/movies', publicMovieRouter);

// rootRouter.use('/public/auth', authRouter);


// ==========================================
// 2. ADMIN ROUTES (Dành cho Quản trị viên trên Web Admin)
// ==========================================
// Đường dẫn thực tế sẽ là: /api/v1/admin/movies/
rootRouter.use('/cms/movies', internalMovieRouter);

// rootRouter.use('/cms/users', userRouter);

export default rootRouter;