import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import prisma from './prisma';
import swaggerOptions from './config/swagger';

// Routes
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import productRoutes from './routes/product.routes';
import productImageRoutes from './routes/product-image.routes';
import orderRoutes from './routes/order.routes';
import adminReportRoutes from './routes/admin-report.routes';
import stripeRoutes from './routes/stripe.routes';
import addressRoutes from './routes/address.routes';

// Middlewares
import { httpLogger } from './middlewares/logger.middleware';
import { generalLimiter } from './middlewares/rate-limit.middleware';



const app = express();
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/* ─────────────────────────────
   Global middlewares (FIRST)
───────────────────────────── */
app.use(httpLogger);
app.use(generalLimiter);

/* ─────────────────────────────
   Body parsers
───────────────────────────── */
// JSON for normal routes
app.use(express.json());

/* ─────────────────────────────
   Technical routes
───────────────────────────── */
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ─────────────────────────────
   API v1
───────────────────────────── */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/products', productImageRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin/reports', adminReportRoutes);
app.use('/api/v1/addresses', addressRoutes);

/* ─────────────────────────────
   Stripe webhook (RAW body)
───────────────────────────── */
app.use(
  '/api/v1/stripe',
  express.raw({ type: 'application/json' }),
  stripeRoutes
);

/* ─────────────────────────────
   Documentation
───────────────────────────── */
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ─────────────────────────────
   404 handler
───────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'Route not found',
  });
});

export default app;
