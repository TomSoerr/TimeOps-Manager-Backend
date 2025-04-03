import { body } from 'express-validator';

/**
 * Array of Express Validator middleware to validate the request body
 * when creating or updating a tag entry.
 *
 * This middleware ensures that the required fields are present, properly formatted,
 * and meet the application's validation rules. It checks for valid IDs, names,
 * and colors.
 *
 * @category Validators
 */
const validateTag = [
  // Validate the optional `id` field
  body('id')
    .optional()
    .custom((value) => {
      // If it's provided, make sure it's a number
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

  // Validate the optional `color` field
  body('color')
    .optional()
    .isString()
    .withMessage('color must be a string')
    .isIn([
      'slate',
      'red',
      'amber',
      'lime',
      'emerald',
      'cyan',
      'blue',
      'violet',
      'fuchsia',
    ])
    .withMessage(
      'color must be one of: slate, red, amber, lime, emerald, cyan, blue, violet, fuchsia',
    ),
];

export default validateTag;
