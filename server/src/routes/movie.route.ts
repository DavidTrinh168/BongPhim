import express from 'express';
import { addMovie, getMovies } from '../controllers/movie.controller.js';

const router = express.Router();
router.get('/movies', getMovies);
router.post('/movies', addMovie); // Cần có thêm middleware để xử lý quyền truy cập

export default router;