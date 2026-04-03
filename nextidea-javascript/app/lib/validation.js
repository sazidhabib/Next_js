import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
    }),
  password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const contactSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[+]?[\d\s-()]+$/).max(50).allow(''),
  company: Joi.string().max(255).allow(''),
  service: Joi.string().max(100).allow(''),
  message: Joi.string().min(10).max(5000).required(),
});

export const portfolioSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(10000).allow(''),
  category_id: Joi.number().integer().positive().allow(null),
  client_name: Joi.string().max(255).allow(''),
  client_website: Joi.string().uri().allow(''),
  project_date: Joi.date().allow(null),
  completion_date: Joi.date().allow(null),
  featured: Joi.boolean().default(false),
  is_active: Joi.boolean().default(true),
  meta_title: Joi.string().max(255).allow(''),
  meta_description: Joi.string().max(500).allow(''),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      alt_text: Joi.string().max(255).allow(''),
      sort_order: Joi.number().integer().min(0).default(0),
      is_primary: Joi.boolean().default(false),
    })
  ).default([]),
  technologies: Joi.array().items(Joi.string().max(100)).default([]),
});

export const categorySchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(1000).allow(''),
  sort_order: Joi.number().integer().min(0).default(0),
  is_active: Joi.boolean().default(true),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export function validateInput(data, schema) {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return { valid: false, errors: messages };
  }
  
  return { valid: true, value };
}

export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function sanitizeOutput(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function paginate(items, page, limit, total) {
  const totalPages = Math.ceil(total / limit);
  return {
    items,
    pagination: {
      current_page: page,
      per_page: limit,
      total_items: total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    },
  };
}
