import { check } from 'express-validator';
import * as path from 'path';

// Validation array
const bookValidate = [
  check('title')
    .trim()
    .notEmpty()
    .isAscii()
    .isLength({ max: 255 })
    .escape(),

  check('desc')
    .trim()
    .notEmpty()
    .isAscii()
    .isLength({ max: 255 })
    .escape(),

  check('cover')
    .optional()
    .trim()
    .custom(async value => {
      const extension = path.extname(value).toLowerCase();
      if (value === '') return true;

      switch (extension) {
        case '.jpg':  return '.jpg';
        case '.jpeg': return '.jpeg';
        case '.png':  return '.png';
        default:      throw new Error("Invalid cover filename");
      }
    }),

  check('price')
    .trim()
    .isInt({ min: 0 }),
];

export {
  bookValidate,
};
