import { body } from 'express-validator';

/**
 * Array of Express Validator middleware to validate the request body
 * when creating or updating a tag entry.
 *
 * @category Validators
 */
const validateTag = [
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
