import { Router } from 'express';
import tagsController from '../controllers/tagsController';
import validateTag from '../middleware/tagValidator';

/**
 * The `tagsRouter` handles routes related to tag management.
 *
 * This router provides endpoints for retrieving, creating, and updating tags
 * for the authenticated user.
 *
 * @category Routers
 */
const tagsRouter = Router();

/**
 * GET /api/v1/tags
 *
 * Retrieves all tags for the authenticated user.
 * This endpoint fetches all tags associated with the user.
 */
tagsRouter.get('/', tagsController.getTags);

/**
 * POST /api/v1/tags
 *
 * Creates a new tag for the authenticated user.
 * This endpoint validates the request body and creates a new tag.
 */
tagsRouter.post('/', validateTag, tagsController.createTag);

/**
 * PUT /api/v1/tags/:id
 *
 * Updates an existing tag for the authenticated user.
 * This endpoint validates the request body and updates the specified tag.
 */
tagsRouter.put('/:id', validateTag, tagsController.updateTag);

export default tagsRouter;
