import { Request, Response } from 'express';
import prisma from '../prisma';
import stripe from '../config/stripe';

export async function createPaymentIntent(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { orderId } = req.body;

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
  });

  if (!order || order.user_id !== userId) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status !== 'PENDING') {
    return res.status(400).json({ error: 'Order is not payable' });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.total) * 100),
    currency: 'usd',
    metadata: { orderId },
  });

  await prisma.payments.create({
    data: {
      order_id: order.id,
      provider: 'STRIPE',
      status: 'PENDING',
      transaction_id: paymentIntent.id,
      amount: order.total,
    },
  });

  return res.json({
    clientSecret: paymentIntent.client_secret,
  });
}
