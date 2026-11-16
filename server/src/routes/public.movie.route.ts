import {Router} from 'express';
import { getPublicMovieDetail, getPublicMovies } from '../controllers/movie.controller.js';
import { getPublicEpisodeDetail, getPublicEpisodes, getPublicSeasons } from '../controllers/episode.controller.js';


const publicMovieRouter: Router = Router();

publicMovieRouter.get ('/all', getPublicMovies);
publicMovieRouter.get ('/:slug', getPublicMovieDetail);
publicMovieRouter.get ('/:slug/seasons', getPublicSeasons);
publicMovieRouter.get ('/:slug/episodes', getPublicEpisodes); //req.query: season   
publicMovieRouter.get ('/:slug/:seSlug/:epSlug', getPublicEpisodeDetail);

export default publicMovieRouter;