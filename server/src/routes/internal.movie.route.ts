import {Router} from 'express';
import { createrMovie, getMovies, getMovieDetail, deleteMovie, updateMovie } from '../controllers/movie.controller.js';
import { validate } from '../middlewares/validate.js';
import { createMovieSchema, updateMovieSchema  } from '../schemas/movie.schema.js';

// Import Middleware giả
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware.js';

const internalMovieRouter: Router = Router();

internalMovieRouter.post('/movie', verifyToken, authorizeRole(['admin', 'moderator']), validate(createMovieSchema), createrMovie);
internalMovieRouter.get('/all', verifyToken, authorizeRole(['admin', 'moderator']), getMovies);
internalMovieRouter.get('/:id', verifyToken, authorizeRole(['admin', 'moderator']), getMovieDetail);
internalMovieRouter.delete('/:id', verifyToken, authorizeRole(['admin', 'moderator']), deleteMovie);
internalMovieRouter.patch('/:id', verifyToken, authorizeRole(['admin', 'moderator']), validate(updateMovieSchema), updateMovie);


export default internalMovieRouter;