import { Request, Response } from 'express';
import prisma from '../prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

/* ─────────────────────────────
   STRIPE WEBHOOK (IDEMPOTENT)
───────────────────────────── */
export async function stripeWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return res.status(400).send('Missing stripe signature');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // Firma inválida → Stripe debe saberlo
    return res.status(400).send('Invalid signature');
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata?.orderId;

        if (!orderId) {
          // Metadata corrupta → NO reintentar
          return res.status(200).json({ received: true });
        }

        await prisma.$transaction(async (tx) => {
          const payment = await tx.payments.findFirst({
            where: { transaction_id: intent.id },
          });

          // 👉 IDEMPOTENCIA
          if (!payment || payment.status === 'CONFIRMED') {
            return;
          }

          await tx.payments.update({
            where: { id: payment.id },
            data: {
              status: 'CONFIRMED',
            },
          });

          const order = await tx.orders.findUnique({
            where: { id: orderId },
          });

          if (!order || order.status === 'PAID') {
            return;
          }

          await tx.orders.update({
            where: { id: orderId },
            data: { status: 'PAID' },
          });
        });

        break;
      }

      default:
        // Otros eventos se ignoran explícitamente
        break;
    }

    // Stripe SOLO necesita 200
    return res.status(200).json({ received: true });
  } catch (err) {
    // Error interno → NO le digas a Stripe que falló
    // para evitar reintentos infinitos
    console.error('Stripe webhook error:', err);
    return res.status(200).json({ received: true });
  }
}
