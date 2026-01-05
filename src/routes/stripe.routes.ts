import { Router, raw } from 'express';
import { stripeWebhook } from '../controllers/stripe-webhook.controller';

const router = Router();

/* ─────────────────────────────
   Stripe Webhook
   ⚠️ RAW body REQUIRED
───────────────────────────── */

/**
 * @openapi
 * /stripe/webhook:
 *   post:
 *     summary: Webhook de Stripe (uso interno)
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Evento procesado
 *       400:
 *         description: Firma inválida
 */
router.post(
  '/webhook',
  raw({ type: 'application/json' }),
  stripeWebhook
);

export default router;
