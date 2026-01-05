import { Request, Response } from 'express';
import prisma from '../prisma';
import { createOrderSchema } from '../schemas/order.schema';
import { updateOrderStatusSchema } from '../schemas/order-status.schema';

/* ─────────────────────────────
   CREATE ORDER
───────────────────────────── */
export async function createOrder(req: Request, res: Response) {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const userId = req.user!.userId;
  const { items } = parsed.data;

  try {
    const order = await prisma.$transaction(async (tx) => {
      let total = 0;

      /* 1️⃣ Obtener inventarios de una sola vez */
      const inventories = await tx.inventory.findMany({
        where: {
          product_id: {
            in: items.map(i => i.product_id),
          },
        },
        include: {
          products: true,
        },
      });

      const inventoryMap = new Map(
        inventories.map(inv => [inv.product_id, inv])
      );

      /* 2️⃣ Validar stock y calcular total */
      for (const item of items) {
        const inventory = inventoryMap.get(item.product_id);

        if (!inventory || inventory.stock < item.quantity) {
          throw new Error('INSUFFICIENT_STOCK');
        }

        total += Number(inventory.products.price) * item.quantity;
      }

      /* 3️⃣ Crear orden */
      const order = await tx.orders.create({
        data: {
          user_id: userId,
          total,
          status: 'PENDING',
        },
      });

      /* 4️⃣ Crear items y descontar stock */
      for (const item of items) {
        const inventory = inventoryMap.get(item.product_id)!;

        await tx.order_items.create({
          data: {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: inventory.products.price,
          },
        });

        await tx.inventory.update({
          where: { product_id: item.product_id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    return res.status(201).json(order);
  } catch (error: any) {
    if (error.message === 'INSUFFICIENT_STOCK') {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    return res.status(500).json({ error: 'Failed to create order' });
  }
}

/* ─────────────────────────────
   LIST MY ORDERS (PAGINATED)
───────────────────────────── */
export async function listMyOrders(req: Request, res: Response) {
  const userId = req.user!.userId;
  const page = Number(req.query.page ?? 1);
  const pageSize = 10;

  const orders = await prisma.orders.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: 'desc',
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      order_items: {
        include: {
          products: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
  });

  return res.json(orders);
}

/* ─────────────────────────────
   GET ORDER BY ID
───────────────────────────── */
export async function getOrderById(req: Request, res: Response) {
  const orderId = req.params.id;
  const { userId, roleId } = req.user!;

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      order_items: {
        include: {
          products: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
      payments: true,
    },
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  /* CUSTOMER solo ve sus pedidos */
  if (roleId !== 1 && order.user_id !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  return res.json(order);
}

/* ─────────────────────────────
   UPDATE ORDER STATUS (ADMIN)
───────────────────────────── */
export async function updateOrderStatus(req: Request, res: Response) {
  const orderId = req.params.id;
  const parsed = updateOrderStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { status } = parsed.data;

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      order_items: true,
    },
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status === 'CANCELLED') {
    return res
      .status(400)
      .json({ error: 'Cancelled orders cannot be modified' });
  }

  /* CANCELLED → rollback stock */
  if (status === 'CANCELLED') {
    await prisma.$transaction(async (tx) => {
      for (const item of order.order_items) {
        await tx.inventory.update({
          where: { product_id: item.product_id },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      await tx.orders.update({
        where: { id: orderId },
        data: { status },
      });
    });

    return res.json({ message: 'Order cancelled and stock restored' });
  }

  const updated = await prisma.orders.update({
    where: { id: orderId },
    data: { status },
  });

  return res.json(updated);
}

/* ─────────────────────────────
   CANCEL MY ORDER (USER)
───────────────────────────── */
export async function cancelMyOrder(req: Request, res: Response) {
  const orderId = req.params.id;
  const userId = req.user!.userId;

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      order_items: true,
    },
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.user_id !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (order.status !== 'PENDING') {
    return res.status(400).json({
      error: 'Only PENDING orders can be cancelled',
    });
  }

  await prisma.$transaction(async (tx) => {
    for (const item of order.order_items) {
      await tx.inventory.update({
        where: { product_id: item.product_id },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    await tx.orders.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  });

  return res.json({ message: 'Order cancelled successfully' });
}
