import Joi from 'joi';

// Chat message validation schema
export const chatMessageSchema = Joi.object({
  message: Joi.string().required().min(1).max(1000),
  imageUrl: Joi.string().uri().optional(),
});

// User profile validation schema
export const userProfileSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  picture: Joi.string().uri().optional(),
});

// Article validation schema
export const articleSchema = Joi.object({
  title: Joi.string().required().min(5).max(100),
  description: Joi.string().required().min(10).max(500),
  category: Joi.string().required(),
  subCategory: Joi.string().required(),
  content: Joi.array().items(Joi.string()).min(1).required(),
});

// Search query validation schema
export const searchQuerySchema = Joi.object({
  query: Joi.string().required().min(1).max(100),
  filters: Joi.object({
    category: Joi.string().optional(),
    date: Joi.date().optional(),
    sort: Joi.string().valid('recent', 'popular', 'relevant').optional(),
  }).optional(),
}); 