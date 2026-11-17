import {Router} from 'express';
import { createrEpisode, getEpisodes, getEpisodeDetail, deleteEpisode, updateEpisode } from '../controllers/episode.controller.js';
import { validate } from '../middlewares/validate.js';
import { createEpisodeSchema, updateEpisodeSchema  } from '../schemas/episode.schema.js';

// Import Middleware giả
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware.js';

const internalEpisodeRouter: Router = Router();

internalEpisodeRouter.post('/', verifyToken, authorizeRole(['admin', 'moderator']), validate(createEpisodeSchema), createrEpisode);
internalEpisodeRouter.get('/', verifyToken, authorizeRole(['admin', 'moderator']), getEpisodes);
internalEpisodeRouter.get('/:id', verifyToken, authorizeRole(['admin', 'moderator']), getEpisodeDetail);
internalEpisodeRouter.delete('/:id', verifyToken, authorizeRole(['admin', 'moderator']), deleteEpisode);
internalEpisodeRouter.patch('/:id', verifyToken, authorizeRole(['admin', 'moderator']), validate(updateEpisodeSchema), updateEpisode);

export default internalEpisodeRouter;