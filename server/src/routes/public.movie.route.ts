import {Router} from 'express';
import { getPublicMovieDetail, getPublicMovies } from '../controllers/movie.controller.js';


const publicMovieRouter: Router = Router();

publicMovieRouter.get ('/all', getPublicMovies);
publicMovieRouter.get ('/:slug', getPublicMovieDetail);

export default publicMovieRouter;