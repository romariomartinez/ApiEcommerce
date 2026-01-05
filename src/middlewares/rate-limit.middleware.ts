import rateLimit from 'express-rate-limit';

/**
 * Rate limit general (lecturas, navegación)
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // 300 requests / IP
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limit estricto para autenticación
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos
  message: 'Too many login attempts, try again later',
});

/**
 * Rate limit para operaciones críticas (pedidos)
 */
export const orderLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 20, // 20 pedidos
  message: 'Too many order requests',
});
