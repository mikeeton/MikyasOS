import Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  API_PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  REDIS_URL: Joi.string()
    .uri({ scheme: ['redis', 'rediss'] })
    .required(),
  JWT_SECRET: Joi.string().min(24).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
  CLOUDFLARE_R2_ACCOUNT_ID: Joi.string().allow('').optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: Joi.string().allow('').optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: Joi.string().allow('').optional(),
  CLOUDFLARE_R2_BUCKET: Joi.string().allow('').optional(),
  OPENROUTER_API_KEY: Joi.string().allow('').optional(),
  OPENROUTER_BASE_URL: Joi.string().uri().default('https://openrouter.ai/api/v1'),
});
