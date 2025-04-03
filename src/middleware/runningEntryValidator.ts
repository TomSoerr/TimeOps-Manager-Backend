import { body } from 'express-validator';

/**
 * Array of Express Validator middleware to validate the request body
 * when creating or updating a running entry.
 *
 * This middleware ensures that the required fields are present, properly formatted,
 * and meet the application's validation rules. It checks for valid names, timestamps,
 * and tag IDs.
 *
 * @category Validators
 */
const validateRunningEntry = [
  // Validate the `name` field
  body('name')
    .trim()
    .isString()
    .withMessage('name must be a string')
    .isLength({ min: 2, max: 20 })
    .withMessage('name must have a length between 2 and 20'),

  // Validate the `startTimeUtc` field
  body('startTimeUtc')
    .isNumeric()
    .withMessage('startTimeUtc must be a numeric timestamp'),

  // Validate the `tagId` field
  body('tagId').isNumeric().withMessage('tagId must be a number'),
];

export default validateRunningEntry;
