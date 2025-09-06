import Joi from 'joi';

export const createBookSchema = Joi.object({
  title: Joi.string().required().trim().min(1).max(255).messages({
    'string.empty': 'Title is required',
    'string.min': 'Title cannot be empty',
    'string.max': 'Title cannot be longer than 255 characters',
  }),
  author: Joi.string().required().trim().min(1).max(255).messages({
    'string.empty': 'Author is required',
    'string.min': 'Author cannot be empty',
    'string.max': 'Author cannot be longer than 255 characters',
  }),
  description: Joi.string().optional().trim().max(1000).messages({
    'string.max': 'Description cannot be longer than 1000 characters',
  }),
  isbn: Joi.string()
    .optional()
    .trim()
    .pattern(/^[0-9-X]+$/)
    .messages({
      'string.pattern.base': 'ISBN must contain only numbers, hyphens, and X',
    }),
  publishedYear: Joi.number()
    .optional()
    .integer()
    .min(1000)
    .max(new Date().getFullYear() + 10)
    .messages({
      'number.min': 'Published year must be at least 1000',
      'number.max': `Published year cannot be more than ${new Date().getFullYear() + 10}`,
    }),
  genre: Joi.string().optional().trim().max(100).messages({
    'string.max': 'Genre cannot be longer than 100 characters',
  }),
  price: Joi.number().optional().min(0).messages({
    'number.min': 'Price cannot be negative',
  }),
  stock: Joi.number().optional().integer().min(0).messages({
    'number.min': 'Stock cannot be negative',
  }),
});

export const updateBookSchema = Joi.object({
  title: Joi.string().optional().trim().min(1).max(255).messages({
    'string.min': 'Title cannot be empty',
    'string.max': 'Title cannot be longer than 255 characters',
  }),
  author: Joi.string().optional().trim().min(1).max(255).messages({
    'string.min': 'Author cannot be empty',
    'string.max': 'Author cannot be longer than 255 characters',
  }),
  description: Joi.string().optional().trim().max(1000).messages({
    'string.max': 'Description cannot be longer than 1000 characters',
  }),
  isbn: Joi.string()
    .optional()
    .trim()
    .pattern(/^[0-9-X]+$/)
    .messages({
      'string.pattern.base': 'ISBN must contain only numbers, hyphens, and X',
    }),
  publishedYear: Joi.number()
    .optional()
    .integer()
    .min(1000)
    .max(new Date().getFullYear() + 10)
    .messages({
      'number.min': 'Published year must be at least 1000',
      'number.max': `Published year cannot be more than ${new Date().getFullYear() + 10}`,
    }),
  genre: Joi.string().optional().trim().max(100).messages({
    'string.max': 'Genre cannot be longer than 100 characters',
  }),
  price: Joi.number().optional().min(0).messages({
    'number.min': 'Price cannot be negative',
  }),
  stock: Joi.number().optional().integer().min(0).messages({
    'number.min': 'Stock cannot be negative',
  }),
});

export const bookIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid book ID format',
      'any.required': 'Book ID is required',
    }),
});
