import { body } from 'express-validator';

/**
 * Array of Express Validator middleware to validate the request body
 * when creating or updating a time entry.
 *
 * This middleware ensures that the required fields are present, properly formatted,
 * and meet the application's validation rules. It checks for valid IDs, names,
 * timestamps, and ensures that `endTimeUtc` is greater than `startTimeUtc`.
 *
 * @category Validators
 */
const validateEntry = [
  // Validate the optional `id` field
  body('id')
    .optional()
    .custom((value) => {
      // If provided, ensure it is a number
      if (value !== undefined && isNaN(Number(value))) {
        throw new Error('id must be a number if provided');
      }
      return true;
    }),

  // Validate the `name` field
  body('name')
    .trim()
    .isString()
    .withMessage('name must be a string')
    .isLength({ min: 2, max: 20 })
    .withMessage('name must have a length between 2 and 20'),

  // Validate the `tagId` field
  body('tagId').isNumeric().withMessage('tagId must be a number'),

  // Validate the `startTimeUtc` field
  body('startTimeUtc')
    .isNumeric()
    .withMessage('startTimeUtc must be a numeric timestamp'),

  // Validate the `endTimeUtc` field and ensure it is greater than `startTimeUtc`
  body('endTimeUtc')
    .isNumeric()
    .withMessage('endTimeUtc must be a numeric timestamp')
    .custom((value, { req }) => {
      const startTime = Number(req.body.startTimeUtc);
      const endTime = Number(value);

      if (endTime <= startTime) {
        throw new Error('endTimeUtc must be greater than startTimeUtc');
      }

      return true;
    }),
];

export default validateEntry;
