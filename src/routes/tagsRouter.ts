import { Router } from 'express';
import tagsController from '../controllers/tagsController';
import validateTag from '../middleware/tagValidator';

/**
 * The `tagsRouter` handles routes related to tag management.
 * It provides endpoints for retrieving, creating, and updating tags.
 *
 * @category Routers
 */
const tagsRouter = Router();

tagsRouter.get('/', tagsController.getTags);
tagsRouter.post('/', validateTag, tagsController.createTag);
tagsRouter.put('/:id', validateTag, tagsController.updateTag);

export default tagsRouter;
