import { body } from 'express-validator';

/**
 * Array of Express Validator middleware to validate the request body
 * when creating or updating a time entry.
 *
 * @category Validators
 */
const validateEntry = [
  body('id')
    .optional()
    .custom((value) => {
      // If it's provided, make sure it's a number
      if (value !== undefined && isNaN(Number(value))) {
        throw new Error('id must be a number if provided');
      }
      return true;
    }),

  body('name')
    .trim()
    .isString()
    .withMessage('name must be a string')
    .isLength({ min: 2, max: 20 })
    .withMessage('hame must have a length between 2 and 20'),

  body('tagId').isNumeric().withMessage('tagId must be a number'),

  body('startTimeUtc')
    .isNumeric()
    .withMessage('startTimeUtc must be a numeric timestamp'),

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
