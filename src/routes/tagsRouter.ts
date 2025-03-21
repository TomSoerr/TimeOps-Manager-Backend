import { Router } from 'express';
import tagsController from '../controllers/tagsController';

/**
 * The `tagsRouter` handles routes related to tag management.
 * It provides endpoints for retrieving, creating, and updating tags.
 *
 * @category Routers
 */
const tagsRouter = Router();

tagsRouter.get('/', tagsController.getTags);
tagsRouter.post('/', tagsController.createTag);
tagsRouter.put('/:id', tagsController.updateTag);

export default tagsRouter;
