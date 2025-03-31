import { body } from 'express-validator';

const validateRunningEntry = [
  body('name')
    .trim()
    .isString()
    .withMessage('name must be a string')
    .isLength({ min: 2, max: 20 })
    .withMessage('hame must have a length between 2 and 20'),

  body('startTimeUtc')
    .isNumeric()
    .withMessage('startTimeUtc must be a numeric timestamp'),

  body('tagId').isNumeric().withMessage('Tag ID must be a number'),
];

export default validateRunningEntry;
