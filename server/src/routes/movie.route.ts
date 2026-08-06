import {Router} from 'express';
import { createrMovie, getMovies, /*updateMovie,*/ getMovieDetail } from '../controllers/movie.controller.js';
import { validate } from '../middlewares/validate.js';
import { createMovieSchema, updateMovieSchema  } from '../schemas/movie.schema.js';

const router: Router = Router();
router.get('/movies', getMovies);
router.get('/movies/:param', getMovieDetail);
router.post('/movies', validate(createMovieSchema), createrMovie); 
// router.patch('/movies/:id', validate(updateMovieSchema), updateMovie); 

export default router;