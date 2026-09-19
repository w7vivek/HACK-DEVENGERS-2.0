import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login or signup attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
